const mongoose = require('mongoose');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/client-book';

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('Database connected');
  } catch (e) {
    console.log(`Error: ${e.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
