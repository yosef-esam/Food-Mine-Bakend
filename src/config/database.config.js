import { set, connect } from "mongoose";
import { UserModel } from "../models/user.model.js";
import { FoodModel } from "../models/food.model.js";
import { sample_food } from "../Data.js";
import { sample_users } from "../Data.js";
import bcrypt from "bcryptjs";

const PASSWORD_HASH_SALT = 10;
set("strictQuery", true);

export const dbconnect = async () => {
  try {
    connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
    await UserSeed();
    await FoodSeed();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

const UserSeed = async () => {
  const userCount = await UserModel.countDocuments();
  if (userCount > 0) {
    console.log("Users already seeded");
    return;
  }

  for (let user of sample_users) {
    user.password = await bcrypt.hash(user.password, PASSWORD_HASH_SALT);

    await UserModel.create(user);
  }
  console.log("Users seeded successfully");
};

const FoodSeed = async () => {
  const foodCount = await FoodModel.countDocuments();
  if (foodCount > 0) {
    console.log("Food already seeded");
    return;
  }
  for (let food of sample_food) {
    food.imageUrl = `/Food/${food.imageUrl}`;
    await FoodModel.create(food);
    console.log("food seeded successfully");
  }
};
