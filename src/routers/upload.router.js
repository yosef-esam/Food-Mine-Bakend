import { Router } from "express";
import admin from "../middleware/admin.mid.js";
import multer from "multer";
import handler from "express-async-handler";
import { configCloudinary } from "../config/cloudinary.config.js";
import path from "path";
import fs from "fs";

const router = Router();
const upload = multer();

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post(
  "/",
  admin,
  upload.single("image"),
  handler(async (req, res) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ 
          error: "No image file provided" 
        });
      }

      // Validate file type
      if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ 
          error: "File must be an image" 
        });
      }

      let imageUrl;

      // Try Cloudinary first, fallback to local storage
      if (process.env.CLOUDINARY_CLOUD_NAME && 
          process.env.CLOUDINARY_API_KEY && 
          process.env.CLOUDINARY_API_SECRET) {
        try {
          imageUrl = await uploadImageToCloudinary(file.buffer);
        } catch (cloudinaryError) {
          console.error("Cloudinary upload failed, using local storage:", cloudinaryError);
          imageUrl = await uploadImageToLocal(file);
        }
      } else {
        // Use local storage when Cloudinary is not configured
        imageUrl = await uploadImageToLocal(file);
      }
      
      if (!imageUrl) {
        return res.status(500).json({ 
          error: "Failed to upload image" 
        });
      }

      res.json({ imageUrl });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({ 
        error: "Failed to upload image. Please try again." 
      });
    }
  })
);

const uploadImageToCloudinary = (imageBuffer) => {
  return new Promise((resolve, reject) => {
    if (!imageBuffer) {
      reject(new Error("No image buffer provided"));
      return;
    }

    try {
      const cloudinary = configCloudinary();

      cloudinary.uploader
        .upload_stream(
          { 
            angle: "exif",
            resource_type: "image"
          }, 
          (error, result) => {
            if (error) {
              console.error("Cloudinary upload error:", error);
              reject(error);
            } else if (!result) {
              reject(new Error("No result from Cloudinary"));
            } else {
              resolve(result.url);
            }
          }
        )
        .end(imageBuffer);
    } catch (error) {
      console.error("Cloudinary configuration error:", error);
      reject(error);
    }
  });
};

const uploadImageToLocal = (file) => {
  return new Promise((resolve, reject) => {
    try {
      const fileName = `food_${Date.now()}_${file.originalname}`;
      const filePath = path.join(uploadsDir, fileName);
      
      fs.writeFile(filePath, file.buffer, (error) => {
        if (error) {
          console.error("Local file write error:", error);
          reject(error);
        } else {
          // Return a relative URL that can be served by your backend
          const imageUrl = `/uploads/${fileName}`;
          resolve(imageUrl);
        }
      });
    } catch (error) {
      console.error("Local upload error:", error);
      reject(error);
    }
  });
};

export default router;
