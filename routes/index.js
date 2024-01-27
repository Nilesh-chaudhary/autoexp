const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const userRouter = require("./userRoutes.js");
const jsonRouter = require("./jsonroutes.js");

router.get("/", (req, res) => {
  res.send("Welcome to exptracker");
});

router.use("/user", userRouter);
router.use("/json", jsonRouter);

module.exports = router;
