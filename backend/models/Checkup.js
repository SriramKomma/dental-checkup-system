const mongoose = require("mongoose");

const CheckupSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  dentistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Dentist",
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  comments: {
    type: String,
  },
});

module.exports = mongoose.model("Checkup", CheckupSchema);
