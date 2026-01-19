const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const UserRoute = require("./routes/user.routes");
const authRouter = require("./routes/auth.routes");
const ErrorHandler = require("./middleware/errorHandler.middleware");
const postRouter = require("./routes/post.routes");
const session = require("express-session");
dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());
app.use(
  session({
    secret: "thuman_rana",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

// router
app.get("/", (req, res) => {
  res.send("hello world");
});
app.use("/auth", authRouter);
app.use("/user", UserRoute);
app.use("/posts", postRouter);

app.use(ErrorHandler);
const PORT = process.env.PORT;

connectDB()
  .then(() => {
    console.log("mongodb connected successfully");
  })
  .catch((e) => {
    console.log(`${e.code}=> ${e.message}`);
  });
app.listen(PORT, () => {
  console.log(`server is running in http://localhost:${PORT}`);
});
