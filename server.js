const express = require("express");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const { default: mongoose } = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const cors = require("cors");

dotenv.config();

connectDb();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Express app is running!");
});

app.get("/api/");

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log("App is running on port", PORT));
