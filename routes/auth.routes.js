const { doubleCsrfProtection } = require("../config/csrf.config");
const { signUpForm, loginForm, loginUser, signUpUser, logOut } = require("../controller/auth.controller");
const jwtVerify = require("../middleware/jwt.middleware");

const authRouter = require("express").Router();
authRouter.get("/login", loginForm);
authRouter.get("/signup", signUpForm);
authRouter.post("/login", doubleCsrfProtection, loginUser);
authRouter.post("/signup", doubleCsrfProtection, signUpUser);
authRouter.post("/logout", jwtVerify, logOut);
module.exports=authRouter