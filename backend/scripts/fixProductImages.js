const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

// Load environment variables
dotenv.config();

const fixProductImages = async () => {
  try {
    console.log('🖼️ Fixing product images...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB Atlas');

    // Real working image URLs for different categories
    const categoryImages = {
      'Electronics': [
        'https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop'
      ],
      'Clothing': [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop'
      ],
      'Home & Garden': [
        'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1493663284031-b7e3aaa4c4a0?w=400&h=400&fit=crop'
      ],
      'Sports': [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=400&h=400&fit=crop'
      ],
      'Books': [
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop'
      ],
      'Beauty': [
        'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&h=400&fit=crop'
      ],
      'Automotive': [
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=400&fit=crop'
      ],
      'Toys': [
        'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=400&fit=crop',
        'https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=400&h=400&fit=crop'
      ]
    };

    // Fallback placeholder image
    const placeholderImage = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&q=80';

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products to update`);

    let updatedCount = 0;

    for (const product of products) {
      try {
        // Get appropriate images for the category
        const categoryImageList = categoryImages[product.category] || [];
        
        // Select a random image from the category or use placeholder
        let imageUrl;
        if (categoryImageList.length > 0) {
          const randomIndex = Math.floor(Math.random() * categoryImageList.length);
          imageUrl = categoryImageList[randomIndex];
        } else {
          imageUrl = placeholderImage;
        }

        // Update the product with working image
        await Product.findByIdAndUpdate(product._id, {
          images: [{
            url: imageUrl,
            alt: product.name,
            isMain: true
          }]
        });

        updatedCount++;
        
        if (updatedCount % 50 === 0) {
          console.log(`✅ Updated ${updatedCount} products...`);
        }
      } catch (error) {
        console.error(`❌ Error updating product ${product._id}:`, error.message);
      }
    }

    console.log(`\n🎉 Successfully updated ${updatedCount} products with working images!`);
    
    // Verify the update
    const sampleProducts = await Product.find({}).limit(5);
    console.log('\n📸 Sample product images:');
    sampleProducts.forEach(product => {
      console.log(`  ${product.name}: ${product.images[0]?.url}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing product images:', error);
    process.exit(1);
  }
};

fixProductImages();
