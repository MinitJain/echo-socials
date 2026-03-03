import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }
    if (!token) {
      console.log("No token found in cookies or headers");
      return res.status(401).json({
        message: "Unauthorized access",
        success: false,
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    req.id = decoded.userId || decoded.id;

    next();
  } catch (error) {
    console.error("JWT Verification Failed:", error.message);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
export default isAuthenticated;
