const mongoose = require('mongoose');
const { MONGO_URI } = require('./env');
const { ensureMongoRunning } = require('./mongoRunner');

const connectDB = async () => {
  try {
    // 1. Ensure MongoDB process is listening (auto-starts local mongod on laptops if service is stopped)
    await ensureMongoRunning();

    // 2. Connect with reasonable timeout
    const conn = await mongoose.connect(MONGO_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);

    // 3. Auto-seed sample database if fresh/empty
    const Movie = require('../models/Movie');
    const movieCount = await Movie.countDocuments();
    if (movieCount === 0) {
      console.log('[MongoDB] Empty database detected. Auto-populating initial sample cinema data...');
      const seedData = require('../../seed/seed');
      await seedData(false);
      console.log('[MongoDB] Auto-seeding completed successfully.');
    }
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    console.error(`[MongoDB] Hint: Please ensure MongoDB is installed or start it manually.`);
    process.exit(1);
  }
};

module.exports = connectDB;
