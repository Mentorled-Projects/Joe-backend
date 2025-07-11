const mongoose = require ('mongoose');

const childSchema = new mongoose.Schema({
    firstName: { type: String},
    clastName: { type: String},
    middleName: String,
    dateOfBirth:{ type: String},
    gender: { type: String},
    Class: { type: String},
    schoolName: { type: String },
    educationalLevel: { type: String},
    interests: [
        { type: String}
    ],
    favouriteSubjects: [
        { type: String }
    ],
    sports:[
        { type: String}
    ],
    createdAt: { type: Date, default: Date.now},
    guardian: { type: mongoose.Schema.Types.ObjectId, ref: "Guardian" },
    milestone: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Milestone"
        }
    ],
    about: {
    type: String,
    default: ''
  },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }
    ]
});


module.exports = mongoose.model("Child", childSchema);

