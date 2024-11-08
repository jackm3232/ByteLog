const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number
  },
  protein: {
    type: Number
  },
  carbohydrates: {
    type: Number
  },
  fat: {
    type: Number
  }
});

module.exports = mongoose.model("Item", itemSchema);
