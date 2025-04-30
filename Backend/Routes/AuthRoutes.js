const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserBasic, UserDetails } = require("../Models/User");
const router = express.Router();
require("dotenv").config();
router.post("/signup", async (req, res) => {
  const { name, age,email, password } = req.body;

  try {
    let user = await UserBasic.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new UserBasic({
      name,
      email,
      password: hashedPassword,
      age:age,
    });

    await user.save();

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
router.post("/save-details", async (req, res) => {
  const { email, gender, maritalStatus, occupation, employmentStatus, education,address,phone } = req.body;

  try {
    console.log("Received data:", req.body);
    const user = await UserBasic.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not registered yet" });

    let userDetails = await UserDetails.findOne({ email });

    if (userDetails) {
      return res.status(400).json({ msg: "Personal details already exist" });
    }

    userDetails = new UserDetails({
      email,
      gender,
      maritalStatus,
      occupation,
      employmentStatus,
      education,
      address,
      phone,
    });
console.log("saving done")
    await userDetails.save();
console.log("now done")
    res.json({ msg: "Personal details saved successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Login route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserBasic.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
const authMiddleware = (req, res, next) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await UserBasic.findById(req.user).select("-password");
    console.log(user.email)
    const userDetails = await UserDetails.findOne({ email: user.email });

    res.json({ user, userDetails });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});
router.put("/update-profile", authMiddleware, async (req, res) => {
  const { name, age, gender, maritalStatus, occupation, employmentStatus, education, address, phone } = req.body;

  try {
    const user = await UserBasic.findById(req.user);
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (name) user.name = name;
    if (age) user.age = age;
    await user.save();
    let details = await UserDetails.findOne({ email: user.email });
    if (!details) {
      details = new UserDetails({ email: user.email });
    }

    details.gender = gender;
    details.maritalStatus = maritalStatus;
    details.occupation = occupation;
    details.employmentStatus = employmentStatus;
    details.education = education;
    details.address = address;
    details.phone = phone;

    await details.save();

    res.json({ msg: "Profile updated successfully", user, userDetails: details });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});



module.exports = router;
