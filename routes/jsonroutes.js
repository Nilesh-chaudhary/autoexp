const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middlewares/auth-middleware.js");
const jsonController = require("../controllers/jsonController.js");

// PUBLIC ROUTE
router.post("/json", jsonController.createJson);
router.get("/total", jsonController.getTotal);

module.exports = router;
