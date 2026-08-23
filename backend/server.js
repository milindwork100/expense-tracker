const app = require("./src/app");
const mongoose = require("mongoose");
const startRecurringJob = require("./src/jobs/recurringTransactionJob");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      startRecurringJob();
    });
  })
  .catch((err) => console.error(err));
