import { model, Schema } from "mongoose";
import { FoodModel } from "./food.model.js";
export const LatLngSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  {
    _id: false,
  }
);
export const OrderItemSchema = new Schema(
  {
    food: { type: FoodModel.schema, required: true },
    quentity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  {
    _id: false,
  }
);

const OrderSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    addressLatLng: { type: LatLngSchema, required: true },
    paymentId: { type: String },
    items: { type: [OrderItemSchema], required: true },

    TotalPrice: { type: Number, required: true },
    status: { type: String, default: "new" },
    user: { type: Schema.Types.ObjectId, required: true, ref: "user" },
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

export const OrderModel = model("order", OrderSchema);
