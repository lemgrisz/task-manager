require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const TaskRoutes = require("./routes/TaskRoutes");
const UserRoutes = require("./routes/UserRoutes");

const app = express();
connectDB();
app.use(
  cors({
    // origin: `*`,
    origin:"https://task-manager-fe-virid.vercel.app",
    // origin:  `${process.env.FRONT_END_URI}`,
    // origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
// app.options("*", cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.url}`);
  next();
});
app.use("/api/tasks", TaskRoutes);
app.use("/api/users", UserRoutes);
app.get("/", (req, res) => {
  res.send("Hello World, We are LIVE!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
