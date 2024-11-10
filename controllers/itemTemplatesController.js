const ItemTemplate = require("../models/ItemTemplate");
const asyncHandler = require("express-async-handler");

const getAllItemTemplates = asyncHandler(async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required" });
  }

  const itemTemplates = await ItemTemplate.find({ user: user }).lean();
  if (!itemTemplates.length) {
    return res.status(400).json({ message: "No items found" });
  }
  res.json(itemTemplates);
});

const createItemTemplate = asyncHandler(async (req, res) => {
  const { user, name, calories, protein, carbohydrates, fat } = req.body;

  if (!user || !name) {
    return res.status(400).json({ message: "User and name fields are required" });
  }

  const duplicate = await ItemTemplate.findOne({ user, name }).exec();
  if (duplicate) {
    return res.status(409).json({ message: `Item template with name ${name} already exists for this user` });
  }

  const newItemTemplate = await ItemTemplate.create({
    user,
    name,
    calories,
    protein,
    carbohydrates,
    fat
  });

  if (newItemTemplate) {
    res.status(201).json({ message: `Item template ${name} created` });
  } 
  else {
    res.status(400).json({ message: "Invalid item template data received" });
  }
});

const updateItemTemplate = asyncHandler(async (req, res) => {
  const { id, name, calories, protein, carbohydrates, fat } = req.body;

  if (!id || !name) {
    return res.status(400).json({ message: "ID and name of item template are required" });
  }

  const itemTemplate = await ItemTemplate.findById(id).exec();

  if (!itemTemplate) {
    return res.status(400).json({ message: "Item template not found" });
  }

  const duplicate = await ItemTemplate.findOne({ name }).exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate item template name" });
  }

  itemTemplate.name = name;
  itemTemplate.calories = calories;
  itemTemplate.protein = protein;
  itemTemplate.carbohydrates = carbohydrates;
  itemTemplate.fat = fat;

  const updatedItemTemplate = await itemTemplate.save();
  res.json({ message: `Item ${updatedItemTemplate.name} updated` });
});

const deleteItemTemplate = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Item template ID required" });
  }

  const itemTemplate = await ItemTemplate.findById(id).exec();
  const name = itemTemplate.name;

  if (!itemTemplate) {
    return res.status(400).json({ message: "Item template not found" });
  }

  await itemTemplate.deleteOne();
  res.json({ message: `Item template ${name} with ID ${id} deleted` });
});

module.exports = {
  getAllItemTemplates,
  createItemTemplate,
  updateItemTemplate,
  deleteItemTemplate
};
