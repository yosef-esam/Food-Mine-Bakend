import authenticateToken from "./auth.mid.js";

const adminMid = (req, res, next) => {
  // Check if user exists and has isAdmin property
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send("Access denied. Admin privileges required.");
  }
  return next();
};

export default [authenticateToken, adminMid];
