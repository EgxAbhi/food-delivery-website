import foodModel from "../models/foodModel.js";
import fs from "fs";

//ADD AN ITEM:
// backend/controllers/foodController.js (inside addFoodItem, at start of try)

export const addFoodItem = async (req, res) => {
  console.log("--- addFoodItem incoming ---");
  console.log("content-type:", req.headers["content-type"]);
  console.log("file:", req.file);
  console.log("body:", req.body);
  try {
    // Validate file
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "Image file ('image') is required" });
    }

    // Validate body fields
    const { name, description, price, category } = req.body;
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        message: "Missing required fields: name, description, price, category",
      });
    }

    // Safe filename and numeric price
    const image_name = req.file.filename;
    const parsedPrice = Number(price);
    if (Number.isNaN(parsedPrice)) {
      return res.status(400).json({ message: "Price must be a number" });
    }

    const food = new foodModel({
      name,
      description,
      price: parsedPrice,
      image: image_name,
      category,
    });

    await food.save();
    return res
      .status(201)
      .json({ message: "Food Item Added Successfully", food });
  } catch (error) {
    console.error("addFoodItem error:", error);
    return res
      .status(500)
      .json({ message: "Error in adding food item", error: error.message });
  }
};

//All food list:
export const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    return res.status(200).json({ data: foods });
  } catch (error) {
    console.error("listFood error:", error);
    return res
      .status(500)
      .json({ message: "Error in listing food items", error: error.message });
  }
};

//REMOVE FOOD ITEMS:
export const removeFood = async (req, res) => {
  try {
    console.log("removeFood called with body:", req.body);

    // Accept _id from body, form, query or params
    const _id =
      req.body?._id ?? req.body?.id ?? req.query?._id ?? req.params?.id;
    if (!_id) {
      console.log("removeFood: missing _id");
      return res
        .status(400)
        .json({ message: "Missing _id in request (body/query/params)" });
    }

    const food = await foodModel.findById(_id);
    if (!food) {
      console.log("removeFood: item not found for id", _id);
      return res.status(404).json({ message: "Food item not found" });
    }

    // delete image file if present, ignore if file missing
    if (food.image) {
      try {
        await fs.promises.unlink(`uploads/${food.image}`);
        console.log("removeFood: deleted image", food.image);
      } catch (err) {
        if (err.code !== "ENOENT") {
          console.error("removeFood: error deleting image file:", err);
        } else {
          console.log("removeFood: image file not found, skipping delete");
        }
      }
    }

    const deleted = await foodModel.findByIdAndDelete(_id);
    if (!deleted) {
      console.log("removeFood: failed to delete DB record for id", _id);
      return res.status(500).json({ message: "Failed to delete food item" });
    }

    console.log("removeFood: deleted db entry for id", _id);
    return res.status(200).json({ message: "Food Item Removed Successfully" });
  } catch (error) {
    console.error("removeFood error:", error);
    return res
      .status(500)
      .json({ message: "Error in removing food item", error: error.message });
  }
};
