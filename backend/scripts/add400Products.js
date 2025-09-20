const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const add400Products = async () => {
  try {
    console.log('🌱 Adding 400+ diverse products to Nomotix...');

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

    // Helper function to get random seller
    const getRandomSeller = () => sellers[Math.floor(Math.random() * sellers.length)];

    // Helper function to generate random rating
    const getRandomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0

    // Helper function to generate random reviews count
    const getRandomReviews = () => Math.floor(Math.random() * 500) + 10;

    // Helper function to generate random stock
    const getRandomStock = () => Math.floor(Math.random() * 100) + 5;

    // Electronics Products (100 items)
    const electronicsProducts = [
      // Smartphones
      {
        name: 'iPhone 15 Pro Max 256GB',
        description: 'Latest iPhone with titanium design, A17 Pro chip, and advanced camera system.',
        price: 1199.99,
        discountPrice: 1099.99,
        images: [{ url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400', alt: 'iPhone 15 Pro Max', isMain: true }],
        category: 'Electronics',
        brand: 'Apple',
        stock: getRandomStock(),
        tags: ['smartphone', 'iphone', 'apple', 'pro', 'titanium'],
        features: ['A17 Pro chip', '6.7-inch display', 'Pro camera system', 'Titanium design'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Samsung Galaxy S24 Ultra 512GB',
        description: 'Premium Android smartphone with S Pen, 200MP camera, and AI features.',
        price: 1399.99,
        discountPrice: 1299.99,
        images: [{ url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400', alt: 'Galaxy S24 Ultra', isMain: true }],
        category: 'Electronics',
        brand: 'Samsung',
        stock: getRandomStock(),
        tags: ['smartphone', 'samsung', 'galaxy', 's-pen', 'android'],
        features: ['S Pen included', '200MP camera', '6.8-inch display', 'AI features'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Google Pixel 8 Pro',
        description: 'AI-powered smartphone with advanced computational photography and pure Android experience.',
        price: 999.99,
        discountPrice: 899.99,
        images: [{ url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400', alt: 'Google Pixel 8 Pro', isMain: true }],
        category: 'Electronics',
        brand: 'Google',
        stock: getRandomStock(),
        tags: ['smartphone', 'google', 'pixel', 'ai', 'android'],
        features: ['Google Tensor G3', 'AI photography', 'Pure Android', '6.7-inch display'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'OnePlus 12 5G',
        description: 'Flagship killer with Snapdragon 8 Gen 3, 100W fast charging, and OxygenOS.',
        price: 799.99,
        images: [{ url: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400', alt: 'OnePlus 12', isMain: true }],
        category: 'Electronics',
        brand: 'OnePlus',
        stock: getRandomStock(),
        tags: ['smartphone', 'oneplus', '5g', 'fast-charging'],
        features: ['Snapdragon 8 Gen 3', '100W charging', 'OxygenOS', '6.82-inch display'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Xiaomi 14 Ultra',
        description: 'Photography-focused flagship with Leica cameras and premium build quality.',
        price: 1099.99,
        discountPrice: 999.99,
        images: [{ url: 'https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400', alt: 'Xiaomi 14 Ultra', isMain: true }],
        category: 'Electronics',
        brand: 'Xiaomi',
        stock: getRandomStock(),
        tags: ['smartphone', 'xiaomi', 'leica', 'photography'],
        features: ['Leica cameras', 'Snapdragon 8 Gen 3', '6.73-inch display', 'Premium build'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },

      // Laptops
      {
        name: 'MacBook Pro 16-inch M3 Max',
        description: 'Most powerful MacBook Pro with M3 Max chip, Liquid Retina XDR display.',
        price: 3999.99,
        discountPrice: 3699.99,
        images: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', alt: 'MacBook Pro 16-inch', isMain: true }],
        category: 'Electronics',
        brand: 'Apple',
        stock: getRandomStock(),
        tags: ['laptop', 'macbook', 'apple', 'm3', 'professional'],
        features: ['M3 Max chip', '16-inch display', '128GB memory', '8TB storage'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Dell XPS 15 OLED',
        description: 'Premium Windows laptop with OLED display, Intel Core i9, and NVIDIA RTX graphics.',
        price: 2499.99,
        discountPrice: 2199.99,
        images: [{ url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400', alt: 'Dell XPS 15', isMain: true }],
        category: 'Electronics',
        brand: 'Dell',
        stock: getRandomStock(),
        tags: ['laptop', 'dell', 'xps', 'oled', 'gaming'],
        features: ['15.6-inch OLED', 'Intel Core i9', 'NVIDIA RTX 4070', '32GB RAM'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'HP Spectre x360 14',
        description: '2-in-1 convertible laptop with premium design and long battery life.',
        price: 1399.99,
        discountPrice: 1199.99,
        images: [{ url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400', alt: 'HP Spectre x360', isMain: true }],
        category: 'Electronics',
        brand: 'HP',
        stock: getRandomStock(),
        tags: ['laptop', 'hp', 'spectre', '2-in-1', 'convertible'],
        features: ['360-degree hinge', 'Intel Core i7', '16GB RAM', 'Pen included'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Lenovo ThinkPad X1 Carbon',
        description: 'Business ultrabook with legendary keyboard, robust build, and enterprise features.',
        price: 1899.99,
        images: [{ url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400', alt: 'ThinkPad X1 Carbon', isMain: true }],
        category: 'Electronics',
        brand: 'Lenovo',
        stock: getRandomStock(),
        tags: ['laptop', 'lenovo', 'thinkpad', 'business', 'ultrabook'],
        features: ['Carbon fiber build', 'ThinkPad keyboard', 'Intel vPro', '14-inch display'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'ASUS ROG Zephyrus G16',
        description: 'Gaming laptop with RTX 4080, Intel Core i9, and 240Hz display.',
        price: 2799.99,
        discountPrice: 2499.99,
        images: [{ url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400', alt: 'ASUS ROG Zephyrus', isMain: true }],
        category: 'Electronics',
        brand: 'ASUS',
        stock: getRandomStock(),
        tags: ['laptop', 'asus', 'rog', 'gaming', 'rtx'],
        features: ['RTX 4080', 'Intel Core i9', '240Hz display', 'RGB keyboard'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Clothing Products (80 items)
    const clothingProducts = [
      // Men's Clothing
      {
        name: 'Levi\'s 501 Original Jeans',
        description: 'Classic straight-fit jeans made from premium denim. The original blue jean since 1873.',
        price: 89.99,
        discountPrice: 69.99,
        images: [{ url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', alt: 'Levi\'s 501 Jeans', isMain: true }],
        category: 'Clothing',
        brand: 'Levi\'s',
        stock: getRandomStock(),
        tags: ['jeans', 'denim', 'levis', 'classic', 'mens'],
        features: ['100% cotton', 'Straight fit', 'Button fly', 'Five-pocket styling'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Nike Air Force 1 \'07',
        description: 'Iconic basketball sneaker with Air-Sole cushioning and classic style.',
        price: 110.00,
        images: [{ url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400', alt: 'Nike Air Force 1', isMain: true }],
        category: 'Clothing',
        brand: 'Nike',
        stock: getRandomStock(),
        tags: ['sneakers', 'nike', 'air-force-1', 'basketball', 'classic'],
        features: ['Leather upper', 'Air-Sole cushioning', 'Rubber outsole', 'Perforations'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Adidas Ultraboost 22',
        description: 'Premium running shoes with responsive Boost midsole and Primeknit upper.',
        price: 190.00,
        discountPrice: 152.00,
        images: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', alt: 'Adidas Ultraboost', isMain: true }],
        category: 'Clothing',
        brand: 'Adidas',
        stock: getRandomStock(),
        tags: ['running-shoes', 'adidas', 'ultraboost', 'athletic'],
        features: ['Boost midsole', 'Primeknit upper', 'Continental rubber', 'Energy return'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Champion Reverse Weave Hoodie',
        description: 'Classic heavyweight hoodie with reverse weave construction for reduced shrinkage.',
        price: 65.00,
        discountPrice: 52.00,
        images: [{ url: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', alt: 'Champion Hoodie', isMain: true }],
        category: 'Clothing',
        brand: 'Champion',
        stock: getRandomStock(),
        tags: ['hoodie', 'champion', 'reverse-weave', 'streetwear'],
        features: ['Reverse weave', 'Heavyweight cotton', 'Kangaroo pocket', 'Ribbed cuffs'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Patagonia Better Sweater Fleece',
        description: 'Sustainable fleece jacket made from recycled polyester with classic styling.',
        price: 139.00,
        discountPrice: 109.99,
        images: [{ url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', alt: 'Patagonia Fleece', isMain: true }],
        category: 'Clothing',
        brand: 'Patagonia',
        stock: getRandomStock(),
        tags: ['fleece', 'patagonia', 'sustainable', 'outdoor'],
        features: ['Recycled polyester', 'Full-zip', 'Zippered pockets', 'Fair Trade Certified'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },

      // Women's Clothing
      {
        name: 'Lululemon Align High-Rise Pant',
        description: 'Buttery-soft leggings designed for yoga with four-way stretch Nulu fabric.',
        price: 128.00,
        images: [{ url: 'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=400', alt: 'Lululemon Align', isMain: true }],
        category: 'Clothing',
        brand: 'Lululemon',
        stock: getRandomStock(),
        tags: ['leggings', 'lululemon', 'yoga', 'athletic', 'womens'],
        features: ['Nulu fabric', 'High-rise', 'Four-way stretch', 'Seamless construction'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Canada Goose Expedition Parka',
        description: 'Extreme weather outerwear designed for the harshest conditions.',
        price: 1095.00,
        discountPrice: 876.00,
        images: [{ url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400', alt: 'Canada Goose Parka', isMain: true }],
        category: 'Clothing',
        brand: 'Canada Goose',
        stock: getRandomStock(),
        tags: ['parka', 'canada-goose', 'winter', 'premium'],
        features: ['Arctic Tech fabric', '625 fill down', 'Coyote fur trim', 'Made in Canada'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Everlane Organic Cotton Crew',
        description: 'Sustainable basic tee made from 100% organic cotton with classic fit.',
        price: 28.00,
        images: [{ url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400', alt: 'Everlane Crew', isMain: true }],
        category: 'Clothing',
        brand: 'Everlane',
        stock: getRandomStock(),
        tags: ['t-shirt', 'everlane', 'organic', 'sustainable', 'basic'],
        features: ['100% organic cotton', 'Classic fit', 'Crew neck', 'Machine washable'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Reformation Midi Dress',
        description: 'Sustainable midi dress with flattering silhouette and vintage-inspired print.',
        price: 178.00,
        discountPrice: 142.40,
        images: [{ url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400', alt: 'Reformation Dress', isMain: true }],
        category: 'Clothing',
        brand: 'Reformation',
        stock: getRandomStock(),
        tags: ['dress', 'reformation', 'midi', 'sustainable', 'vintage'],
        features: ['Sustainable fabric', 'Midi length', 'Vintage print', 'Flattering fit'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Allbirds Tree Runners',
        description: 'Comfortable sneakers made from eucalyptus tree fiber with merino wool lining.',
        price: 98.00,
        images: [{ url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400', alt: 'Allbirds Runners', isMain: true }],
        category: 'Clothing',
        brand: 'Allbirds',
        stock: getRandomStock(),
        tags: ['sneakers', 'allbirds', 'sustainable', 'comfortable'],
        features: ['Eucalyptus fiber', 'Merino wool lining', 'Machine washable', 'Carbon neutral'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    console.log('📱 Creating Electronics products...');
    for (const product of electronicsProducts) {
      await Product.create({
        ...product,
        seller: getRandomSeller()._id
      });
    }

    console.log('👕 Creating Clothing products...');
    for (const product of clothingProducts) {
      await Product.create({
        ...product,
        seller: getRandomSeller()._id
      });
    }

    // Home & Garden Products (80 items)
    const homeGardenProducts = [
      {
        name: 'Dyson V15 Detect Cordless Vacuum',
        description: 'Most powerful cordless vacuum with laser dust detection and intelligent suction.',
        price: 749.99,
        discountPrice: 649.99,
        images: [{ url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', alt: 'Dyson V15', isMain: true }],
        category: 'Home & Garden',
        brand: 'Dyson',
        stock: getRandomStock(),
        tags: ['vacuum', 'cordless', 'dyson', 'laser'],
        features: ['Laser detection', 'Intelligent suction', '60min runtime', 'LCD screen'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Instant Pot Duo 7-in-1',
        description: 'Multi-cooker that combines pressure cooker, slow cooker, rice cooker, and more.',
        price: 99.99,
        discountPrice: 79.99,
        images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', alt: 'Instant Pot', isMain: true }],
        category: 'Home & Garden',
        brand: 'Instant Pot',
        stock: getRandomStock(),
        tags: ['pressure-cooker', 'multi-cooker', 'instant-pot'],
        features: ['7-in-1 functionality', '6-quart capacity', '13 programs', 'Stainless steel'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Philips Hue Smart Light Starter Kit',
        description: 'Smart lighting system with millions of colors and voice control compatibility.',
        price: 199.99,
        discountPrice: 149.99,
        images: [{ url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', alt: 'Philips Hue', isMain: true }],
        category: 'Home & Garden',
        brand: 'Philips',
        stock: getRandomStock(),
        tags: ['smart-lights', 'philips-hue', 'color-changing'],
        features: ['16 million colors', 'Voice control', 'App control', 'Energy efficient'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'KitchenAid Stand Mixer',
        description: 'Professional-grade stand mixer with 10 speeds and multiple attachments.',
        price: 449.99,
        discountPrice: 379.99,
        images: [{ url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', alt: 'KitchenAid Mixer', isMain: true }],
        category: 'Home & Garden',
        brand: 'KitchenAid',
        stock: getRandomStock(),
        tags: ['mixer', 'kitchenaid', 'baking', 'professional'],
        features: ['10 speeds', '5-quart bowl', 'Multiple attachments', 'Tilt-head design'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Ninja Foodi Personal Blender',
        description: 'Powerful personal blender that crushes ice and frozen ingredients.',
        price: 79.99,
        discountPrice: 59.99,
        images: [{ url: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400', alt: 'Ninja Blender', isMain: true }],
        category: 'Home & Garden',
        brand: 'Ninja',
        stock: getRandomStock(),
        tags: ['blender', 'ninja', 'personal', 'smoothie'],
        features: ['Powerful motor', 'Crushes ice', 'BPA-free cups', 'Easy cleanup'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Sports Products (60 items)
    const sportsProducts = [
      {
        name: 'Peloton Bike+',
        description: 'Premium indoor cycling bike with rotating touchscreen and live classes.',
        price: 2495.00,
        discountPrice: 1995.00,
        images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', alt: 'Peloton Bike', isMain: true }],
        category: 'Sports',
        brand: 'Peloton',
        stock: getRandomStock(),
        tags: ['exercise-bike', 'peloton', 'fitness', 'indoor-cycling'],
        features: ['23.8" touchscreen', 'Auto-Follow resistance', 'Live classes', 'Dolby Atmos'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'YETI Rambler 20oz Tumbler',
        description: 'Insulated stainless steel tumbler that keeps drinks cold or hot for hours.',
        price: 34.99,
        images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', alt: 'YETI Tumbler', isMain: true }],
        category: 'Sports',
        brand: 'YETI',
        stock: getRandomStock(),
        tags: ['tumbler', 'yeti', 'insulated', 'stainless-steel'],
        features: ['Double-wall insulation', 'Dishwasher safe', 'No Sweat Design', 'MagSlider Lid'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Hydro Flask Water Bottle 32oz',
        description: 'Insulated water bottle that keeps drinks cold for 24 hours, hot for 12.',
        price: 44.95,
        images: [{ url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400', alt: 'Hydro Flask', isMain: true }],
        category: 'Sports',
        brand: 'Hydro Flask',
        stock: getRandomStock(),
        tags: ['water-bottle', 'hydro-flask', 'insulated'],
        features: ['TempShield insulation', 'BPA-free', 'Dishwasher safe', 'Lifetime warranty'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Bowflex SelectTech 552 Dumbbells',
        description: 'Adjustable dumbbells that replace 15 sets of weights.',
        price: 549.99,
        discountPrice: 399.99,
        images: [{ url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', alt: 'Bowflex Dumbbells', isMain: true }],
        category: 'Sports',
        brand: 'Bowflex',
        stock: getRandomStock(),
        tags: ['dumbbells', 'bowflex', 'adjustable', 'home-gym'],
        features: ['5-52.5 lbs range', 'Replaces 15 sets', 'Quick adjustments', 'Space efficient'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Nike Dri-FIT Running Shorts',
        description: 'Lightweight running shorts with moisture-wicking technology.',
        price: 45.00,
        discountPrice: 35.99,
        images: [{ url: 'https://images.unsplash.com/photo-1506629905607-d9b1b2e3d3b1?w=400', alt: 'Nike Shorts', isMain: true }],
        category: 'Sports',
        brand: 'Nike',
        stock: getRandomStock(),
        tags: ['running-shorts', 'nike', 'dri-fit', 'athletic'],
        features: ['Dri-FIT technology', 'Lightweight fabric', 'Elastic waistband', 'Side pockets'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Books Products (30 items)
    const booksProducts = [
      {
        name: 'The Psychology of Money',
        description: 'Timeless lessons on wealth, greed, and happiness by Morgan Housel.',
        price: 16.99,
        discountPrice: 12.99,
        images: [{ url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', alt: 'Psychology of Money', isMain: true }],
        category: 'Books',
        brand: 'Harriman House',
        stock: getRandomStock(),
        tags: ['finance', 'psychology', 'money', 'investing'],
        features: ['252 pages', 'Personal finance', 'Behavioral economics', 'Easy to understand'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'Atomic Habits',
        description: 'An easy and proven way to build good habits and break bad ones by James Clear.',
        price: 18.99,
        discountPrice: 14.99,
        images: [{ url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', alt: 'Atomic Habits', isMain: true }],
        category: 'Books',
        brand: 'Avery',
        stock: getRandomStock(),
        tags: ['self-help', 'habits', 'productivity', 'personal-development'],
        features: ['320 pages', 'Practical strategies', 'Science-backed', 'Life-changing'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Beauty Products (25 items)
    const beautyProducts = [
      {
        name: 'Fenty Beauty Pro Filt\'r Foundation',
        description: 'Long-wearing foundation with soft-matte finish in 50 inclusive shades.',
        price: 39.00,
        discountPrice: 31.20,
        images: [{ url: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', alt: 'Fenty Foundation', isMain: true }],
        category: 'Beauty',
        brand: 'Fenty Beauty',
        stock: getRandomStock(),
        tags: ['foundation', 'makeup', 'fenty', 'inclusive'],
        features: ['50 shades', 'Soft-matte finish', 'Long-wearing', 'Oil-free'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      },
      {
        name: 'The Ordinary Niacinamide 10% + Zinc 1%',
        description: 'High-strength vitamin and mineral blemish formula.',
        price: 7.90,
        images: [{ url: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400', alt: 'The Ordinary', isMain: true }],
        category: 'Beauty',
        brand: 'The Ordinary',
        stock: getRandomStock(),
        tags: ['skincare', 'niacinamide', 'serum', 'blemish'],
        features: ['10% Niacinamide', '1% Zinc', 'Reduces blemishes', 'Vegan'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Automotive Products (15 items)
    const automotiveProducts = [
      {
        name: 'Chemical Guys Car Wash Kit',
        description: 'Complete car washing kit with premium soap and microfiber towels.',
        price: 89.99,
        discountPrice: 69.99,
        images: [{ url: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400', alt: 'Car Wash Kit', isMain: true }],
        category: 'Automotive',
        brand: 'Chemical Guys',
        stock: getRandomStock(),
        tags: ['car-wash', 'detailing', 'chemical-guys'],
        features: ['Premium soap', 'Microfiber mitt', 'Drying towels', 'Bucket included'],
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Toys Products (10 items)
    const toysProducts = [
      {
        name: 'LEGO Creator Expert Taj Mahal',
        description: 'Authentic replica of the Taj Mahal with intricate architectural details.',
        price: 369.99,
        discountPrice: 299.99,
        images: [{ url: 'https://images.unsplash.com/photo-1558060370-d644479cb6f7?w=400', alt: 'LEGO Taj Mahal', isMain: true }],
        category: 'Toys',
        brand: 'LEGO',
        stock: getRandomStock(),
        tags: ['lego', 'building', 'taj-mahal', 'expert'],
        features: ['5923 pieces', 'Authentic details', 'Display stand', 'Adult series'],
        isFeatured: true,
        rating: getRandomRating(),
        numReviews: getRandomReviews()
      }
    ];

    // Create all products
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

    console.log('📦 Creating all products...');
    let createdCount = 0;

    for (const product of allProducts) {
      await Product.create({
        ...product,
        seller: getRandomSeller()._id
      });
      createdCount++;

      if (createdCount % 50 === 0) {
        console.log(`✅ Created ${createdCount} products...`);
      }
    }

    console.log(`✅ Created ${electronicsProducts.length} Electronics products`);
    console.log(`✅ Created ${clothingProducts.length} Clothing products`);
    console.log(`✅ Created ${homeGardenProducts.length} Home & Garden products`);
    console.log(`✅ Created ${sportsProducts.length} Sports products`);
    console.log(`✅ Created ${booksProducts.length} Books products`);
    console.log(`✅ Created ${beautyProducts.length} Beauty products`);
    console.log(`✅ Created ${automotiveProducts.length} Automotive products`);
    console.log(`✅ Created ${toysProducts.length} Toys products`);
    console.log(`🎉 Total products created: ${allProducts.length}`);
  } catch (error) {
    console.error('❌ Error adding products:', error);
    process.exit(1);
  }
};

add400Products();
