const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Load environment variables
dotenv.config();

const addReviewsAndOrders = async () => {
  try {
    console.log('🌱 Adding realistic reviews and orders...');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB Atlas');

    // Get users and products
    const buyers = await User.find({ role: 'buyer' });
    const products = await Product.find().populate('seller', 'name');

    if (buyers.length === 0 || products.length === 0) {
      console.log('❌ No buyers or products found. Please run the seed scripts first.');
      return;
    }

    console.log(`Found ${buyers.length} buyers and ${products.length} products`);

    // Sample review comments
    const reviewComments = [
      "Excellent product! Exceeded my expectations.",
      "Great quality and fast shipping. Highly recommend!",
      "Good value for money. Works as described.",
      "Amazing product! Will definitely buy again.",
      "Perfect! Exactly what I was looking for.",
      "Outstanding quality and customer service.",
      "Love this product! Great design and functionality.",
      "Fantastic purchase. Very satisfied with the quality.",
      "Impressive product with great attention to detail.",
      "Superb quality and excellent packaging.",
      "Really happy with this purchase. Great product!",
      "Excellent build quality and fast delivery.",
      "Perfect product for the price. Highly recommended!",
      "Amazing quality and great customer support.",
      "Love the design and functionality. Perfect!",
      "Great product! Works exactly as advertised.",
      "Excellent value and outstanding quality.",
      "Perfect addition to my collection. Love it!",
      "Great quality product with fast shipping.",
      "Absolutely love this! Exceeded expectations."
    ];

    // Add reviews to products
    console.log('📝 Adding reviews to products...');
    let reviewsAdded = 0;

    for (const product of products) {
      // Add 2-8 random reviews per product
      const numReviews = Math.floor(Math.random() * 7) + 2;
      
      for (let i = 0; i < numReviews; i++) {
        const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
        const randomRating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars mostly
        const randomComment = reviewComments[Math.floor(Math.random() * reviewComments.length)];
        
        // Check if this buyer already reviewed this product
        const existingReview = product.reviews.find(
          review => review.user.toString() === randomBuyer._id.toString()
        );
        
        if (!existingReview) {
          product.addReview({
            user: randomBuyer._id,
            name: randomBuyer.name,
            rating: randomRating,
            comment: randomComment,
            isVerifiedPurchase: Math.random() > 0.3 // 70% verified purchases
          });
          reviewsAdded++;
        }
      }
      
      await product.save();
    }

    console.log(`✅ Added ${reviewsAdded} reviews`);

    // Create sample orders
    console.log('📋 Creating sample orders...');
    
    // Clear existing orders
    await Order.deleteMany({});

    const orderStatuses = ['delivered', 'shipped', 'processing', 'delivered', 'delivered'];
    const paymentMethods = ['stripe', 'paypal', 'stripe', 'stripe'];
    
    const sampleAddresses = [
      {
        fullName: 'John Smith',
        address: '123 Main Street',
        city: 'New York',
        postalCode: '10001',
        country: 'USA',
        phone: '+1-555-0123'
      },
      {
        fullName: 'Sarah Johnson',
        address: '456 Oak Avenue',
        city: 'Los Angeles',
        postalCode: '90210',
        country: 'USA',
        phone: '+1-555-0124'
      },
      {
        fullName: 'Mike Wilson',
        address: '789 Pine Street',
        city: 'Chicago',
        postalCode: '60601',
        country: 'USA',
        phone: '+1-555-0125'
      }
    ];

    let ordersCreated = 0;

    // Create 15-20 sample orders
    for (let i = 0; i < 18; i++) {
      const randomBuyer = buyers[Math.floor(Math.random() * buyers.length)];
      const randomAddress = sampleAddresses[Math.floor(Math.random() * sampleAddresses.length)];
      const randomStatus = orderStatuses[Math.floor(Math.random() * orderStatuses.length)];
      const randomPaymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
      
      // Select 1-3 random products for this order
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let itemsPrice = 0;
      
      for (let j = 0; j < numItems; j++) {
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const quantity = Math.floor(Math.random() * 2) + 1; // 1-2 items
        const price = randomProduct.discountPrice || randomProduct.price;
        
        orderItems.push({
          product: randomProduct._id,
          name: randomProduct.name,
          image: randomProduct.images[0]?.url || randomProduct.images[0] || '/placeholder-product.jpg',
          price: price,
          quantity: quantity,
          seller: randomProduct.seller._id
        });
        
        itemsPrice += price * quantity;
      }
      
      const taxPrice = itemsPrice * 0.08; // 8% tax
      const shippingPrice = itemsPrice > 50 ? 0 : 9.99; // Free shipping over $50
      const totalPrice = itemsPrice + taxPrice + shippingPrice;
      
      const orderData = {
        user: randomBuyer._id,
        orderItems,
        shippingAddress: {
          ...randomAddress,
          fullName: randomBuyer.name
        },
        paymentMethod: randomPaymentMethod,
        itemsPrice: Math.round(itemsPrice * 100) / 100,
        taxPrice: Math.round(taxPrice * 100) / 100,
        shippingPrice: Math.round(shippingPrice * 100) / 100,
        totalPrice: Math.round(totalPrice * 100) / 100,
        isPaid: true,
        paidAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        status: randomStatus
      };
      
      if (randomStatus === 'delivered') {
        orderData.isDelivered = true;
        orderData.deliveredAt = new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000); // Random date within last 20 days
      } else if (randomStatus === 'shipped') {
        orderData.trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      }
      
      await Order.create(orderData);
      ordersCreated++;
    }

    console.log(`✅ Created ${ordersCreated} sample orders`);

    // Update product sales counts
    console.log('📊 Updating product sales counts...');
    const orders = await Order.find({ isPaid: true });
    
    for (const order of orders) {
      for (const item of order.orderItems) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { salesCount: item.quantity }
        });
      }
    }

    // Final statistics
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);

    console.log('\n📊 FINAL DATABASE STATISTICS:');
    console.log(`👥 Total Users: ${totalUsers}`);
    console.log(`📦 Total Products: ${totalProducts}`);
    console.log(`📋 Total Orders: ${totalOrders}`);
    console.log(`💰 Total Revenue: $${totalRevenue[0]?.total?.toFixed(2) || '0.00'}`);
    console.log(`⭐ Total Reviews: ${reviewsAdded}`);

    // Product statistics by category
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          avgRating: { $avg: '$rating' },
          totalSales: { $sum: '$salesCount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📈 CATEGORY STATISTICS:');
    productStats.forEach(stat => {
      console.log(`${stat._id}:`);
      console.log(`  Products: ${stat.count}`);
      console.log(`  Avg Price: $${stat.avgPrice?.toFixed(2) || '0.00'}`);
      console.log(`  Avg Rating: ${stat.avgRating?.toFixed(1) || '0.0'}/5`);
      console.log(`  Total Sales: ${stat.totalSales || 0} units`);
    });

    console.log('\n✅ Comprehensive e-commerce data setup completed!');
    console.log('🎉 Your Amazon-style application is now fully populated with realistic data!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding reviews and orders:', error);
    process.exit(1);
  }
};

addReviewsAndOrders();
