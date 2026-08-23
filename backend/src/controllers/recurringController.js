const RecurringTransaction = require("../models/RecurringTransaction");

const getNextRunDate = (from, frequency) => {
  const date = new Date(from);
  if (frequency === "daily") date.setDate(date.getDate() + 1);
  if (frequency === "weekly") date.setDate(date.getDate() + 7);
  if (frequency === "monthly") date.setMonth(date.getMonth() + 1);
  if (frequency === "yearly") date.setFullYear(date.getFullYear() + 1);
  return date;
};

exports.createRecurring = async (req, res) => {
  try {
    const { type, amount, category, note, frequency, startDate } = req.body;

    const recurring = await RecurringTransaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      note,
      frequency,
      nextRunDate: startDate ? new Date(startDate) : new Date(),
    });

    res.status(201).json(recurring);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.find({
      user: req.user._id,
    }).sort({ nextRunDate: 1 });
    res.json(recurring);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.toggleRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!recurring) return res.status(404).json({ message: "Not found" });

    recurring.active = !recurring.active;
    await recurring.save();

    res.json(recurring);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRecurring = async (req, res) => {
  try {
    const recurring = await RecurringTransaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!recurring) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Recurring transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getNextRunDate = getNextRunDate;
