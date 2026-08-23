const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");

// Create or update a budget for a category/month/year
exports.setBudget = async (req, res) => {
  try {
    const { category, limit, month, year } = req.body;

    const budget = await Budget.findOneAndUpdate(
      { user: req.user._id, category, month, year },
      { limit },
      { new: true, upsert: true },
    );

    res.status(201).json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all budgets for a given month/year, with spent amount calculated
exports.getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query;
    const m = Number(month);
    const y = Number(year);

    const budgets = await Budget.find({
      user: req.user._id,
      month: m,
      year: y,
    });

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 1);

    const spentByCategory = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          type: "expense",
          date: { $gte: startDate, $lt: endDate },
        },
      },
      { $group: { _id: "$category", spent: { $sum: "$amount" } } },
    ]);

    const spentMap = {};
    spentByCategory.forEach((s) => (spentMap[s._id] = s.spent));

    const result = budgets.map((b) => ({
      _id: b._id,
      category: b.category,
      limit: b.limit,
      spent: spentMap[b.category] || 0,
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a budget
exports.deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) return res.status(404).json({ message: "Budget not found" });
    res.json({ message: "Budget deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
