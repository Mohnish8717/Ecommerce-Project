const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const addMoreSampleData = async () => {
  try {
    console.log('🌱 Adding more sample data to MongoDB Atlas...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB Atlas');

    // Get existing users
    const buyer = await User.findOne({ email: 'buyer@demo.com' });
    const seller = await User.findOne({ email: 'seller@demo.com' });
    const admin = await User.findOne({ email: 'admin@demo.com' });

    if (!buyer || !seller || !admin) {
      console.log('❌ Demo users not found. Please run the main seed script first.');
      return;
    }

    // Add more users
    const additionalUsers = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@demo.com',
        password: 'demo123',
        role: 'buyer',
        isEmailVerified: true,
        phone: '+1-555-0123',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        }
      },
      {
        name: 'Bob Wilson',
        email: 'bob@demo.com',
        password: 'demo123',
        role: 'seller',
        isEmailVerified: true,
        phone: '+1-555-0124',
        address: {
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        }
      },
      {
        name: 'Carol Davis',
        email: 'carol@demo.com',
        password: 'demo123',
        role: 'buyer',
        isEmailVerified: true,
        phone: '+1-555-0125'
      },
      {
        name: 'David Miller',
        email: 'david@demo.com',
        password: 'demo123',
        role: 'seller',
        isEmailVerified: true,
        phone: '+1-555-0126'
      }
    ]);

    console.log(`👥 Added ${additionalUsers.length} more users`);

    // Add more categories
    const additionalCategories = await Category.create([
      {
        name: 'Beauty',
        description: 'Beauty and personal care products',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'
      },
      {
        name: 'Automotive',
        description: 'Car accessories and automotive products',
        image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400'
      },
      {
        name: 'Toys',
        description: 'Toys and games for all ages',
        image: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400'
      }
    ]);

    console.log(`📂 Added ${additionalCategories.length} more categories`);

    // Get all sellers for products
    const allSellers = [seller, ...additionalUsers.filter(u => u.role === 'seller')];

    // Add more products
    const additionalProducts = await Product.create([
      {
        name: 'Gaming Mechanical Keyboard',
        description: 'RGB backlit mechanical gaming keyboard with blue switches, programmable keys, and anti-ghosting technology.',
        price: 89.99,
        discountPrice: 69.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400',
            alt: 'Gaming Mechanical Keyboard',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'GameTech',
        stock: 45,
        seller: allSellers[0]._id,
        tags: ['gaming', 'keyboard', 'mechanical', 'rgb'],
        features: [
          'RGB backlighting',
          'Blue mechanical switches',
          'Anti-ghosting technology',
          'Programmable keys'
        ],
        isFeatured: true,
        rating: 4.6,
        numReviews: 28
      },
      {
        name: 'Wireless Gaming Mouse',
        description: 'High-precision wireless gaming mouse with 16000 DPI, RGB lighting, and 70-hour battery life.',
        price: 59.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400',
            alt: 'Wireless Gaming Mouse',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'GameTech',
        stock: 32,
        seller: allSellers[1]._id,
        tags: ['gaming', 'mouse', 'wireless', 'rgb'],
        features: [
          '16000 DPI sensor',
          'RGB lighting',
          '70-hour battery',
          'Wireless connectivity'
        ],
        rating: 4.4,
        numReviews: 19
      },
      {
        name: 'Skincare Set Premium',
        description: 'Complete skincare routine set with cleanser, toner, serum, and moisturizer. Suitable for all skin types.',
        price: 79.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400',
            alt: 'Skincare Set Premium',
            isMain: true
          }
        ],
        category: 'Beauty',
        brand: 'GlowSkin',
        stock: 28,
        seller: allSellers[0]._id,
        tags: ['skincare', 'beauty', 'routine', 'premium'],
        features: [
          'Complete 4-step routine',
          'Suitable for all skin types',
          'Natural ingredients',
          'Dermatologist tested'
        ],
        rating: 4.7,
        numReviews: 34
      },
      {
        name: 'Car Phone Mount',
        description: 'Universal car phone mount with 360-degree rotation and strong magnetic hold. Compatible with all smartphones.',
        price: 19.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
            alt: 'Car Phone Mount',
            isMain: true
          }
        ],
        category: 'Automotive',
        brand: 'AutoGrip',
        stock: 67,
        seller: allSellers[1]._id,
        tags: ['car', 'phone', 'mount', 'magnetic'],
        features: [
          '360-degree rotation',
          'Strong magnetic hold',
          'Universal compatibility',
          'Easy installation'
        ],
        rating: 4.3,
        numReviews: 41
      },
      {
        name: 'Educational Building Blocks',
        description: 'STEM educational building blocks set with 200+ pieces. Develops creativity and problem-solving skills.',
        price: 34.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400',
            alt: 'Educational Building Blocks',
            isMain: true
          }
        ],
        category: 'Toys',
        brand: 'LearnPlay',
        stock: 23,
        seller: allSellers[0]._id,
        tags: ['educational', 'building', 'blocks', 'stem'],
        features: [
          '200+ pieces included',
          'STEM learning',
          'Safe materials',
          'Age 6+ recommended'
        ],
        rating: 4.8,
        numReviews: 16
      },
      {
        name: 'Running Shoes Pro',
        description: 'Professional running shoes with advanced cushioning, breathable mesh, and durable sole. Perfect for long-distance running.',
        price: 119.99,
        discountPrice: 89.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            alt: 'Running Shoes Pro',
            isMain: true
          }
        ],
        category: 'Sports',
        brand: 'RunFast',
        stock: 38,
        seller: allSellers[1]._id,
        tags: ['running', 'shoes', 'sports', 'professional'],
        features: [
          'Advanced cushioning',
          'Breathable mesh upper',
          'Durable rubber sole',
          'Lightweight design'
        ],
        isFeatured: true,
        rating: 4.5,
        numReviews: 52
      },
      {
        name: 'Cookbook Collection',
        description: 'Set of 3 bestselling cookbooks covering international cuisine, healthy eating, and desserts.',
        price: 49.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
            alt: 'Cookbook Collection',
            isMain: true
          }
        ],
        category: 'Books',
        brand: 'CulinaryPress',
        stock: 15,
        seller: allSellers[0]._id,
        tags: ['cookbook', 'cooking', 'recipes', 'collection'],
        features: [
          '3 books included',
          'International recipes',
          'Healthy options',
          'Step-by-step instructions'
        ],
        rating: 4.6,
        numReviews: 23
      },
      {
        name: 'Smart Home Security Camera',
        description: '1080p HD security camera with night vision, motion detection, and smartphone app control.',
        price: 79.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=400',
            alt: 'Smart Home Security Camera',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'SecureHome',
        stock: 29,
        seller: allSellers[1]._id,
        tags: ['security', 'camera', 'smart-home', 'surveillance'],
        features: [
          '1080p HD recording',
          'Night vision',
          'Motion detection',
          'Smartphone app'
        ],
        rating: 4.4,
        numReviews: 37
      }
    ]);

    console.log(`📦 Added ${additionalProducts.length} more products`);

    // Create some sample orders
    const sampleOrders = await Order.create([
      {
        user: buyer._id,
        orderItems: [
          {
            product: additionalProducts[0]._id,
            name: additionalProducts[0].name,
            image: additionalProducts[0].images[0].url,
            price: additionalProducts[0].effectivePrice,
            quantity: 1,
            seller: additionalProducts[0].seller
          },
          {
            product: additionalProducts[1]._id,
            name: additionalProducts[1].name,
            image: additionalProducts[1].images[0].url,
            price: additionalProducts[1].price,
            quantity: 1,
            seller: additionalProducts[1].seller
          }
        ],
        shippingAddress: {
          fullName: 'John Doe',
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA',
          phone: '+1-555-0123'
        },
        paymentMethod: 'stripe',
        itemsPrice: 129.98,
        taxPrice: 10.40,
        shippingPrice: 9.99,
        totalPrice: 150.37,
        isPaid: true,
        paidAt: new Date(),
        status: 'delivered',
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        user: additionalUsers[0]._id,
        orderItems: [
          {
            product: additionalProducts[2]._id,
            name: additionalProducts[2].name,
            image: additionalProducts[2].images[0].url,
            price: additionalProducts[2].price,
            quantity: 2,
            seller: additionalProducts[2].seller
          }
        ],
        shippingAddress: {
          fullName: 'Alice Johnson',
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA',
          phone: '+1-555-0123'
        },
        paymentMethod: 'stripe',
        itemsPrice: 159.98,
        taxPrice: 12.80,
        shippingPrice: 0.00,
        totalPrice: 172.78,
        isPaid: true,
        paidAt: new Date(),
        status: 'shipped',
        trackingNumber: 'TRK123456789'
      },
      {
        user: additionalUsers[2]._id,
        orderItems: [
          {
            product: additionalProducts[5]._id,
            name: additionalProducts[5].name,
            image: additionalProducts[5].images[0].url,
            price: additionalProducts[5].effectivePrice,
            quantity: 1,
            seller: additionalProducts[5].seller
          }
        ],
        shippingAddress: {
          fullName: 'Carol Davis',
          address: '789 Pine St',
          city: 'Chicago',
          postalCode: '60601',
          country: 'USA'
        },
        paymentMethod: 'stripe',
        itemsPrice: 89.99,
        taxPrice: 7.20,
        shippingPrice: 9.99,
        totalPrice: 107.18,
        isPaid: true,
        paidAt: new Date(),
        status: 'processing'
      }
    ]);

    console.log(`📋 Created ${sampleOrders.length} sample orders`);

    // Update category product counts
    const allCategories = await Category.find();
    for (const category of allCategories) {
      await Category.updateProductCount(category._id);
    }

    console.log('📊 Updated all category product counts');

    // Add some reviews to products
    const existingProducts = await Product.find().limit(5);
    for (const product of existingProducts) {
      product.addReview({
        user: buyer._id,
        name: buyer.name,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: 'Great product! Highly recommended.',
        isVerifiedPurchase: true
      });
      
      product.addReview({
        user: additionalUsers[0]._id,
        name: additionalUsers[0].name,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
        comment: 'Excellent quality and fast shipping.',
        isVerifiedPurchase: true
      });
      
      await product.save();
    }

    console.log('⭐ Added reviews to existing products');

    console.log('✅ Additional sample data added successfully!');
    
    // Summary
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalOrders = await Order.countDocuments();

    console.log('\n📊 DATABASE SUMMARY:');
    console.log(`👥 Total Users: ${totalUsers}`);
    console.log(`📂 Total Categories: ${totalCategories}`);
    console.log(`📦 Total Products: ${totalProducts}`);
    console.log(`📋 Total Orders: ${totalOrders}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
};

addMoreSampleData();
