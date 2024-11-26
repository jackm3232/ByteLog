const User = require("../models/User");
const ItemTemplate = require("../models/ItemTemplate");
const DailyLog = require("../models/DailyLog");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler (async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users?.length) {
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

const createNewUser = asyncHandler (async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required in body" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userObject = { username, "password": hashedPassword };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  }
  else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

const updateUser = asyncHandler (async (req, res) => {
  const { id, username, password } = req.body;

  if (!id || !username) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  user.username = username;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

const deleteUser = asyncHandler (async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const { username, _id } = user;

  await ItemTemplate.deleteMany({ user: id });
  await DailyLog.deleteMany({ user: id });

  await user.deleteOne();

  const reply = `Username ${username} with ID ${_id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser
};
