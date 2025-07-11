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
  Date: {
    type: Date,
    required: true,
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

