const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const addCustomProducts = async () => {
  try {
    console.log('🌱 Adding comprehensive custom product data...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB Atlas');

    // Get sellers
    const sellers = await User.find({ role: 'seller' });
    if (sellers.length === 0) {
      console.log('❌ No sellers found. Please run the main seed script first.');
      return;
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Electronics Products
    const electronicsProducts = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'The most advanced iPhone ever with titanium design, A17 Pro chip, and professional camera system. Features 6.7-inch Super Retina XDR display with ProMotion technology.',
        price: 1199.99,
        discountPrice: 1099.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', alt: 'iPhone 15 Pro Max', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Apple',
        stock: 45,
        tags: ['smartphone', 'iphone', 'apple', 'pro', 'titanium'],
        features: [
          'A17 Pro chip with 6-core GPU',
          '6.7-inch Super Retina XDR display',
          'Pro camera system with 5x Telephoto',
          'Titanium design',
          'Action Button'
        ],
        specifications: [
          { name: 'Display', value: '6.7-inch Super Retina XDR' },
          { name: 'Chip', value: 'A17 Pro' },
          { name: 'Storage', value: '256GB' },
          { name: 'Camera', value: '48MP Main, 12MP Ultra Wide, 12MP Telephoto' }
        ],
        isFeatured: true,
        rating: 4.8,
        numReviews: 156
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen, 200MP camera, and AI-powered features. Built with titanium for durability and premium feel.',
        price: 1299.99,
        discountPrice: 1199.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', alt: 'Samsung Galaxy S24 Ultra', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Samsung',
        stock: 32,
        tags: ['smartphone', 'samsung', 'galaxy', 's-pen', 'android'],
        features: [
          'S Pen included',
          '200MP main camera',
          '6.8-inch Dynamic AMOLED 2X',
          'Snapdragon 8 Gen 3',
          'AI photo editing'
        ],
        specifications: [
          { name: 'Display', value: '6.8-inch Dynamic AMOLED 2X' },
          { name: 'Processor', value: 'Snapdragon 8 Gen 3' },
          { name: 'Storage', value: '256GB' },
          { name: 'Camera', value: '200MP Main, 50MP Periscope Telephoto' }
        ],
        isFeatured: true,
        rating: 4.7,
        numReviews: 89
      },
      {
        name: 'MacBook Pro 16-inch M3 Max',
        description: 'The most powerful MacBook Pro ever with M3 Max chip, Liquid Retina XDR display, and up to 22 hours of battery life. Perfect for professionals.',
        price: 3999.99,
        discountPrice: 3699.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', alt: 'MacBook Pro 16-inch', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Apple',
        stock: 18,
        tags: ['laptop', 'macbook', 'apple', 'm3', 'professional'],
        features: [
          'M3 Max chip with 40-core GPU',
          '16-inch Liquid Retina XDR display',
          '128GB unified memory',
          '8TB SSD storage',
          '22-hour battery life'
        ],
        specifications: [
          { name: 'Chip', value: 'Apple M3 Max' },
          { name: 'Memory', value: '128GB unified memory' },
          { name: 'Storage', value: '8TB SSD' },
          { name: 'Display', value: '16.2-inch Liquid Retina XDR' }
        ],
        isFeatured: true,
        rating: 4.9,
        numReviews: 67
      },
      {
        name: 'Sony WH-1000XM5 Headphones',
        description: 'Industry-leading noise canceling wireless headphones with exceptional sound quality, 30-hour battery life, and crystal-clear call quality.',
        price: 399.99,
        discountPrice: 299.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', alt: 'Sony WH-1000XM5', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Sony',
        stock: 67,
        tags: ['headphones', 'wireless', 'noise-canceling', 'sony'],
        features: [
          'Industry-leading noise canceling',
          '30-hour battery life',
          'Quick Charge (3 min = 3 hours)',
          'Speak-to-Chat technology',
          'Multipoint connection'
        ],
        specifications: [
          { name: 'Driver Unit', value: '30mm' },
          { name: 'Frequency Response', value: '4 Hz-40,000 Hz' },
          { name: 'Battery Life', value: '30 hours' },
          { name: 'Weight', value: '250g' }
        ],
        rating: 4.6,
        numReviews: 234
      },
      {
        name: 'iPad Pro 12.9-inch M2',
        description: 'The ultimate iPad experience with M2 chip, Liquid Retina XDR display, and support for Apple Pencil. Perfect for creativity and productivity.',
        price: 1099.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', alt: 'iPad Pro 12.9-inch', isMain: true }
        ],
        category: 'Electronics',
        brand: 'Apple',
        stock: 29,
        tags: ['tablet', 'ipad', 'apple', 'm2', 'pro'],
        features: [
          'M2 chip with 8-core CPU',
          '12.9-inch Liquid Retina XDR display',
          'Apple Pencil (2nd generation) support',
          'Magic Keyboard support',
          '5G connectivity'
        ],
        rating: 4.7,
        numReviews: 145
      }
    ];

    // Clothing Products
    const clothingProducts = [
      {
        name: 'Levi\'s 501 Original Jeans',
        description: 'The original blue jean since 1873. Crafted with premium denim and a classic straight fit that never goes out of style.',
        price: 89.99,
        discountPrice: 69.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', alt: 'Levi\'s 501 Jeans', isMain: true }
        ],
        category: 'Clothing',
        brand: 'Levi\'s',
        stock: 156,
        tags: ['jeans', 'denim', 'levis', 'classic', 'straight-fit'],
        features: [
          '100% cotton denim',
          'Classic straight fit',
          'Button fly',
          'Five-pocket styling',
          'Machine washable'
        ],
        specifications: [
          { name: 'Material', value: '100% Cotton' },
          { name: 'Fit', value: 'Straight' },
          { name: 'Rise', value: 'Mid-rise' },
          { name: 'Care', value: 'Machine wash cold' }
        ],
        rating: 4.5,
        numReviews: 892
      },
      {
        name: 'Nike Air Force 1 \'07',
        description: 'The radiance lives on in the Nike Air Force 1 \'07, the basketball original that puts a fresh spin on what you know best.',
        price: 110.00,
        images: [
          { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', alt: 'Nike Air Force 1', isMain: true }
        ],
        category: 'Clothing',
        brand: 'Nike',
        stock: 89,
        tags: ['sneakers', 'nike', 'air-force-1', 'basketball', 'classic'],
        features: [
          'Leather upper',
          'Air-Sole unit cushioning',
          'Rubber outsole',
          'Perforations on toe',
          'Classic basketball style'
        ],
        isFeatured: true,
        rating: 4.6,
        numReviews: 567
      },
      {
        name: 'Patagonia Better Sweater Fleece Jacket',
        description: 'A versatile fleece jacket made from recycled polyester. Perfect for outdoor adventures or casual wear.',
        price: 139.00,
        discountPrice: 109.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', alt: 'Patagonia Fleece Jacket', isMain: true }
        ],
        category: 'Clothing',
        brand: 'Patagonia',
        stock: 45,
        tags: ['jacket', 'fleece', 'patagonia', 'outdoor', 'sustainable'],
        features: [
          '100% recycled polyester',
          'Full-zip design',
          'Zippered handwarmer pockets',
          'Micro-fleece lined collar',
          'Fair Trade Certified™'
        ],
        rating: 4.8,
        numReviews: 234
      }
    ];

    // Home & Garden Products
    const homeGardenProducts = [
      {
        name: 'Dyson V15 Detect Cordless Vacuum',
        description: 'The most powerful, intelligent cordless vacuum. Reveals invisible dust with laser technology and adapts suction power automatically.',
        price: 749.99,
        discountPrice: 649.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Dyson V15 Detect', isMain: true }
        ],
        category: 'Home & Garden',
        brand: 'Dyson',
        stock: 34,
        tags: ['vacuum', 'cordless', 'dyson', 'laser', 'intelligent'],
        features: [
          'Laser dust detection',
          'Intelligent suction adjustment',
          '60-minute run time',
          'Advanced filtration system',
          'LCD screen with real-time data'
        ],
        specifications: [
          { name: 'Run Time', value: 'Up to 60 minutes' },
          { name: 'Bin Capacity', value: '0.77 liters' },
          { name: 'Weight', value: '3.0 kg' },
          { name: 'Filtration', value: 'Advanced whole-machine filtration' }
        ],
        isFeatured: true,
        rating: 4.7,
        numReviews: 189
      },
      {
        name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
        description: 'The original multi-cooker that combines 7 kitchen appliances in one. Pressure cook, slow cook, rice cooker, steamer, sauté, yogurt maker, and warmer.',
        price: 99.99,
        discountPrice: 79.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', alt: 'Instant Pot Duo', isMain: true }
        ],
        category: 'Home & Garden',
        brand: 'Instant Pot',
        stock: 78,
        tags: ['pressure-cooker', 'multi-cooker', 'instant-pot', 'kitchen'],
        features: [
          '7-in-1 functionality',
          '6-quart capacity',
          '13 one-touch programs',
          'Stainless steel cooking pot',
          'Advanced safety features'
        ],
        rating: 4.6,
        numReviews: 1247
      },
      {
        name: 'Philips Hue White and Color Ambiance Starter Kit',
        description: 'Smart lighting system with millions of colors and shades of white light. Control with your smartphone or voice commands.',
        price: 199.99,
        discountPrice: 149.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', alt: 'Philips Hue Lights', isMain: true }
        ],
        category: 'Home & Garden',
        brand: 'Philips',
        stock: 56,
        tags: ['smart-lights', 'philips-hue', 'color-changing', 'wifi'],
        features: [
          '16 million colors',
          'Voice control compatible',
          'Smartphone app control',
          'Energy efficient LED',
          'Easy setup'
        ],
        rating: 4.5,
        numReviews: 345
      }
    ];

    // Sports Products
    const sportsProducts = [
      {
        name: 'Peloton Bike+',
        description: 'Premium indoor cycling bike with rotating HD touchscreen, immersive classes, and real-time metrics. Transform your home into a world-class studio.',
        price: 2495.00,
        discountPrice: 1995.00,
        images: [
          { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', alt: 'Peloton Bike+', isMain: true }
        ],
        category: 'Sports',
        brand: 'Peloton',
        stock: 12,
        tags: ['exercise-bike', 'peloton', 'fitness', 'indoor-cycling'],
        features: [
          '23.8" rotating HD touchscreen',
          'Auto-Follow resistance',
          'Apple GymKit integration',
          'Dolby Atmos speakers',
          'Live and on-demand classes'
        ],
        specifications: [
          { name: 'Dimensions', value: '59" L x 23" W x 59" H' },
          { name: 'Weight', value: '140 lbs' },
          { name: 'Max User Weight', value: '297 lbs' },
          { name: 'Screen', value: '23.8" HD touchscreen' }
        ],
        isFeatured: true,
        rating: 4.4,
        numReviews: 89
      },
      {
        name: 'YETI Rambler 20 oz Tumbler',
        description: 'Durable stainless steel tumbler with double-wall vacuum insulation. Keeps drinks cold or hot for hours.',
        price: 34.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', alt: 'YETI Rambler Tumbler', isMain: true }
        ],
        category: 'Sports',
        brand: 'YETI',
        stock: 145,
        tags: ['tumbler', 'yeti', 'insulated', 'stainless-steel'],
        features: [
          'Double-wall vacuum insulation',
          'Dishwasher safe',
          'Durable stainless steel',
          'No Sweat Design',
          'MagSlider Lid'
        ],
        rating: 4.8,
        numReviews: 567
      },
      {
        name: 'Nike Dri-FIT Running Shorts',
        description: 'Lightweight running shorts with Dri-FIT technology to keep you dry and comfortable during your workout.',
        price: 45.00,
        discountPrice: 35.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=400', alt: 'Nike Running Shorts', isMain: true }
        ],
        category: 'Sports',
        brand: 'Nike',
        stock: 89,
        tags: ['running-shorts', 'nike', 'dri-fit', 'athletic'],
        features: [
          'Dri-FIT technology',
          'Lightweight fabric',
          'Elastic waistband',
          'Side pockets',
          'Reflective details'
        ],
        rating: 4.3,
        numReviews: 234
      }
    ];

    // Books Products
    const booksProducts = [
      {
        name: 'The Psychology of Money by Morgan Housel',
        description: 'Timeless lessons on wealth, greed, and happiness. A fascinating exploration of how psychology affects our financial decisions.',
        price: 16.99,
        discountPrice: 12.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', alt: 'The Psychology of Money', isMain: true }
        ],
        category: 'Books',
        brand: 'Harriman House',
        stock: 234,
        tags: ['finance', 'psychology', 'money', 'investing', 'bestseller'],
        features: [
          'New York Times Bestseller',
          '252 pages',
          'Personal finance insights',
          'Behavioral economics',
          'Easy to understand'
        ],
        specifications: [
          { name: 'Author', value: 'Morgan Housel' },
          { name: 'Pages', value: '252' },
          { name: 'Publisher', value: 'Harriman House' },
          { name: 'Language', value: 'English' }
        ],
        isFeatured: true,
        rating: 4.7,
        numReviews: 1456
      },
      {
        name: 'Atomic Habits by James Clear',
        description: 'An easy and proven way to build good habits and break bad ones. Transform your life with tiny changes that deliver remarkable results.',
        price: 18.99,
        discountPrice: 14.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', alt: 'Atomic Habits', isMain: true }
        ],
        category: 'Books',
        brand: 'Avery',
        stock: 189,
        tags: ['self-help', 'habits', 'productivity', 'personal-development'],
        features: [
          '#1 New York Times Bestseller',
          '320 pages',
          'Practical strategies',
          'Science-backed methods',
          'Life-changing insights'
        ],
        rating: 4.8,
        numReviews: 2134
      }
    ];

    // Beauty Products
    const beautyProducts = [
      {
        name: 'Fenty Beauty Pro Filt\'r Soft Matte Foundation',
        description: 'Long-wearing, buildable foundation with a soft-matte finish. Available in 50 shades for all skin tones.',
        price: 39.00,
        discountPrice: 31.20,
        images: [
          { url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', alt: 'Fenty Beauty Foundation', isMain: true }
        ],
        category: 'Beauty',
        brand: 'Fenty Beauty',
        stock: 67,
        tags: ['foundation', 'makeup', 'fenty', 'matte', 'inclusive'],
        features: [
          '50 inclusive shades',
          'Soft-matte finish',
          'Long-wearing formula',
          'Buildable coverage',
          'Oil-free'
        ],
        specifications: [
          { name: 'Coverage', value: 'Medium to Full' },
          { name: 'Finish', value: 'Soft Matte' },
          { name: 'Size', value: '32ml / 1.08 fl oz' },
          { name: 'Skin Type', value: 'All skin types' }
        ],
        rating: 4.5,
        numReviews: 789
      },
      {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        description: 'High-strength vitamin and mineral blemish formula. Reduces the appearance of skin blemishes and congestion.',
        price: 7.90,
        images: [
          { url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', alt: 'The Ordinary Niacinamide', isMain: true }
        ],
        category: 'Beauty',
        brand: 'The Ordinary',
        stock: 156,
        tags: ['skincare', 'niacinamide', 'serum', 'blemish', 'affordable'],
        features: [
          '10% Niacinamide',
          '1% Zinc PCA',
          'Reduces blemishes',
          'Controls oil production',
          'Vegan and cruelty-free'
        ],
        rating: 4.3,
        numReviews: 1234
      }
    ];

    // Automotive Products
    const automotiveProducts = [
      {
        name: 'Chemical Guys Car Wash Kit',
        description: 'Complete car washing kit with premium soap, microfiber towels, and wash mitt. Everything you need for a professional car wash.',
        price: 89.99,
        discountPrice: 69.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400', alt: 'Car Wash Kit', isMain: true }
        ],
        category: 'Automotive',
        brand: 'Chemical Guys',
        stock: 45,
        tags: ['car-wash', 'detailing', 'chemical-guys', 'kit'],
        features: [
          'Premium car soap',
          'Microfiber wash mitt',
          'Drying towels',
          'Bucket with grit guard',
          'Professional results'
        ],
        rating: 4.6,
        numReviews: 345
      },
      {
        name: 'Garmin DriveSmart 65 GPS Navigator',
        description: '6.95" GPS navigator with bright, clear maps and voice-activated navigation. Includes traffic alerts and smartphone integration.',
        price: 249.99,
        discountPrice: 199.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Garmin GPS', isMain: true }
        ],
        category: 'Automotive',
        brand: 'Garmin',
        stock: 28,
        tags: ['gps', 'navigation', 'garmin', 'automotive'],
        features: [
          '6.95" edge-to-edge display',
          'Voice-activated navigation',
          'Live traffic alerts',
          'Smartphone integration',
          'Preloaded maps'
        ],
        rating: 4.4,
        numReviews: 167
      }
    ];

    // Toys Products
    const toysProducts = [
      {
        name: 'LEGO Creator Expert Taj Mahal',
        description: 'Authentic replica of the Taj Mahal with intricate details. Perfect for adult LEGO enthusiasts and display.',
        price: 369.99,
        discountPrice: 299.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', alt: 'LEGO Taj Mahal', isMain: true }
        ],
        category: 'Toys',
        brand: 'LEGO',
        stock: 23,
        tags: ['lego', 'building', 'taj-mahal', 'expert', 'collectible'],
        features: [
          '5923 pieces',
          'Authentic architectural details',
          'Display stand included',
          'Adult collector series',
          'Premium building experience'
        ],
        specifications: [
          { name: 'Pieces', value: '5923' },
          { name: 'Age', value: '18+' },
          { name: 'Dimensions', value: '20" x 20" x 8"' },
          { name: 'Series', value: 'Creator Expert' }
        ],
        isFeatured: true,
        rating: 4.9,
        numReviews: 89
      },
      {
        name: 'Nintendo Switch OLED Model',
        description: 'Enhanced Nintendo Switch with vibrant 7-inch OLED screen, improved audio, and enhanced kickstand for tabletop play.',
        price: 349.99,
        images: [
          { url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400', alt: 'Nintendo Switch OLED', isMain: true }
        ],
        category: 'Toys',
        brand: 'Nintendo',
        stock: 34,
        tags: ['nintendo', 'switch', 'gaming', 'oled', 'portable'],
        features: [
          '7-inch OLED screen',
          'Enhanced audio',
          'Wide adjustable stand',
          'Dock with wired LAN port',
          '64GB internal storage'
        ],
        rating: 4.7,
        numReviews: 456
      }
    ];

    console.log('📦 Creating comprehensive product catalog...');

    // Create all products with random seller assignment
    const allProducts = [
      ...electronicsProducts,
      ...clothingProducts,
      ...homeGardenProducts,
      ...sportsProducts,
      ...booksProducts,
      ...beautyProducts,
      ...automotiveProducts,
      ...toysProducts
    ];

    for (const productData of allProducts) {
      const randomSeller = sellers[Math.floor(Math.random() * sellers.length)];
      await Product.create({
        ...productData,
        seller: randomSeller._id
      });
    }

    console.log(`✅ Created ${allProducts.length} products across all categories`);

    // Update category product counts
    const categories = await Category.find();
    for (const category of categories) {
      await Category.updateProductCount(category._id);
    }

    console.log('📊 Updated category product counts');
    console.log('✅ Custom product data added successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding custom products:', error);
    process.exit(1);
  }
};

addCustomProducts();
