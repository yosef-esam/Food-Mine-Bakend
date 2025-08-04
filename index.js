import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import FoodRouter from "./src/routers/food.router.js";
import UserRouter from "./src/routers/user.router.js";
import { dbconnect } from "./src/config/database.config.js";
import OrderRouter from "./src/routers/order.router.js";
import uploadRouter from "./src/routers/upload.router.js";

dbconnect();

const app = express();
app.use(express.json());

const allowedOrigins = [
  "http://localhost:5173",
  "https://food-hub-rho-silk.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.get('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌍🌍🌍✨🌈🦄',
  });
});

// app.use("/api/foods", FoodRouter);
// app.use("/api/users", UserRouter);
// app.use("/api/orders", OrderRouter);
// app.use("/api/upload", uploadRouter);

// ✅ Export the Express app for Vercel
if (process.env.NODE_ENV !== "production") {
  const port = 5000;
  app.listen(port, () => {
    console.log(`Server running locally on port ${port}`);
  });
}

export default app;