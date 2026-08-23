const cron = require("node-cron");
const RecurringTransaction = require("../models/RecurringTransaction");
const Transaction = require("../models/Transaction");
const { getNextRunDate } = require("../controllers/recurringController");

const runRecurringCheck = async () => {
  try {
    const dueRecurrings = await RecurringTransaction.find({
      active: true,
      nextRunDate: { $lte: new Date() },
    });

    for (const r of dueRecurrings) {
      await Transaction.create({
        user: r.user,
        type: r.type,
        amount: r.amount,
        category: r.category,
        note: r.note,
        date: r.nextRunDate,
        recurringId: r._id,
      });

      r.nextRunDate = getNextRunDate(r.nextRunDate, r.frequency);
      await r.save();
    }

    if (dueRecurrings.length > 0) {
      console.log(`Processed ${dueRecurrings.length} recurring transaction(s)`);
    }
  } catch (err) {
    console.error("Recurring job error:", err.message);
  }
};

// Run every day at midnight
const startRecurringJob = () => {
  cron.schedule("0 0 * * *", runRecurringCheck);
  // Also run once on server start, in case the server was off for a while
  runRecurringCheck();
};

module.exports = startRecurringJob;
