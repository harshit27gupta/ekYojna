const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
const authRoutes = require("./Routes/AuthRoutes");
app.use("/auth", authRoutes);
const schemeRoutes = require("./Routes/schemeRoutes");
app.use("/schemes", schemeRoutes);
app.get("/", (req, res) => {
  res.send(" API is Running...");
});

module.exports = app;
