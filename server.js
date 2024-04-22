const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const { default: mongoose } = require("mongoose");
const route = require("./routes/userRoutes");

dotenv.config();

connectDb();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express app is running!");
});

app.get("/api/");

app.use("/api/user", route);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("App is running on port", PORT));
