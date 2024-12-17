const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json({ message: "Access denied, no token provided" });

  try {
    // Decode the token using the same secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the userId is available in the decoded token
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user; // Attach user to request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
