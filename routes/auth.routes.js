const { doubleCsrfProtection } = require("../config/csrf.config");
const { signUpForm } = require("../controller/auth.controller");
const jwtVerify = require("../middleware/jwt.middleware");

const Router = require("express").Router;
Router.get("/login", loginForm);
Router.get("/signup", signUpForm);
Router.post("/login", doubleCsrfProtection, loginForm);
Router.post("/signup", doubleCsrfProtection, loginForm);
Router.post("/logout", jwtVerify, loginForm);
