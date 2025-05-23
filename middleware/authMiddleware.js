const jwt = require("jsonwebtoken");
const Guardian = require("../models/Guardian");
const Tutor = require("../models/Tutor");

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { id, role } = decoded;

    if (role === "guardian") {
      const guardian = await Guardian.findById(id);
      if (!guardian) {
        return res.status(404).json({ message: "Guardian not found" });
      }
      req.guardian = { id: guardian._id };
    } else if (role === "tutor") {
      const tutor = await Tutor.findById(id);
      if (!tutor) {
        return res.status(404).json({ message: "Tutor not found" });
      }
      req.tutor = { id: tutor._id };
    } else {
      return res.status(400).json({ message: "Invalid user role" });
    }

    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};
