import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// Gate write/admin routes: require a valid access_token cookie (set on sign-in).
export const verifyToken = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (!token) return next(errorHandler(401, "Unauthorized"));

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return next(errorHandler(403, "Forbidden"));
    req.user = decoded;
    next();
  });
};
