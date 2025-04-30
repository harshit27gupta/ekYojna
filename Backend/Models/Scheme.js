const mongoose = require("mongoose");

const SchemeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  link: { type: String, required: true },
  description: { type: String },
  eligibility: { type: String },
  category: { type: String },
  subCategory: { type: String },
});


module.exports = mongoose.model("Scheme", SchemeSchema);
