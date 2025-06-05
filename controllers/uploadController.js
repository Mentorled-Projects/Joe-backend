const cloudinary = require ('../src/cloudinary');
const File = require ('../models/File');
const fs = require ('fs');
const Guardian = require ('../models/Guardian');
const Tutor = require ('../models/Tutor')
const Admin = require ('../models/Admin')

exports.uploadFile = async (req, res) => {
  try {
    const phoneNumber = req.user?.phoneNumber || req.body?.phoneNumber;

    if (!phoneNumber) {
      return res.status(400).json({ message: 'Missing phoneNumber from token or body' });
    }

    let user = await Guardian.findOne({ phoneNumber });
    let role = 'guardian';

    if (!user) {
      user = await Tutor.findOne({ phoneNumber });
      role = 'tutor';
    }

    if (!user) {
      user = await Admin.findOne({ phoneNumber });
      role = 'admin';
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'uploads',
      resource_type: 'auto',
    });

    fs.unlinkSync(filePath); // delete temp file

    const filePayload = {
  filename: req.file.originalname,
  url: result.secure_url,
  resource_type: result.resource_type,
  phoneNumber,
};

if (role === 'guardian') {
  filePayload.guardian = user._id;
} else if (role === 'tutor') {
  filePayload.tutor = user._id;
} else if (role === 'admin') {
  filePayload.admin = user._id;
}

// const fileDoc = await File.create(filePayload);

const savedFile = await File.create(filePayload);

// Add file to the user's files array
if (role === 'guardian') {
  await Guardian.findByIdAndUpdate(user._id, { $push: { files: savedFile._id } });
} else if (role === 'tutor') {
  await Tutor.findByIdAndUpdate(user._id, { $push: { files: savedFile._id } });
} else if (role === 'admin') {
  await Admin.findByIdAndUpdate(user._id, { $push: { files: savedFile._id } });
}


    res.status(201).json({ success: true, file: savedFile});
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};
