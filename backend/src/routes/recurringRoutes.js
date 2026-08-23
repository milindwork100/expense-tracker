const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  createRecurring,
  getRecurring,
  toggleRecurring,
  deleteRecurring,
} = require("../controllers/recurringController");

router.use(protect);

router.post("/", createRecurring);
router.get("/", getRecurring);
router.patch("/:id/toggle", toggleRecurring);
router.delete("/:id", deleteRecurring);

module.exports = router;
