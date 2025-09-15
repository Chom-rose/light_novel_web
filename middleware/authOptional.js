const jwt = require("jsonwebtoken");
const SECRET = process.env.JWT_SECRET || "secret123"; // ใช้ค่าเดียวกับ auth.js

module.exports = function (req, res, next) {
  let token = null;

  // 1) header
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // 2) cookie
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, SECRET);
      req.user = decoded;
    } catch (err) {
      req.user = null;
    }
  } else {
    req.user = null;
  }

  next();
};
