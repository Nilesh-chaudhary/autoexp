const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middlewares/auth-middleware.js");
const jsonController = require("../controllers/jsonController.js");

// PUBLIC ROUTE
router.post("/json", jsonController.createJson);
router.get("/total", jsonController.getTotal);
router.get("/fetchAll", jsonController.fetchAllTransactions);
router.get("/fetchDateTotal", jsonController.getDateWiseTotal);
router.get("/currmonth", jsonController.getCurrmonth);
router.get("/monthTotal", jsonController.getMonthTotal);
module.exports = router;
