const DailyLog = require("../models/DailyLog");
const asyncHandler = require("express-async-handler");

const getAllDailyLogs = asyncHandler(async (req, res) => {
  const { user } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required" });
  }

  const dailyLogs = await DailyLog.find({ user }).populate("items.itemTemplate").lean();

  if (!dailyLogs.length) {
    return res.status(400).json({ message: "No daily logs found for this user" });
  }
  res.json(dailyLogs);
});

const createOrUpdateDailyLog = asyncHandler(async (req, res) => {
  const { user, date, items } = req.body;

  if (!user || !date || !items || !items.length) {
    return res.status(400).json({ message: "User, date, and items are required" });
  }

  let dailyLog = await DailyLog.findOne({ user, date }).exec();

  if (!dailyLog) {
    dailyLog = new DailyLog({
      user,
      date,
      items: []
    });
  }

  for (const { itemTemplate, quantity } of items) {
    const existingItem = dailyLog.items.find(item => item.itemTemplate.toString() === itemTemplate.toString());

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
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Daily log ID required" });
  }

  const dailyLog = await DailyLog.findById(id).exec();

  if (!dailyLog) {
    return res.status(404).json({ message: "Daily log not found" });
  }

  await dailyLog.deleteOne();
  res.json({ message: `Daily log for ${dailyLog.date} with ID ${id} deleted` });
});

module.exports = {
  getAllDailyLogs,
  createOrUpdateDailyLog,
  deleteDailyLog
};
