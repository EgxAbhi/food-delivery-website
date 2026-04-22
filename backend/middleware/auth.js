import jwt from "jsonwebtoken";

// simple JWT verification middleware
const authMiddleware = (req, res, next) => {
  // token can be sent in Authorization header as "Bearer <token>" or in body/query for flexibility
  let token = null;
  console.log("Auth headers:", req.headers.authorization);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    console.log("Token extracted from Bearer:", token);
  } else if (req.body.token) {
    token = req.body.token;
  } else if (req.query && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    console.error("No token found");
    return res
      .status(401)
      .json({ success: false, message: "No token provided" });
  }

  try {
    console.log("Verifying token with JWT_SECRET:", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    // attach user id to request for later use
    req.userId = decoded.id;
    console.log("req.userId set to:", req.userId);
    next();
  } catch (err) {
    console.error("auth middleware error", err);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default authMiddleware;
