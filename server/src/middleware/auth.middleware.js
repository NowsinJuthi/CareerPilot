const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token found",
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    req.user = decoded;
    console.log(req.user);
    next();
  } catch (err) {
    console.error(err);

    return res.status(401).json({
      success: false,
      message: err.message,
    });
  }
};