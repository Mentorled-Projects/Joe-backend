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


exports.getAllChildren = async (req, res) => {
    try {
    const children = await Child.find()
  .populate({
    path: 'guardian',
    select: 'firstName lastName age gender phoneNumber '  
  });
  
    res.status(200).json({ data: children });
}catch (error) {
    res.status(500).json({ error: error.message });
}
};

exports.getChildById = async (req, res) => {
    try {
        const child = await Child.findById(req.params.id)
        .populate({
    path: 'guardian',
    select: 'firstName lastName phoneNumber age gender'  
  }).lean().select('-password');
       if (!child) {
        return res.status (404).json ({ error: 'User not found'});
       }
       res.json({ data: child });
    } catch (error)  {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
  };