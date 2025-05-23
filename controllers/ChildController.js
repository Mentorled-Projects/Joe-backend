const Guardian = require("../models/Guardian");
const Child = require("../models/Child");

exports.addChild = async (req, res) => {
  try {
    const guardianId = req.guardian.id.toString();

    const {  firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      Class,
      schoolName,
      sports,
      educationalLevel,
      interests,    } = req.body;

    // Create new child
    const newChild = await Child.create({
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      Class,
      schoolName,
      sports,
      educationalLevel,
      interests,  
      guardian: guardianId
    });

    // Update guardian to include child
    await Guardian.findByIdAndUpdate(guardianId, {
      $push: { child: newChild._id }
    });

    res.status(201).json({
      message: "Child profile created successfully",
      child: newChild
    });
  } catch (error) {
    console.error("Add child error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
