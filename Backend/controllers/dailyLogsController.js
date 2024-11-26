const DailyLog = require("../models/DailyLog");
const asyncHandler = require("express-async-handler");

const getAllDailyLogs = asyncHandler(async (req, res) => {
  const { user } = req.params;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  const dailyLogs = await DailyLog.find({ user }).populate("items.itemTemplate").lean();

  if (!dailyLogs.length) {
    return res.status(400).json({ message: "No daily logs found for this user" });
  }
  res.json(dailyLogs);
});

const createDailyLog = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { date, items } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!date || !items || !items.length) {
    return res.status(400).json({ message: "User, date, and items required in body" });
  }

  const duplicate = await DailyLog.findOne({ user, date }).exec();
  if (duplicate) {
    return res.status(409).json({ message: "Daily log already exists for this date" });
  }

  const newDailyLog = await DailyLog.create({
    user, 
    date, 
    items 
  });
  res.status(201).json({ message: "Daily log created", dailyLog: newDailyLog });
});

const updateDailyLog = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { id, date, items } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!id || !date || !items || !items.length) {
    return res.status(400).json({ message: "Daily log ID, date, and items required in body" });
  }

  const dailyLog = await DailyLog.findOne({ user, _id: id }).exec();
  if (!dailyLog) {
    return res.status(404).json({ message: "Daily log not found" });
  }

  if (date.toString() !== dailyLog.date.toString()) {
    const duplicate = await DailyLog.findOne({ user, date }).exec();

    if (duplicate) {
      return res.status(409).json({ message: "A daily log already exists for this date" });
    }

    dailyLog.date = date;
  }

  for (const { itemTemplate, quantity } of items) {
    const existingItem = dailyLog.items.find(
      item => item.itemTemplate.toString() === itemTemplate.toString()
    );

    if (existingItem) {
      existingItem.quantity = quantity;
    } 
    else {
      dailyLog.items.push({ itemTemplate, quantity });
    }
  }

  const updatedDailyLog = await dailyLog.save();
  res.json({ message: "Daily log updated", dailyLog: updatedDailyLog });
});

const deleteDailyLog = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { id } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!id) {
    return res.status(400).json({ message: "Daily log ID required in body" });
  }

  const dailyLog = await DailyLog.findOne({ user, _id: id }).exec();

  if (!dailyLog) {
    return res.status(404).json({ message: "Daily log not found" });
  }

  await dailyLog.deleteOne();
  res.json({ message: `Daily log for ${dailyLog.date} with ID ${id} deleted` });
});

module.exports = {
  getAllDailyLogs,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog
};
