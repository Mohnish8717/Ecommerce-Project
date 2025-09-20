const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const addMoreProducts = async () => {
  try {
    console.log('🌱 Adding even more diverse products...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB Atlas');

    // Get sellers
    const sellers = await User.find({ role: 'seller' });
    if (sellers.length === 0) {
      console.log('❌ No sellers found. Please run the main seed script first.');
      return;
    }

    // Additional Electronics
    const moreElectronics = [
      {
        name: 'Dell XPS 13 Laptop',
        description: 'Ultra-thin and light 13-inch laptop with InfinityEdge display, Intel Core i7 processor, and premium build quality.',
        price: 1299.99,
        discountPrice: 1099.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', alt: 'Dell XPS 13', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Dell',
        stock: 25,
        tags: ['laptop', 'dell', 'xps', 'ultrabook', 'portable'],
        features: [
          '13.4" InfinityEdge display',
          'Intel Core i7-1260P',
          '16GB LPDDR5 RAM',
          '512GB SSD',
          'All-day battery life'
        ],
        rating: 4.5,
        numReviews: 234
      },
      {
        name: 'Apple Watch Series 9',
        description: 'The most advanced Apple Watch yet with S9 chip, Double Tap gesture, and brighter display. Your essential companion for a healthy life.',
        price: 429.99,
        discountPrice: 379.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', alt: 'Apple Watch Series 9', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Apple',
        stock: 67,
        tags: ['smartwatch', 'apple', 'fitness', 'health', 'wearable'],
        features: [
          'S9 SiP with Neural Engine',
          'Double Tap gesture',
          'Brighter display',
          'Advanced health features',
          'Carbon neutral'
        ],
        isFeatured: true,
        rating: 4.6,
        numReviews: 456
      },
      {
        name: 'Samsung 65" Neo QLED 4K Smart TV',
        description: 'Premium 4K TV with Quantum Matrix Technology, Neural Quantum Processor, and stunning picture quality.',
        price: 1799.99,
        discountPrice: 1499.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', alt: 'Samsung Neo QLED TV', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Samsung',
        stock: 15,
        tags: ['tv', 'samsung', 'qled', '4k', 'smart-tv'],
        features: [
          '65" Neo QLED display',
          'Quantum Matrix Technology',
          'Neural Quantum Processor 4K',
          'Object Tracking Sound+',
          'Tizen Smart TV platform'
        ],
        rating: 4.7,
        numReviews: 189
      },
      {
        name: 'Bose QuietComfort Earbuds',
        description: 'World-class noise cancelling earbuds with high-fidelity audio and secure, comfortable fit.',
        price: 279.99,
        discountPrice: 199.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400', alt: 'Bose QuietComfort Earbuds', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Bose',
        stock: 89,
        tags: ['earbuds', 'bose', 'noise-cancelling', 'wireless'],
        features: [
          'World-class noise cancelling',
          'High-fidelity audio',
          '6-hour battery + case',
          'Weather-resistant',
          'Touch controls'
        ],
        rating: 4.4,
        numReviews: 567
      }
    ];

    // Additional Clothing
    const moreClothing = [
      {
        name: 'Adidas Ultraboost 22 Running Shoes',
        description: 'Premium running shoes with responsive Boost midsole, Primeknit upper, and Continental rubber outsole.',
        price: 190.00,
        discountPrice: 152.00,
        images: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', alt: 'Adidas Ultraboost 22', isMain: true }
        ],
        category: 'Clothing',
        brand: 'Adidas',
        stock: 78,
        tags: ['running-shoes', 'adidas', 'ultraboost', 'athletic'],
        features: [
          'Boost midsole technology',
          'Primeknit upper',
          'Continental rubber outsole',
          'Torsion System',
          'Energy return'
        ],
        rating: 4.5,
        numReviews: 789
      },
      {
        name: 'Canada Goose Expedition Parka',
        description: 'Extreme weather outerwear designed for the harshest conditions. Made in Canada with premium materials.',
        price: 1095.00,
        discountPrice: 876.00,
        images: [
          { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', alt: 'Canada Goose Parka', isMain: true }
        ],
        category: 'Clothing',
        brand: 'Canada Goose',
        stock: 12,
        tags: ['parka', 'canada-goose', 'winter', 'premium', 'extreme-weather'],
        features: [
          'Arctic Tech fabric',
          '625 fill power down',
          'Coyote fur trim',
          'Made in Canada',
          'TEI 5 warmth rating'
        ],
        rating: 4.8,
        numReviews: 145
      },
      {
        name: 'Lululemon Align High-Rise Pant',
        description: 'Buttery-soft leggings designed for yoga and low-impact workouts. Made with Nulu fabric for ultimate comfort.',
        price: 128.00,
        images: [
          { url: 'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=400', alt: 'Lululemon Align Pants', isMain: true }
        ],
        category: 'Clothing',
        brand: 'Lululemon',
        stock: 156,
        tags: ['leggings', 'lululemon', 'yoga', 'athletic', 'align'],
        features: [
          'Nulu fabric',
          'High-rise design',
          '28" inseam',
          'Four-way stretch',
          'Seamless construction'
        ],
        rating: 4.6,
        numReviews: 1234
      }
    ];

    // Additional Home & Garden
    const moreHomeGarden = [
      {
        name: 'Ninja Foodi Personal Blender',
        description: 'Powerful personal blender that crushes ice and frozen ingredients. Perfect for smoothies and protein shakes.',
        price: 79.99,
        discountPrice: 59.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', alt: 'Ninja Foodi Blender', isMain: true }
        ],
        category: 'Home & Garden',
        brand: 'Ninja',
        stock: 89,
        tags: ['blender', 'ninja', 'personal', 'smoothie'],
        features: [
          'Powerful motor',
          'Crushes ice',
          'BPA-free cups',
          'Easy cleanup',
          'Compact design'
        ],
        rating: 4.3,
        numReviews: 456
      },
      {
        name: 'Shark Navigator Lift-Away Vacuum',
        description: 'Versatile upright vacuum with lift-away canister for portable cleaning. Anti-allergen complete seal technology.',
        price: 179.99,
        discountPrice: 129.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Shark Navigator Vacuum', isMain: true }
        ],
        category: 'Home & Garden',
        brand: 'Shark',
        stock: 45,
        tags: ['vacuum', 'shark', 'upright', 'lift-away'],
        features: [
          'Lift-Away technology',
          'Anti-allergen seal',
          'Swivel steering',
          'Large dust cup',
          'Pet hair pickup'
        ],
        rating: 4.4,
        numReviews: 789
      }
    ];

    // Additional Sports
    const moreSports = [
      {
        name: 'Hydro Flask Water Bottle 32 oz',
        description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours.',
        price: 44.95,
        images: [
          { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', alt: 'Hydro Flask Water Bottle', isMain: true }
        ],
        category: 'Sports',
        brand: 'Hydro Flask',
        stock: 234,
        tags: ['water-bottle', 'hydro-flask', 'insulated', 'stainless-steel'],
        features: [
          'TempShield insulation',
          'BPA-free',
          'Dishwasher safe',
          'Lifetime warranty',
          'Wide mouth opening'
        ],
        rating: 4.7,
        numReviews: 1567
      },
      {
        name: 'Bowflex SelectTech 552 Dumbbells',
        description: 'Adjustable dumbbells that replace 15 sets of weights. Adjusts from 5 to 52.5 pounds per dumbbell.',
        price: 549.99,
        discountPrice: 399.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', alt: 'Bowflex SelectTech Dumbbells', isMain: true }
        ],
        category: 'Sports',
        brand: 'Bowflex',
        stock: 23,
        tags: ['dumbbells', 'bowflex', 'adjustable', 'home-gym'],
        features: [
          'Adjusts 5-52.5 lbs',
          'Replaces 15 sets',
          'Quick weight changes',
          'Space efficient',
          'Durable construction'
        ],
        isFeatured: true,
        rating: 4.5,
        numReviews: 345
      }
    ];

    console.log('📦 Creating additional products...');
    
    // Create all additional products
    const allAdditionalProducts = [
      ...moreElectronics,
      ...moreClothing,
      ...moreHomeGarden,
      ...moreSports
    ];
    
    for (const productData of allAdditionalProducts) {
      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
      await Product.create({
        ...productData,
        seller: randomSeller._id
      });
    }

    console.log(`✅ Added ${allAdditionalProducts.length} more products`);

    // Update category product counts
    const categories = await Category.find();
    for (const category of categories) {
      await Category.updateProductCount(category._id);
    }

    console.log('📊 Updated category product counts');

    // Get final counts
    const totalProducts = await Product.countDocuments();
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📊 FINAL PRODUCT CATALOG:');
    console.log(`Total Products: ${totalProducts}`);
    console.log('Products by Category:');
    productsByCategory.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`);
    });

    console.log('\n✅ Comprehensive product catalog completed!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding more products:', error);
    process.exit(1);
  }
};

addMoreProducts();
