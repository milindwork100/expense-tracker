const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getSummary,
} = require("../controllers/transactionController");

router.use(protect);

router.post("/", upload.single("receipt"), createTransaction);
router.get("/", getTransactions);
router.get("/summary", getSummary);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
