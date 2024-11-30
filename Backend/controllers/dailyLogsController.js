const DailyLog = require("../models/DailyLog");
const asyncHandler = require("express-async-handler");

const getAllDailyLogs = asyncHandler(async (req, res) => {
  const { user } = req.params;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  const dailyLogs = await DailyLog.find({ user }).lean();

  if (!dailyLogs.length) {
    return res.status(400).json({ message: "No daily logs found" });
  }
  res.json(dailyLogs);
});

const createDailyLog = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { date, calories, protein } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!date || !calories || !protein) {
    return res.status(400).json({ message: "Date, calories, and protein required in body" });
  }

  const duplicate = await DailyLog.findOne({ user, date }).collation({ locale: "en", strength: 2 }).exec();

  if (duplicate) {
    return res.status(409).json({ message: "A daily log already exists for this date" });
  }

  const newDailyLog = await DailyLog.create({
    user, 
    date, 
    calories,
    protein 
  });

  if (newDailyLog) {
    res.status(201).json({ message: `Daily log created for ${date}` });
  } 
  else {
    res.status(400).json({ message: "Invalid daily log data received" });
  }
});

const updateDailyLog = asyncHandler(async (req, res) => {
  const { user } = req.params;
  const { id, date, calories, protein } = req.body;

  if (!user) {
    return res.status(400).json({ message: "User ID required in URL" });
  }

  if (!id || !date || !calories || !protein) {
    return res.status(400).json({ message: "Daily log ID, date, calories, and protein required in body" });
  }

  const dailyLog = await DailyLog.findOne({ user, _id: id }).exec();
  if (!dailyLog) {
    return res.status(404).json({ message: "Daily log not found" });
  }

  if (date.toString() !== dailyLog.date.toString()) {
    const duplicate = await DailyLog.findOne({ user, date }).collation({ locale: "en", strength: 2 }).exec();

    if (duplicate && duplicate?._id.toString() !== id) {
      return res.status(409).json({ message: "A daily log already exists for this date" });
    }

    dailyLog.date = date;
  }

  dailyLog.calories = calories;
  dailyLog.protein = protein;

  const updatedDailyLog = await dailyLog.save();

  const formattedDate = updatedDailyLog.date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  res.json({ message: `Daily log updated for ${formattedDate}` });
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

  const formattedDate = dailyLog.date.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  await dailyLog.deleteOne();

  res.json({ message: `Daily log for ${formattedDate} deleted` });
});

module.exports = {
  getAllDailyLogs,
  createDailyLog,
  updateDailyLog,
  deleteDailyLog
};
