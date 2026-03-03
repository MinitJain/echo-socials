import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import databaseConnection from "../config/database.js";

const PORT = process.env.PORT || 8080;

databaseConnection()
  .then(() => {
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
    process.exit(1);
  });
