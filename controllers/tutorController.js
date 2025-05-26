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

exports.getAllTutors = async (req, res) => {
    try {
    // fetch tutors from database
    const tutors = await Tutor.find().select('-password'); //Exclude passwprds
    res.status(200).json(tutors);
}catch (error) {
    res.status(500).json({ error: error.message });
}
};

// Get a tutor by Id
  exports.getTutorById = async (req, res) => {
    try {
        const tutor = await Tutor.findById(req.params.id).lean().select('-password');
       if (!tutor) {
        return res.status (404).json ({ error: 'User not found'});
       }
       res.json(tutor);
    } catch (error)  {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
  };

  // Delete a tutor by Id
  exports.deleteTutor = async (req, res) => {
    try {
        const tutor = await Tutor.findByIdAndDelete(req.params.id);

        if (!tutor) {
            return res.status (404).json ({ msg: 'User not found'});
        }

        // await user.remove();

        res.json({ msg: 'User removed successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
};

