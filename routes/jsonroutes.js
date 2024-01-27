const express = require("express");
const router = express.Router();
const checkUserAuth = require("../middlewares/auth-middleware.js");
const jsonController = require("../controllers/jsonController.js");

// Route level Middleware
// router.use("/changepassword", checkUserAuth);
// router.use("/loggeduser", checkUserAuth);

// PUBLIC ROUTE
router.get("/json", jsonController.createJson);
// router.put("/questions/:id", questionController.updatequestion);
// router.delete("/questions/:id", questionController.deletequestion);
// router.get("/questions", questionController.getallquestion);
// router.get("/questions/search", questionController.searchquestion);
// router.get("/questions/sort", questionController.sortquestion);

module.exports = router;
