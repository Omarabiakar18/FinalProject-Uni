const express = require("express");
const app = express();
const DB = require("./database").connectDB;
const cors = require("cors");

//Routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const { bookGenres } = require("./models/bookModels");

// Connect to our DB
DB();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.get("/bookGenres", (req, res) => res.json(bookGenres));

//The signup path will become: http://localhost:3000/api/auth/signup

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT} or http://127.0.0.1:${PORT}`);
});
