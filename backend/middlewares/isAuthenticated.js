import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "User not authenticated", success: false });
    }

    // verifies signature & expiry
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ensure we find the same key we signed
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload", success: false });
    }

    // attach to req for downstream handlers
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("JWT verification failed:", error.message);
    return res.status(401).json({
      message: "Authentication failed. Invalid or expired token.",
      success: false,
    });
  }
};

export default isAuthenticated;
