const Guardian = require ('../models/Guardian');
const Tutor = require ('../models/Tutor')
const Admin = require ('../models/Admin')
const DeletionLog = require ('../models/deletionLog')





exports.getAllUsers = async (req, res) => {
    try {
        const guardians = await Guardian.find()
          .select('-password -lastVerificationOtpSentAt -otp -lastOtpSentAt -otpExpiresAt -lastResetOtpSentAt') 

            .populate({
                path: 'child',
                select: 'firstName lastName middleName age gender dateOfBirth Class schoolName sports educationalLevel interests'
            })
            .populate({
                path: 'files',
                select: 'url filename'
            });

        const tutors = await Tutor.find()
          .select('-password -lastVerificationOtpSentAt -otp -lastOtpSentAt -otpExpiresAt -lastResetOtpSentAt') 

        .populate({
                path: 'files',
                select: 'url filename'
            });

        const admins = await Admin.find()
          .select('-password -lastVerificationOtpSentAt -otp -lastOtpSentAt -otpExpiresAt -lastResetOtpSentAt') 
          

res.status(200).json({
    guardians,
    tutors,
    admins
});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const { reasonForDeleting, role, phoneNumber } = req.body;

    try {
        const guardian = await Guardian.findOneAndDelete(phoneNumber);
        const tutor = await Tutor.findOneAndDelete(phoneNumber);
        const admin = await Admin.findOneAndDelete(phoneNumber);

        // Check if any user was deleted
        if (!guardian && !tutor && !admin) {
            return res.status(404).json({ msg: 'User not found' });
        }
         await DeletionLog.create({ phoneNumber: phoneNumber, role: role, reasonForDeleting: reasonForDeleting, deletedAt: new Date() });


        res.json({ msg: 'User removed successfully' });
      } catch (err) {
        console.error(err.message);
        res.status(400).json({ error: err.message });
    }
};

exports.getByPhoneNumber = async (req, res) => {

  try {
     const { phoneNumber } = req.query;

     if (!phoneNumber) {
      return res.status(400).json ({ message: "Phone number not found." })
     }
         const findUser = async (Model, phoneNumber) => {
  return await Model.findOne({ phoneNumber })
    .select('-password -lastVerificationOtpSentAt -otp -lastOtpSentAt -otpExpiresAt -lastResetOtpSentAt')
    .populate({
      path: 'files',
      select: 'url filename'
    });
};

const guardian = await findUser(Guardian, phoneNumber);
const tutor = await findUser(Tutor, phoneNumber);
const admin = await findUser(Admin, phoneNumber);

   const user = guardian || tutor || admin; 

         if (!user) {
        return res.status (404).json ({ error: 'User not found'});
       }
       res.json ({ data: user});

  } catch (error) {
    console.error (error)
    res.status(500).json ({ error: error.message});
    
  }
};


exports.getPaginatedUsers = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '', role } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    if (page < 1 || limit < 1) {
      return res.status(400).json({ error: "Page and limit must be positive numbers" });
    }

    const query = {};
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    let model;
    let userRole;
    if (role === 'guardian') {
      model = Guardian;
      userRole = 'guardian';
    } else if (role === 'tutor') {
      model = Tutor;
      userRole = 'tutor';
    } else if (role === 'admin') {
      model = Admin;
      userRole = 'admin';
    } else {
      return res.status(400).json({ error: 'Invalid or missing user role (guardian, tutor, admin)' });
    }

    const totalUsers = await model.countDocuments(query);

    const users = await model.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate({
        path: 'files',
        select: 'url filename'
      });

    const taggedUsers = users.map(user => ({
      ...user.toObject(),
      role: userRole
    }));

    res.json({
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit),
      users: taggedUsers
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
