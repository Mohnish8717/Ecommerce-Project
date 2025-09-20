const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Category = require('../models/Category');

// Load environment variables
dotenv.config();

const viewData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB Atlas\n');

    // Get all users
    const users = await User.find().select('-password').lean();
    console.log('👥 USERS IN DATABASE:');
    console.log('='.repeat(50));
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
      if (user.phone) console.log(`   Phone: ${user.phone}`);
      if (user.address?.city) console.log(`   Location: ${user.address.city}, ${user.address.state}`);
      console.log(`   Created: ${new Date(user.createdAt).toLocaleDateString()}`);
      console.log('');
    });

    // Get all categories
    const categories = await Category.find().lean();
    console.log('\n📂 CATEGORIES:');
    console.log('='.repeat(50));
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name} (${category.productCount} products)`);
      console.log(`   Description: ${category.description}`);
      console.log('');
    });

    // Get all products
    const products = await Product.find().populate('seller', 'name').lean();
    console.log('\n📦 PRODUCTS:');
    console.log('='.repeat(50));
    products.forEach((product, index) => {
      console.log(`${index + 1}. ${product.name}`);
      console.log(`   Price: $${product.price}${product.discountPrice ? ` (Sale: $${product.discountPrice})` : ''}`);
      console.log(`   Category: ${product.category}`);
      console.log(`   Brand: ${product.brand}`);
      console.log(`   Stock: ${product.stock}`);
      console.log(`   Rating: ${product.rating}/5 (${product.numReviews} reviews)`);
      console.log(`   Seller: ${product.seller?.name || 'Unknown'}`);
      console.log(`   Featured: ${product.isFeatured ? 'Yes' : 'No'}`);
      console.log('');
    });

    // Get all orders
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('orderItems.product', 'name')
      .lean();
    
    console.log('\n📋 ORDERS:');
    console.log('='.repeat(50));
    if (orders.length === 0) {
      console.log('No orders found.');
    } else {
      orders.forEach((order, index) => {
        console.log(`${index + 1}. Order ${order.orderNumber || order._id.toString().slice(-8)}`);
        console.log(`   Customer: ${order.user?.name} (${order.user?.email})`);
        console.log(`   Status: ${order.status.toUpperCase()}`);
        console.log(`   Total: $${order.totalPrice}`);
        console.log(`   Items: ${order.orderItems.length}`);
        console.log(`   Payment: ${order.paymentMethod} ${order.isPaid ? '✅ Paid' : '❌ Unpaid'}`);
        console.log(`   Delivery: ${order.isDelivered ? '✅ Delivered' : '📦 Pending'}`);
        console.log(`   Created: ${new Date(order.createdAt).toLocaleDateString()}`);
        if (order.trackingNumber) {
          console.log(`   Tracking: ${order.trackingNumber}`);
        }
        console.log('   Items:');
        order.orderItems.forEach(item => {
          console.log(`     - ${item.name} x${item.quantity} ($${item.price})`);
        });
        console.log('');
      });
    }

    // Database statistics
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('='.repeat(50));
    console.log(`Total Users: ${users.length}`);
    console.log(`  - Buyers: ${users.filter(u => u.role === 'buyer').length}`);
    console.log(`  - Sellers: ${users.filter(u => u.role === 'seller').length}`);
    console.log(`  - Admins: ${users.filter(u => u.role === 'admin').length}`);
    console.log(`Total Categories: ${categories.length}`);
    console.log(`Total Products: ${products.length}`);
    console.log(`  - Featured Products: ${products.filter(p => p.isFeatured).length}`);
    console.log(`  - Products on Sale: ${products.filter(p => p.discountPrice).length}`);
    console.log(`Total Orders: ${orders.length}`);
    console.log(`  - Completed Orders: ${orders.filter(o => o.status === 'delivered').length}`);
    console.log(`  - Pending Orders: ${orders.filter(o => ['pending', 'processing', 'shipped'].includes(o.status)).length}`);

    // Revenue statistics
    const totalRevenue = orders
      .filter(o => o.isPaid)
      .reduce((sum, order) => sum + order.totalPrice, 0);
    console.log(`Total Revenue: $${totalRevenue.toFixed(2)}`);

    // Product categories breakdown
    console.log('\n📈 PRODUCTS BY CATEGORY:');
    console.log('='.repeat(50));
    const categoryStats = {};
    products.forEach(product => {
      categoryStats[product.category] = (categoryStats[product.category] || 0) + 1;
    });
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`${category}: ${count} products`);
    });

    console.log('\n✅ Data overview complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error viewing data:', error);
    process.exit(1);
  }
};

viewData();
