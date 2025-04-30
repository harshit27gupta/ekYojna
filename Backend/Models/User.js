const mongoose = require("mongoose");
const UserBasicSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },

}, { timestamps: true });

const UserBasic = mongoose.model("UserBasic", UserBasicSchema);
const UserDetailsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, ref: "UserBasic" }, 
  gender: { type: String, enum: ["male", "female", "other"], default: "other" },
  maritalStatus: { type: String, enum: ["single", "married"], default: "single" },
  occupation: { type: String, default: "unemployed" },
  employmentStatus: { type: String, enum: ["employed", "unemployed", "self-employed"], default: "unemployed" },
  education: { type: String, default: "Not Specified" },
  address: { type: String, default: "Not Specified" },
  phone: { type: String, default: "Not Specified", required: true, unique: true, },
}, { timestamps: true });

const UserDetails = mongoose.model("UserDetails", UserDetailsSchema);

module.exports = { UserBasic, UserDetails };

