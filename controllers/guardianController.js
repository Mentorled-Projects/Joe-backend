const Guardian = require ('../models/Guardian');

exports.completeProfile = async (req, res) => {
  try {
const guardianId = req.guardian.id.toString();
    const { firstName,
            lastName, 
            email,
            dateOfBirth,
            gender,
            relationship,
            city,
            language,
            religion
    } = req.body;

    // Validate basic fields 
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required." });
    }
console.log("guardianId:", guardianId);

    // Update the user's profile
    const updatedGuardian = await Guardian.findByIdAndUpdate(
      guardianId,
      {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        relationship,
        city,
        language,
        religion      },
      { new: true, runValidators: true }
    );

    if (!updatedGuardian) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile completed successfully.",
      guardian: updatedGuardian,
    });
  } catch (err) {
    console.error("Complete profile error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

