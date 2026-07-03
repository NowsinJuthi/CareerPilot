const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.accessToken;

  console.log("COOKIES RECEIVED:", req.cookies);

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token found",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id: userId }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};