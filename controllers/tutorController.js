const Tutor = require ('../models/Tutor');

exports.completeProfile = async (req, res) => {
  try {
const tutorId = req.tutor.id.toString();
    const { firstName,
            lastName, 
            email,
            dateOfBirth,
            gender,
            city,
            language,
            religion
    } = req.body;

    // Validate basic fields 
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "First name and last name are required." });
    }
// console.log("guardianId:", guardianId);

    // Update the user's profile
    const updatedTutor = await Tutor.findByIdAndUpdate(
      tutorId,
      {
        firstName,
        lastName,
        email,
        dateOfBirth,
        gender,
        city,
        language,
        religion      },
      { new: true, runValidators: true }
    );

    if (!updatedTutor) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: "Profile completed successfully.",
      tutor: updatedTutor,
    });
  } catch (err) {
    console.error("Complete profile error:", err);
    res.status(500).json({ message: "Server error. Please try again." });
  }
};

