const mongoose = require ('mongoose');
require ('dotenv').config();

const connectToDatabase =  async () => {
    try {
        
await mongoose.connect(process.env.DATABASE_URL);
console.log('Connected to Database');
    } catch (error) {
        console.error(`Database connection error: ${error}`);
    }
};

connectToDatabase();
  module.exports = connectToDatabase;