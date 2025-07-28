const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
    child : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
        required: true
    },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
   images: [ {
      type: String, // URL or path to the image
      required: false,
  } ],
  Date: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});



module.exports = mongoose.model("Milestone", milestoneSchema);

