const mongoose = require ('mongoose');


const deletionSchema = new mongoose.Schema({

    phoneNumber: String,
    reasonForDeleting: String,
    deletedAt: { type: Date, default: Date.now},
    role: String


})

module.exports = mongoose.model("DeletionLog", deletionSchema);
