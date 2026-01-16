const jwt = require("jsonwebtoken");
const dotenv=require("dotenv")
dotenv.config()

const jwtVerify = async (req, res, next) => {
  try {
    const access_token = req.cookies.access_token;
    
    if (!access_token) {
      return res
        .status(401)
        .json({ message: "You're not logged in. Please login first!!" });
    }
    const decoded = await jwt.verify(access_token, process.env.JWTSECRET);
    req.token = decoded;

    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token or token expired" });
  }
};
module.exports = jwtVerify;
