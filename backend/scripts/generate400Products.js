const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const generate400Products = async () => {
  try {
    console.log('🌱 Generating 400+ diverse products for Nomotix...');

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

    // Helper functions
    const getRandomSeller = () => sellers[Math.floor(Math.random() * sellers.length)];
    const getRandomRating = () => (Math.random() * 1.5 + 3.5).toFixed(1);
    const getRandomReviews = () => Math.floor(Math.random() * 500) + 10;
    const getRandomStock = () => Math.floor(Math.random() * 100) + 5;
    const getRandomDiscount = (price) => Math.random() > 0.6 ? (price * 0.8).toFixed(2) : null;

    // Product templates for mass generation
    const productTemplates = {
      Electronics: [
        // Smartphones
        { base: 'iPhone', brands: ['Apple'], priceRange: [699, 1599], keywords: ['smartphone', 'ios', 'apple'] },
        { base: 'Galaxy', brands: ['Samsung'], priceRange: [399, 1399], keywords: ['smartphone', 'android', 'samsung'] },
        { base: 'Pixel', brands: ['Google'], priceRange: [399, 999], keywords: ['smartphone', 'android', 'google'] },
        { base: 'OnePlus', brands: ['OnePlus'], priceRange: [299, 899], keywords: ['smartphone', 'android', 'oneplus'] },
        
        // Laptops
        { base: 'MacBook', brands: ['Apple'], priceRange: [999, 3999], keywords: ['laptop', 'macbook', 'apple'] },
        { base: 'ThinkPad', brands: ['Lenovo'], priceRange: [699, 2499], keywords: ['laptop', 'business', 'lenovo'] },
        { base: 'XPS', brands: ['Dell'], priceRange: [899, 2999], keywords: ['laptop', 'premium', 'dell'] },
        { base: 'Surface', brands: ['Microsoft'], priceRange: [799, 2299], keywords: ['laptop', '2-in-1', 'microsoft'] },
        
        // Audio
        { base: 'AirPods', brands: ['Apple'], priceRange: [129, 549], keywords: ['earbuds', 'wireless', 'apple'] },
        { base: 'WH-1000XM', brands: ['Sony'], priceRange: [199, 399], keywords: ['headphones', 'noise-canceling', 'sony'] },
        { base: 'QuietComfort', brands: ['Bose'], priceRange: [179, 379], keywords: ['headphones', 'noise-canceling', 'bose'] },
        
        // TVs
        { base: 'OLED TV', brands: ['LG', 'Samsung', 'Sony'], priceRange: [899, 3999], keywords: ['tv', 'oled', '4k'] },
        { base: 'QLED TV', brands: ['Samsung'], priceRange: [699, 2999], keywords: ['tv', 'qled', '4k'] },
        
        // Gaming
        { base: 'PlayStation', brands: ['Sony'], priceRange: [399, 699], keywords: ['gaming', 'console', 'playstation'] },
        { base: 'Xbox', brands: ['Microsoft'], priceRange: [299, 599], keywords: ['gaming', 'console', 'xbox'] },
        { base: 'Nintendo Switch', brands: ['Nintendo'], priceRange: [199, 349], keywords: ['gaming', 'portable', 'nintendo'] },
        
        // Tablets
        { base: 'iPad', brands: ['Apple'], priceRange: [329, 1599], keywords: ['tablet', 'ipad', 'apple'] },
        { base: 'Galaxy Tab', brands: ['Samsung'], priceRange: [229, 899], keywords: ['tablet', 'android', 'samsung'] },
        
        // Smart Home
        { base: 'Echo', brands: ['Amazon'], priceRange: [29, 249], keywords: ['smart-speaker', 'alexa', 'amazon'] },
        { base: 'HomePod', brands: ['Apple'], priceRange: [99, 299], keywords: ['smart-speaker', 'siri', 'apple'] },
        { base: 'Nest', brands: ['Google'], priceRange: [49, 229], keywords: ['smart-home', 'google', 'nest'] }
      ],
      
      Clothing: [
        // Men's
        { base: 'Jeans', brands: ['Levi\'s', 'Wrangler', 'Lee', 'Calvin Klein'], priceRange: [39, 199], keywords: ['jeans', 'denim', 'mens'] },
        { base: 'T-Shirt', brands: ['Nike', 'Adidas', 'Champion', 'Hanes'], priceRange: [15, 89], keywords: ['t-shirt', 'casual', 'mens'] },
        { base: 'Hoodie', brands: ['Nike', 'Adidas', 'Champion', 'Supreme'], priceRange: [45, 299], keywords: ['hoodie', 'streetwear', 'mens'] },
        { base: 'Sneakers', brands: ['Nike', 'Adidas', 'Converse', 'Vans'], priceRange: [59, 299], keywords: ['sneakers', 'shoes', 'athletic'] },
        { base: 'Dress Shirt', brands: ['Brooks Brothers', 'Ralph Lauren', 'Calvin Klein'], priceRange: [49, 199], keywords: ['dress-shirt', 'formal', 'mens'] },
        
        // Women's
        { base: 'Dress', brands: ['Zara', 'H&M', 'Reformation', 'Everlane'], priceRange: [39, 299], keywords: ['dress', 'womens', 'fashion'] },
        { base: 'Leggings', brands: ['Lululemon', 'Athleta', 'Nike', 'Adidas'], priceRange: [29, 128], keywords: ['leggings', 'athletic', 'womens'] },
        { base: 'Blouse', brands: ['Everlane', 'Madewell', 'J.Crew'], priceRange: [45, 149], keywords: ['blouse', 'professional', 'womens'] },
        { base: 'Boots', brands: ['Dr. Martens', 'UGG', 'Timberland'], priceRange: [89, 299], keywords: ['boots', 'shoes', 'womens'] },
        
        // Accessories
        { base: 'Watch', brands: ['Apple', 'Rolex', 'Casio', 'Timex'], priceRange: [29, 999], keywords: ['watch', 'accessories', 'timepiece'] },
        { base: 'Sunglasses', brands: ['Ray-Ban', 'Oakley', 'Persol'], priceRange: [89, 399], keywords: ['sunglasses', 'accessories', 'eyewear'] },
        { base: 'Backpack', brands: ['Herschel', 'JanSport', 'Patagonia'], priceRange: [39, 199], keywords: ['backpack', 'bag', 'accessories'] }
      ],
      
      'Home & Garden': [
        { base: 'Vacuum Cleaner', brands: ['Dyson', 'Shark', 'Bissell'], priceRange: [99, 799], keywords: ['vacuum', 'cleaning', 'home'] },
        { base: 'Coffee Maker', brands: ['Keurig', 'Nespresso', 'Breville'], priceRange: [49, 599], keywords: ['coffee', 'kitchen', 'appliance'] },
        { base: 'Air Fryer', brands: ['Ninja', 'Cosori', 'Philips'], priceRange: [59, 299], keywords: ['air-fryer', 'kitchen', 'cooking'] },
        { base: 'Blender', brands: ['Vitamix', 'Ninja', 'Blendtec'], priceRange: [39, 599], keywords: ['blender', 'kitchen', 'smoothie'] },
        { base: 'Smart Thermostat', brands: ['Nest', 'Ecobee', 'Honeywell'], priceRange: [99, 299], keywords: ['thermostat', 'smart-home', 'hvac'] },
        { base: 'Robot Vacuum', brands: ['Roomba', 'Shark', 'Eufy'], priceRange: [199, 999], keywords: ['robot-vacuum', 'cleaning', 'smart'] },
        { base: 'Stand Mixer', brands: ['KitchenAid', 'Cuisinart', 'Hamilton Beach'], priceRange: [89, 599], keywords: ['mixer', 'baking', 'kitchen'] },
        { base: 'Pressure Cooker', brands: ['Instant Pot', 'Ninja', 'Cuisinart'], priceRange: [59, 199], keywords: ['pressure-cooker', 'cooking', 'kitchen'] }
      ],
      
      Sports: [
        { base: 'Yoga Mat', brands: ['Manduka', 'Gaiam', 'Liforme'], priceRange: [19, 149], keywords: ['yoga', 'fitness', 'mat'] },
        { base: 'Dumbbells', brands: ['Bowflex', 'PowerBlock', 'CAP'], priceRange: [29, 599], keywords: ['dumbbells', 'weights', 'fitness'] },
        { base: 'Treadmill', brands: ['NordicTrack', 'Peloton', 'ProForm'], priceRange: [399, 2999], keywords: ['treadmill', 'cardio', 'fitness'] },
        { base: 'Water Bottle', brands: ['Hydro Flask', 'YETI', 'Nalgene'], priceRange: [15, 59], keywords: ['water-bottle', 'hydration', 'sports'] },
        { base: 'Protein Powder', brands: ['Optimum Nutrition', 'Dymatize', 'BSN'], priceRange: [29, 89], keywords: ['protein', 'supplement', 'fitness'] },
        { base: 'Running Shoes', brands: ['Nike', 'Adidas', 'Brooks', 'ASICS'], priceRange: [79, 299], keywords: ['running', 'shoes', 'athletic'] },
        { base: 'Exercise Bike', brands: ['Peloton', 'NordicTrack', 'Schwinn'], priceRange: [299, 2499], keywords: ['exercise-bike', 'cardio', 'fitness'] }
      ],
      
      Books: [
        { base: 'Self-Help Book', brands: ['Penguin', 'HarperCollins', 'Simon & Schuster'], priceRange: [12, 29], keywords: ['self-help', 'personal-development', 'book'] },
        { base: 'Fiction Novel', brands: ['Penguin', 'Random House', 'Macmillan'], priceRange: [10, 25], keywords: ['fiction', 'novel', 'book'] },
        { base: 'Cookbook', brands: ['Ten Speed Press', 'Clarkson Potter', 'Chronicle'], priceRange: [15, 45], keywords: ['cookbook', 'cooking', 'recipes'] },
        { base: 'Business Book', brands: ['Harvard Business Review', 'Portfolio', 'Currency'], priceRange: [14, 35], keywords: ['business', 'entrepreneurship', 'book'] }
      ],
      
      Beauty: [
        { base: 'Foundation', brands: ['Fenty Beauty', 'MAC', 'NARS', 'Charlotte Tilbury'], priceRange: [25, 65], keywords: ['foundation', 'makeup', 'cosmetics'] },
        { base: 'Moisturizer', brands: ['CeraVe', 'Neutrogena', 'Olay', 'The Ordinary'], priceRange: [8, 89], keywords: ['moisturizer', 'skincare', 'beauty'] },
        { base: 'Lipstick', brands: ['MAC', 'NARS', 'Tom Ford', 'Dior'], priceRange: [18, 89], keywords: ['lipstick', 'makeup', 'cosmetics'] },
        { base: 'Serum', brands: ['The Ordinary', 'Paula\'s Choice', 'Drunk Elephant'], priceRange: [12, 149], keywords: ['serum', 'skincare', 'treatment'] }
      ],
      
      Automotive: [
        { base: 'Car Phone Mount', brands: ['iOttie', 'Belkin', 'Anker'], priceRange: [15, 59], keywords: ['phone-mount', 'car', 'accessories'] },
        { base: 'Dash Cam', brands: ['Garmin', 'Nextbase', 'VIOFO'], priceRange: [59, 299], keywords: ['dash-cam', 'car', 'safety'] },
        { base: 'Car Charger', brands: ['Anker', 'Belkin', 'RAVPower'], priceRange: [12, 39], keywords: ['car-charger', 'charging', 'accessories'] },
        { base: 'Tire Pressure Monitor', brands: ['TPMS', 'Steelmate', 'EEZTire'], priceRange: [29, 149], keywords: ['tire-pressure', 'safety', 'monitoring'] }
      ],
      
      Toys: [
        { base: 'LEGO Set', brands: ['LEGO'], priceRange: [19, 799], keywords: ['lego', 'building', 'toys'] },
        { base: 'Action Figure', brands: ['Hasbro', 'Mattel', 'Funko'], priceRange: [9, 199], keywords: ['action-figure', 'collectible', 'toys'] },
        { base: 'Board Game', brands: ['Hasbro', 'Mattel', 'Ravensburger'], priceRange: [15, 89], keywords: ['board-game', 'family', 'toys'] },
        { base: 'Puzzle', brands: ['Ravensburger', 'Buffalo Games', 'Cobble Hill'], priceRange: [8, 49], keywords: ['puzzle', 'brain-teaser', 'toys'] }
      ]
    };

    // Generate products for each category
    const allProducts = [];
    let productId = 1;

    for (const [category, templates] of Object.entries(productTemplates)) {
      const targetCount = category === 'Electronics' ? 120 : 
                         category === 'Clothing' ? 100 :
                         category === 'Home & Garden' ? 80 :
                         category === 'Sports' ? 60 :
                         category === 'Books' ? 30 :
                         category === 'Beauty' ? 25 :
                         category === 'Automotive' ? 15 : 10;

      console.log(`📦 Generating ${targetCount} ${category} products...`);

      for (let i = 0; i < targetCount; i++) {
        const template = templates[i % templates.length];
        const brand = template.brands[Math.floor(Math.random() * template.brands.length)];
        const basePrice = Math.random() * (template.priceRange[1] - template.priceRange[0]) + template.priceRange[0];
        const price = Math.round(basePrice * 100) / 100;
        const discountPrice = getRandomDiscount(price);

        const variations = [
          '', ' Pro', ' Max', ' Plus', ' Mini', ' Lite', ' Premium', ' Deluxe', ' Standard', ' Classic',
          ' 2024', ' 2023', ' Gen 2', ' V2', ' Advanced', ' Ultimate', ' Essential', ' Sport', ' Elite'
        ];
        
        const colors = ['Black', 'White', 'Blue', 'Red', 'Gray', 'Silver', 'Gold', 'Rose Gold', 'Green', 'Purple'];
        const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '32GB', '64GB', '128GB', '256GB', '512GB'];

        const variation = variations[Math.floor(Math.random() * variations.length)];
        const productName = `${brand} ${template.base}${variation}`;

        allProducts.push({
          name: productName,
          description: `Premium ${template.base.toLowerCase()} from ${brand}. High-quality construction with modern features and reliable performance.`,
          price: price,
          discountPrice: discountPrice,
          images: [{ 
            url: `https://images.unsplash.com/photo-${1500000000000 + productId}?w=400`, 
            alt: productName, 
            isMain: true 
          }],
          category: category,
          brand: brand,
          stock: getRandomStock(),
          tags: [...template.keywords, brand.toLowerCase().replace(/\s+/g, '-')],
          features: [
            'Premium quality construction',
            'Modern design and features',
            'Reliable performance',
            'Excellent value for money'
          ],
          isFeatured: Math.random() > 0.85,
          rating: parseFloat(getRandomRating()),
          numReviews: getRandomReviews(),
          seller: getRandomSeller()._id
        });

        productId++;
      }
    }

    console.log(`🚀 Creating ${allProducts.length} products in database...`);

    // Batch insert products
    const batchSize = 50;
    for (let i = 0; i < allProducts.length; i += batchSize) {
      const batch = allProducts.slice(i, i + batchSize);
      await Product.insertMany(batch);
      console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allProducts.length/batchSize)}`);
    }

    // Update category product counts
    console.log('📊 Updating category product counts...');
    const categories = await Category.find();
    for (const category of categories) {
      await Category.updateProductCount(category._id);
    }

    // Final statistics
    const totalProducts = await Product.countDocuments();
    const productsByCategory = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n🎉 NOMOTIX PRODUCT CATALOG COMPLETE!');
    console.log(`📦 Total Products: ${totalProducts}`);
    console.log('\n📊 Products by Category:');
    productsByCategory.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} products`);
    });

    console.log('\n✅ 400+ diverse products successfully added to Nomotix!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error generating products:', error);
    process.exit(1);
  }
};

generate400Products();
