import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // This will throw if invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Make sure the payload has the key you expect
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        message: "Invalid token payload",
        success: false,
      });
    }

    // Attach the user ID to the request object
    req.id = decoded.userId;
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
