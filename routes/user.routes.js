const { doubleCsrfProtection } = require("../config/csrf.config");
const {
  loginForm,
  loginUser,
  signUpForm,
  signUpUser,
  profile,
  logOut,
} = require("../controller/user.controller");
const jwtVerify = require("../middleware/jwt.middleware");
const UserRoute = require("express").Router();


UserRoute.get("/", (req, res) => {
  res.send("user route");
});
UserRoute.get("/profile", jwtVerify, profile);

UserRoute.get("/login", loginForm);

UserRoute.post("/login", doubleCsrfProtection, loginUser);

UserRoute.get("/signup", signUpForm);

UserRoute.post("/signup",  doubleCsrfProtection, signUpUser);

UserRoute.post("/logout", jwtVerify, doubleCsrfProtection, logOut);
module.exports = UserRoute;
