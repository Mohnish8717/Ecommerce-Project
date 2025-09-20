const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedDatabase = require('../utils/seedDatabase');

// Load environment variables
dotenv.config();

const runSeed = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('📦 Connected to MongoDB');

    // Run seeding
    await seedDatabase();

    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

runSeed();
