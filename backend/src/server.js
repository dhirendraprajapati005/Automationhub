import "dotenv/config";

import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`AutomationHub API running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
};

start();

// Fail loudly instead of leaving the process in a broken state
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled rejection: ${err.message}`);
  process.exit(1);
});
