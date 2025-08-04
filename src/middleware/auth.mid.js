import pkg from "jsonwebtoken";
const { verify } = pkg;

export default function authenticateToken(req, res, next) {
  const token = req.headers.access_token;
  
  if (!token) {
    return res.status(401).send("Access token required");
  }
  
  try {
    const verified = verify(token, process.env.JWT_SECRET);
    req.user = verified;
    return next();
  } catch (err) {
    return res.status(401).send("Invalid or expired token");
  }
}
