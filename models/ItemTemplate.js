const mongoose = require("mongoose");

const itemTemplateSchema = new mongoose.Schema({
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

module.exports = mongoose.model("ItemTemplate", itemTemplateSchema);