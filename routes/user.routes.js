const { doubleCsrfProtection } = require("../config/csrf.config");
const {
  profile,
  assignRole,
  deleteUser,
} = require("../controller/user.controller");
const jwtVerify = require("../middleware/jwt.middleware");
const authorize = require("../middleware/authorize.middleware");
const isOwner = require("../middleware/isOwner.middleware");
const UserRoute = require("express").Router();


UserRoute.get("/", (req, res) => {
  res.send("user route");
});
UserRoute.get("/profile", jwtVerify, profile);

UserRoute.delete("/:id",jwtVerify,isOwner,deleteUser)
UserRoute.patch("/assignrole/:id", jwtVerify,authorize("admin"), doubleCsrfProtection, assignRole);
module.exports = UserRoute