const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");

const app = express();
const routes = require("./routes");

const { connect, closeDatabase } = require("./config/mongoMemoryDb");

app.use(helmet());
app.use(cors());
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 35,
});
app.use(limiter);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("combined"));
app.use("/api", routes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
});

module.exports = app;

module.exports.connectDatabase = async () => {
  try {
    await connect();
    console.log("Connected to the database");
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }
};

module.exports.closeDatabase = async () => {
  try {
    await closeDatabase();
    console.log("Disconnected from the database");
  } catch (error) {
    console.error("Error disconnecting from the database", error);
    throw error;
  }
};
