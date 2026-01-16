const { doubleCsrf } = require("csrf-csrf");
require("dotenv").config();

const csrfSecret = process.env.CSRFSECRET;

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => csrfSecret,
  getSessionIdentifier: (req) => req.session.id,
  cookieName: "blog-cookie",
  cookieOptions: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
  },
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
});

module.exports = {
  doubleCsrfProtection,
  generateCsrfToken,
};
