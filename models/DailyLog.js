const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  date: {
    type: Date,
    required: true
  },
  items: [{
    itemTemplate: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ItemTemplate"
    },
    quantity: {
      type: Number,
      default: 1
    }
  }]
});

module.exports = mongoose.model("DailyLog", dailyLogSchema);
