const mongoose = require('mongoose');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    await Category.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Create demo users
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'buyer@demo.com',
        password: 'demo123',
        role: 'buyer',
        isEmailVerified: true
      },
      {
        name: 'Jane Smith',
        email: 'seller@demo.com',
        password: 'demo123',
        role: 'seller',
        isEmailVerified: true
      },
      {
        name: 'Admin User',
        email: 'admin@demo.com',
        password: 'demo123',
        role: 'admin',
        isEmailVerified: true
      }
    ]);

    console.log('👥 Created demo users');

    // Create categories
    const categories = await Category.create([
      {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400'
      },
      {
        name: 'Clothing',
        description: 'Fashion and apparel',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'
      },
      {
        name: 'Home & Garden',
        description: 'Home improvement and garden supplies',
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400'
      },
      {
        name: 'Sports',
        description: 'Sports and fitness equipment',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
      },
      {
        name: 'Books',
        description: 'Books and educational materials',
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400'
      }
    ]);

    console.log('📂 Created categories');

    // Get seller user for products
    const seller = users.find(user => user.role === 'seller');

    // Create demo products
    const products = await Product.create([
      {
        name: 'Wireless Bluetooth Headphones',
        description: 'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        price: 79.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            alt: 'Wireless Bluetooth Headphones',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'AudioTech',
        stock: 25,
        seller: seller._id,
        tags: ['wireless', 'bluetooth', 'headphones', 'noise-cancellation'],
        features: [
          'Active Noise Cancellation',
          '30-hour battery life',
          'Quick charge - 5 min for 2 hours',
          'Premium sound quality'
        ],
        isFeatured: true,
        rating: 4.5,
        numReviews: 12
      },
      {
        name: 'Smart Fitness Watch',
        description: 'Advanced fitness tracking smartwatch with heart rate monitoring, GPS, sleep tracking, and 7-day battery life. Compatible with iOS and Android.',
        price: 199.99,
        discountPrice: 149.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
            alt: 'Smart Fitness Watch',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'FitTech',
        stock: 15,
        seller: seller._id,
        tags: ['smartwatch', 'fitness', 'health', 'gps'],
        features: [
          'Heart rate monitoring',
          'Built-in GPS',
          'Sleep tracking',
          '7-day battery life',
          'Water resistant'
        ],
        isFeatured: true,
        rating: 4.3,
        numReviews: 8
      },
      {
        name: 'Organic Cotton T-Shirt',
        description: 'Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes. Perfect for everyday wear.',
        price: 29.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
            alt: 'Organic Cotton T-Shirt',
            isMain: true
          }
        ],
        category: 'Clothing',
        brand: 'EcoWear',
        stock: 50,
        seller: seller._id,
        tags: ['organic', 'cotton', 'sustainable', 'casual'],
        features: [
          '100% organic cotton',
          'Sustainable production',
          'Comfortable fit',
          'Machine washable'
        ],
        rating: 4.7,
        numReviews: 15
      },
      {
        name: 'Stainless Steel Water Bottle',
        description: 'Insulated stainless steel water bottle that keeps drinks cold for 24 hours and hot for 12 hours. BPA-free and eco-friendly.',
        price: 24.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
            alt: 'Stainless Steel Water Bottle',
            isMain: true
          }
        ],
        category: 'Home & Garden',
        brand: 'HydroLife',
        stock: 30,
        seller: seller._id,
        tags: ['water-bottle', 'insulated', 'stainless-steel', 'eco-friendly'],
        features: [
          'Double-wall insulation',
          'BPA-free',
          'Leak-proof design',
          '500ml capacity'
        ],
        rating: 4.6,
        numReviews: 22
      },
      {
        name: 'Wireless Phone Charger',
        description: 'Fast wireless charging pad compatible with all Qi-enabled devices. Sleek design with LED indicator and overcharge protection.',
        price: 39.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400',
            alt: 'Wireless Phone Charger',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'ChargeTech',
        stock: 20,
        seller: seller._id,
        tags: ['wireless', 'charger', 'qi', 'fast-charging'],
        features: [
          'Fast wireless charging',
          'Qi-compatible',
          'LED indicator',
          'Overcharge protection'
        ],
        rating: 4.4,
        numReviews: 18
      },
      {
        name: 'Yoga Mat Premium',
        description: 'Non-slip premium yoga mat with excellent cushioning and grip. Made from eco-friendly materials. Perfect for yoga, pilates, and fitness.',
        price: 49.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
            alt: 'Yoga Mat Premium',
            isMain: true
          }
        ],
        category: 'Sports',
        brand: 'ZenFit',
        stock: 35,
        seller: seller._id,
        tags: ['yoga', 'mat', 'fitness', 'non-slip'],
        features: [
          'Non-slip surface',
          'Extra cushioning',
          'Eco-friendly materials',
          '6mm thickness'
        ],
        isFeatured: true,
        rating: 4.8,
        numReviews: 25
      },
      {
        name: 'Coffee Maker Deluxe',
        description: 'Programmable coffee maker with thermal carafe, built-in grinder, and auto-brew timer. Makes perfect coffee every time.',
        price: 129.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
            alt: 'Coffee Maker Deluxe',
            isMain: true
          }
        ],
        category: 'Home & Garden',
        brand: 'BrewMaster',
        stock: 12,
        seller: seller._id,
        tags: ['coffee', 'maker', 'programmable', 'grinder'],
        features: [
          'Built-in grinder',
          'Programmable timer',
          'Thermal carafe',
          '12-cup capacity'
        ],
        rating: 4.2,
        numReviews: 9
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable Bluetooth speaker with 360-degree sound, waterproof design, and 20-hour battery life. Perfect for outdoor adventures.',
        price: 59.99,
        images: [
          {
            url: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400',
            alt: 'Bluetooth Speaker',
            isMain: true
          }
        ],
        category: 'Electronics',
        brand: 'SoundWave',
        stock: 18,
        seller: seller._id,
        tags: ['bluetooth', 'speaker', 'portable', 'waterproof'],
        features: [
          '360-degree sound',
          'Waterproof design',
          '20-hour battery',
          'Compact and portable'
        ],
        rating: 4.5,
        numReviews: 14
      }
    ]);

    console.log('📦 Created demo products');

    // Update category product counts
    for (const category of categories) {
      await Category.updateProductCount(category._id);
    }

    console.log('📊 Updated category product counts');

    console.log('✅ Database seeding completed successfully!');
    console.log(`👥 Created ${users.length} users`);
    console.log(`📂 Created ${categories.length} categories`);
    console.log(`📦 Created ${products.length} products`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

module.exports = seedDatabase;
