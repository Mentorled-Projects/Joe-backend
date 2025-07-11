const Guardian = require("../models/Guardian");
const Child = require("../models/Child");
const Milestone = require("../models/Milestone");

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
      interests,  
    favouriteSubjects  } = req.body;

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
      favouriteSubjects,  
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
  })
  .populate('milestone');
  
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
  })
  .populate('milestone')
  .lean().select('-password');
       if (!child) {
        return res.status (404).json ({ error: 'User not found'});
       }
       res.json({ data: child });
    } catch (error)  {
      console.error(error)
        res.status(500).json({ error: error.message });
    }
  };

  
  // POST /milestone - Add a new milestone
  exports.addMilestone = async (req, res) => {
    try {
          const guardianId = req.guardian.id.toString();
      const { child, title, description, Date } = req.body;
      if (!child || !title || !description || !Date) {
        return res.status(400).json({ message: "All fields are required." });
      }
  
      // Ensure the child belongs to the authenticated guardian
    const childDoc = await Child.findOne({ _id: child, guardian: guardianId });
    if (!childDoc) {
      return res.status(403).json({ message: "Child not found or does not belong to this guardian." });
    }

      const milestone = new Milestone({
        child,
        title,
        description,
        Date,
      });
  
      const savedMilestone = await milestone.save();

      // Push the milestone ID to the child's milestone array
    childDoc.milestone.push(savedMilestone._id);
    await childDoc.save();
  
      res.status(201).json({
          message: "Milestone created successfully",
          savedMilestone
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create milestone.", error: error.message });
    }
  };

  exports.getMilestonesByChildId = async (req, res) => {
    try {
      const { childId } = req.params;

      // Find the child and populate their milestones
      const child = await Child.findById(childId)
        .populate({
          path: 'milestone',
          select: 'title description date',
        });

      if (!child) {
        return res.status(404).json({ message: "Child not found." });
      }

      res.status(200).json({
        message: "Milestones retrieved successfully.",
        milestones: child.milestone,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to retrieve milestones.", error: error.message });
    }
  };

  exports.updateAbout = async (req, res) => {
  const { childId } = req.params;
  const { about } = req.body;

  try {
    const updated = await Child.findByIdAndUpdate(
      childId,
      { about },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.status(200).json({ success: true, child: updated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
