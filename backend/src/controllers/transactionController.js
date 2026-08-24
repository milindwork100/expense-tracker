const Transaction = require("../models/Transaction");

// Create
exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      note,
      date,
      receiptUrl: req.file ? req.file.path : undefined,
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read (all, for logged-in user, with optional filters + pagination)
exports.getTransactions = async (req, res) => {
  try {
    const {
      type,
      category,
      startDate,
      endDate,
      search,
      page = 1,
      limit = 10,
    } = req.query;
    const query = { user: req.user._id };

    if (type) query.type = type;
    if (category) query.category = category;

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    if (search) {
      query.$or = [
        { note: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.max(1, Number(limit));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      Transaction.find(query).sort({ date: -1 }).skip(skip).limit(limitNum),
      Transaction.countDocuments(query),
    ]);

    res.json({
      transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    Object.assign(transaction, req.body);
    await transaction.save();

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Summary: totals by category (for pie chart) + monthly trend (for bar chart)
exports.getSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    const categoryBreakdown = await Transaction.aggregate([
      { $match: { user: userId, type: "expense" } },
      { $group: { _id: "$category", total: { $sum: "$amount" } } },
      { $sort: { total: -1 } },
    ]);

    const monthlyTrend = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ categoryBreakdown, monthlyTrend });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
