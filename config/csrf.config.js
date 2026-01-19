const { doubleCsrf } = require("csrf-csrf");
require("dotenv").config();

const csrfSecret = process.env.CSRFSECRET|| "hello";

const { doubleCsrfProtection, generateCsrfToken } = doubleCsrf({
  getSecret: () => csrfSecret,
  getSessionIdentifier: (req) => req.session.id,
  cookieName: "blogs",
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
