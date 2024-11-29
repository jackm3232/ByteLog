const ItemTemplate = require("../models/ItemTemplate");
const asyncHandler = require("express-async-handler");

const getAllItemTemplates = asyncHandler(async (req, res) => {
  const { user } = req.params;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  const itemTemplates = await ItemTemplate.find({ user }).lean();

  if (!itemTemplates.length) {
    return res.status(400).json({ message: "No item templates found" });
  }
  res.json(itemTemplates);
});

const createItemTemplate = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { name, calories, protein } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!name || !calories || !protein) {
    return res.status(400).json({ message: "Name, calories, and protein required in body" });
  }

  const duplicate = await ItemTemplate.findOne({ user, name }).exec();

  if (duplicate) {
    return res.status(409).json({ message: `Item template with name "${name}" already exists` });
  }

  const newItemTemplate = await ItemTemplate.create({
    user,
    name,
    calories,
    protein
  });

  if (newItemTemplate) {
    res.status(201).json({ message: `Item template "${name}" created` });
  } 
  else {
    res.status(400).json({ message: "Invalid item template data received" });
  }
});

const updateItemTemplate = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { id, name, calories, protein } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!id || !name || !calories || !protein) {
    return res.status(400).json({ message: "Item template ID, name, calories, and protein required in body" });
  }

  const itemTemplate = await ItemTemplate.findOne({ user, _id: id }).exec();

  if (!itemTemplate) {
    return res.status(400).json({ message: "Item template not found" });
  }

  if (name !== itemTemplate.name) {
    const duplicate = await ItemTemplate.findOne({ user, name }).exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: `Item template with name "${name}" already exists` });
    }

    itemTemplate.name = name;
  }

  itemTemplate.calories = calories;
  itemTemplate.protein = protein;

  const updatedItemTemplate = await itemTemplate.save();
  res.json({ message: `Item template "${updatedItemTemplate.name}" updated` });
});

const deleteItemTemplate = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { id } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!id) {
    return res.status(400).json({ message: "Item template ID required in body" });
  }

  const itemTemplate = await ItemTemplate.findOne({ user, _id: id }).exec();
  
  if (!itemTemplate) {
    return res.status(400).json({ message: "Item template not found" });
  }

  const name = itemTemplate.name;
  await itemTemplate.deleteOne();
  
  res.json({ message: `Item template "${name}" deleted` });
});

module.exports = {
  getAllItemTemplates,
  createItemTemplate,
  updateItemTemplate,
  deleteItemTemplate
};
