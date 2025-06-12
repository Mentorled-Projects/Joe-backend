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

exports.getAllGuardians = async (req, res) => {
    try {
    const guardians = await Guardian.find()
  .populate({
    path: 'child',
    select: 'firstName lastName middleName  age gender dateOfBirth Class schoolName sports educationalLevel interests'  // select only the fields you want
  })
  .populate({
    path: 'files',
    select: 'url filename'  // guardian files if you want those too
  });
    res.status(200).json({ data: guardians });
}catch (error) {
    res.status(500).json({ error: error.message });
}
};

exports.getPaginatedGuardians = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Page and limit must be positive numbers" });
    }

    const query = {};

    // Optional search filtering by name or email (example)
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const totalGuardians = await Guardian.countDocuments(query);

    const guardians = await Guardian.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'child',
        select: 'firstName lastName middleName age gender dateOfBirth Class schoolName sports educationalLevel interests'
      })
      .populate({
        path: 'files',
        select: 'url filename'
      });

    res.json({
      totalGuardians,
      currentPage: page,
      totalPages: Math.ceil(totalGuardians / limit),
      guardians
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a guardian by Id
  exports.getGuardianById = async (req, res) => {
    try {
        const guardian = await Guardian.findById(req.params.id)
        .populate({
    path: 'child',
    select: 'firstName lastName middleName  age gender dateOfBirth Class schoolName sports educationalLevel interests'  // select only the fields you want
  })
  .populate({
    path: 'files',
    select: 'url filename'  // guardian files if you want those too
  }).lean().select('-password');
       if (!guardian) {
        return res.status (404).json ({ error: 'User not found'});
       }
       res.json ({ data: guardian});
    } catch (error)  {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
  };

  exports.getGuardianByPhoneNumber = async (req, res) => {
     try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({ msg: 'Phone number is required' });
    }

    const guardian = await Guardian.findOne({ phoneNumber })
        .populate({
    path: 'child',
    select: 'firstName lastName middleName  age gender dateOfBirth Class schoolName sports educationalLevel interests'  // select only the fields you want
  })
  .populate({
    path: 'files',
    select: 'url filename'  // guardian files if you want those too
  }).lean().select('-password');
       if (!guardian) {
        return res.status (404).json ({ error: 'Use not found'});
       }
       res.json ({ data: guardian});
    } catch (error)  {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
  };

  // Delete a guardian by Id
  exports.deleteGuardian = async (req, res) => {
    try {
        const guardian = await Guardian.findByIdAndDelete(req.params.id);


        if (!guardian) {
            return res.status (404).json ({ msg: 'User not found'});
        }

        // await user.remove();

        res.json({ msg: 'User removed successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
};

