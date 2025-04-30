const express = require("express");
const router = express.Router();

const Scheme = require("../Models/Scheme");
router.get("/", async (req, res) => {
  try {
    console.log("Fetching schemes from database...");

    const schemes = await Scheme.find();

    if (!schemes || schemes.length === 0) {
      return res.status(404).json({ msg: "No schemes found" });
    }
    res.status(200).json(schemes);
  } catch (err) {
    console.error("Error fetching schemes:", err.message);
    res.status(500).json({ msg: "Internal Server Error" });
  }
});

module.exports = router;
