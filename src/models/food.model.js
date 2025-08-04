import { Schema, model } from "mongoose";

const FoodSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    cookTime: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    origins: { type: String, required: true },
    stars: { type: Number, default: 3 },
    imageUrl: { type: String, required: true },
    tag: { type: [String] },
  },
  {
    timestamps: true,
    toJson: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

export const FoodModel = model("food", FoodSchema);
