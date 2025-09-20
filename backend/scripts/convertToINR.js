const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

// USD to INR conversion rate (approximate)
const USD_TO_INR = 83;

const convertPricesToINR = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🔄 Converting product prices from USD to INR...');
    
    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to convert`);

    let convertedCount = 0;
    
    for (const product of products) {
      // Convert price from USD to INR and round to nearest rupee
      const newPrice = Math.round(product.price * USD_TO_INR);
      
      // Convert discount price if it exists
      let newDiscountPrice = null;
      if (product.discountPrice) {
        newDiscountPrice = Math.round(product.discountPrice * USD_TO_INR);
      }

      // Update the product
      await Product.findByIdAndUpdate(product._id, {
        price: newPrice,
        discountPrice: newDiscountPrice
      });

      convertedCount++;
      
      if (convertedCount % 50 === 0) {
        console.log(`✅ Converted ${convertedCount}/${products.length} products`);
      }
    }

    console.log(`🎉 Successfully converted ${convertedCount} products to INR!`);
    console.log('💰 Sample conversions:');
    
    // Show some sample conversions
    const sampleProducts = await Product.find({}).limit(5);
    sampleProducts.forEach(product => {
      const originalUSD = (product.price / USD_TO_INR).toFixed(2);
      console.log(`   ${product.name}: $${originalUSD} → ₹${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error converting prices:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the conversion
convertPricesToINR();
