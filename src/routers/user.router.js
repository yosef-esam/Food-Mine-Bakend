import { Router } from "express";
import jwt from "jsonwebtoken";
import handler from "express-async-handler";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/user.model.js";
import auth from "../middleware/auth.mid.js";
import admin from "../middleware/admin.mid.js";
const router = Router();

router.post(
  "/login",
  handler(async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (user.isBlocked) {
        return res.status(403).send("You are not allowed to login");
      }
      res.send(generateTokenResponse(user));
      return;
    }

    res.status(400).send("Invalid email or password");
  })
);

router.post(
  "/register",
  handler(async (req, res) => {
    const { name, email, password, address } = req.body;
    try {
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).send("Email already exists");
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
        address,
      });

      res.send(generateTokenResponse(newUser));
    } catch (err) {
      console.error("Error creating user:", err);
      return res
        .status(500)
        .json({ message: "Server error during registration" });
    }
  })
);
router.put(
  "/updateProfile",
  auth,
  handler(async (req, res) => {
    const { name, address } = req.body;
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      {
        name,
        address,
      },
      { new: true }
    );
    res.send(generateTokenResponse(user));
  })
);
router.put(
  "/changePassword",
  auth,
  handler(async (req, res) => {
    const { currentpassword, newpassword } = req.body;
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(401).send("Change Password failed");
    }
    const isMatch = await bcrypt.compare(currentpassword, user.password);
    if (!isMatch) {
      return res.status(401).send("Current password is incorrect");
    }
    user.password = await bcrypt.hash(newpassword, 10);
    await user.save();
    res.send();
  })
);
router.get(
  "/getAll/:searchTerm?",
  admin,
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const filter = searchTerm
      ? { name: { $regex: new RegExp(searchTerm, "i") } }
      : {};
    const users = await UserModel.find(filter, { password: 0 });
    res.send(users);
  })
);
router.get(
  "/getById/:userId",
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    const user = await UserModel.findById(userId, { password: 0 });
    res.send(user);
  })
);
router.put(
  "/EditUser",
  admin,
  handler(async (req, res) => {
    const { _id, name, email, address, isAdmin } = req.body;
    await UserModel.findOneAndUpdate(
      { _id },
      { name, email, address, isAdmin }
    );
    res.send();
  })
);
router.put(
  "/toggleBlock/:userId?",
  admin,
  handler(async (req, res) => {
    const { userId } = req.params;
    if (userId === req.user._id) {
      res.status(404).send("can't Block Yourself!");
      return;
    }
    const user = await UserModel.findById(userId);
    user.isBlocked = !user.isBlocked;

    await user.save();
    res.send(user.isBlocked);
  })
);

const generateTokenResponse = (user) => {
  const token = jwt.sign(
    { id: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
  return {
    id: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
    name: user.name,
    address: user.address,
    token,
  };
};

export default router;
