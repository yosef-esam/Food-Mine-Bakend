import { Router } from "express";
import { FoodModel } from "../models/food.model.js";
import handler from "express-async-handler";
import admin from "../middleware/admin.mid.js";
const router = Router();

router.get(
  "/",
  handler(async (req, res) => {
    const foods = await FoodModel.find({});
    res.send(foods);
  })
);

router.delete(
  "/:foodId",
  admin,
  handler(async (req, res) => {
    const { foodId } = req.params;
    await FoodModel.deleteOne({ _id: foodId });
    res.send();
  })
);
router.get(
  "/tags",
  handler(async (req, res) => {
    const tags = await FoodModel.aggregate([
      {
        $unwind: "$tag",
      },
      {
        $group: {
          _id: "$tag",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          tag: "$_id",
          count: "$count",
        },
      },
    ]).sort({ count: -1 });
    const all = {
      tag: "All",
      count: await FoodModel.countDocuments(),
    };
    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/search/:searchTerm",
  handler(async (req, res) => {
    const { searchTerm } = req.params;
    const searchRegx = new RegExp(searchTerm, "i");
    const foods = await FoodModel.find({
      name: { $regex: searchRegx },
    });

    res.send(foods);
  })
);

router.get(
  "/:foodId",
  handler(async (req, res) => {
    const { foodId } = req.params;
    const food = await FoodModel.findById(foodId);
    res.send(food);
  })
);

router.get(
  "/tags/:tag",
  handler(async (req, res) => {
    const { tag } = req.params;
    const food = await FoodModel.find({ tag });
    res.send(food);
  })
);
router.post(
  "/",
  admin,
  handler(async (req, res) => {
    const { name, price, tag, favorite, imageUrl, origins, cookTime } =
      req.body;

    const food = new FoodModel({
      name,
      price,
      tag: tag.split ? tag.split(",") : tag,
      favorite,
      imageUrl,
      origins,
      cookTime,
    });
    await food.save();
    res.send(food);
  })
);
router.put(
  "/",
  admin,
  handler(async (req, res) => {
    const { _id, name, price, tag, favorite, imageUrl, origins, cookTime } =
      req.body;

    await FoodModel.updateOne(
      { _id },

      {
        name,
        price,
        tag,
        favorite,
        imageUrl,
        origins,
        cookTime,
      }
    );

    res.send();
  })
);

export default router;
