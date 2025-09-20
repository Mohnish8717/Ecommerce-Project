const express = require('express');
const router = express.Router();
const { protect, seller } = require('../middleware/auth');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// @desc    Get seller dashboard stats
// @route   GET /api/seller/stats
// @access  Private (Seller only)
router.get('/stats', protect, seller, async (req, res) => {
  try {
    const { timeRange = 30 } = req.query;
    const sellerId = req.user._id;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - parseInt(timeRange));

    // Get seller's products
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Get orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds },
      createdAt: { $gte: startDate, $lte: endDate }
    }).populate('items.product');

    // Calculate stats
    let totalRevenue = 0;
    let totalOrders = 0;

    orders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );
      
      if (sellerItems.length > 0) {
        totalOrders++;
        totalRevenue += sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    });

    // Calculate average rating
    const averageRating = products.length > 0 
      ? products.reduce((sum, product) => sum + (product.rating || 0), 0) / products.length
      : 0;

    // Calculate previous period for comparison
    const prevStartDate = new Date(startDate);
    prevStartDate.setDate(prevStartDate.getDate() - parseInt(timeRange));
    
    const prevOrders = await Order.find({
      'items.product': { $in: productIds },
      createdAt: { $gte: prevStartDate, $lt: startDate }
    }).populate('items.product');

    let prevRevenue = 0;
    let prevOrderCount = 0;

    prevOrders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );
      
      if (sellerItems.length > 0) {
        prevOrderCount++;
        prevRevenue += sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    });

    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersChange = prevOrderCount > 0 ? ((totalOrders - prevOrderCount) / prevOrderCount) * 100 : 0;

    res.json({
      totalRevenue,
      totalOrders,
      totalProducts: products.length,
      averageRating,
      revenueChange,
      ordersChange
    });
  } catch (error) {
    console.error('Error fetching seller stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get seller's products
// @route   GET /api/seller/products
// @access  Private (Seller only)
router.get('/products', protect, seller, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(products);
  } catch (error) {
    console.error('Error fetching seller products:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get seller's orders
// @route   GET /api/seller/orders
// @access  Private (Seller only)
router.get('/orders', protect, seller, async (req, res) => {
  try {
    const sellerId = req.user._id;
    
    // Get seller's products
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Get orders containing seller's products
    const orders = await Order.find({
      'items.product': { $in: productIds }
    })
    .populate('user', 'name email')
    .populate('items.product')
    .sort({ createdAt: -1 });

    // Filter orders to only include seller's items
    const sellerOrders = orders.map(order => {
      const sellerItems = order.items.filter(item => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );
      
      return {
        ...order.toObject(),
        items: sellerItems,
        totalAmount: sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      };
    }).filter(order => order.items.length > 0);

    res.json(sellerOrders);
  } catch (error) {
    console.error('Error fetching seller orders:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Get seller analytics
// @route   GET /api/seller/analytics
// @access  Private (Seller only)
router.get('/analytics', protect, seller, async (req, res) => {
  try {
    const { timeRange = 30 } = req.query;
    const sellerId = req.user._id;

    // Get seller's products
    const products = await Product.find({ seller: sellerId });
    const productIds = products.map(p => p._id);

    // Calculate date ranges
    const endDate = new Date();
    const currentStartDate = new Date();
    currentStartDate.setDate(endDate.getDate() - parseInt(timeRange));
    
    const prevEndDate = new Date(currentStartDate);
    const prevStartDate = new Date(prevEndDate);
    prevStartDate.setDate(prevEndDate.getDate() - parseInt(timeRange));

    // Get current period orders
    const currentOrders = await Order.find({
      'items.product': { $in: productIds },
      createdAt: { $gte: currentStartDate, $lte: endDate }
    }).populate('items.product user');

    // Get previous period orders
    const prevOrders = await Order.find({
      'items.product': { $in: productIds },
      createdAt: { $gte: prevStartDate, $lt: prevEndDate }
    }).populate('items.product user');

    // Calculate current period stats
    let currentRevenue = 0;
    let currentOrderCount = 0;
    const recentSales = [];

    currentOrders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );
      
      if (sellerItems.length > 0) {
        currentOrderCount++;
        const orderRevenue = sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        currentRevenue += orderRevenue;
        
        if (recentSales.length < 5) {
          recentSales.push({
            id: order._id,
            customer: order.user?.name || 'Anonymous',
            amount: orderRevenue,
            date: order.createdAt,
            status: order.status
          });
        }
      }
    });

    // Calculate previous period stats
    let prevRevenue = 0;
    let prevOrderCount = 0;

    prevOrders.forEach(order => {
      const sellerItems = order.items.filter(item => 
        productIds.some(id => id.toString() === item.product._id.toString())
      );
      
      if (sellerItems.length > 0) {
        prevOrderCount++;
        prevRevenue += sellerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      }
    });

    // Calculate changes
    const revenueChange = prevRevenue > 0 ? ((currentRevenue - prevRevenue) / prevRevenue) * 100 : 0;
    const ordersChange = prevOrderCount > 0 ? ((currentOrderCount - prevOrderCount) / prevOrderCount) * 100 : 0;

    // Get top products (mock data for now)
    const topProducts = products
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 5)
      .map(product => ({
        ...product.toObject(),
        sales: Math.floor(Math.random() * 100) + 10,
        revenue: product.price * (Math.floor(Math.random() * 100) + 10)
      }));

    // Calculate customer stats
    const uniqueCustomers = new Set(currentOrders.map(order => order.user?._id?.toString())).size;
    const returningCustomers = Math.floor(uniqueCustomers * 0.3); // Mock calculation

    res.json({
      revenue: {
        current: currentRevenue,
        previous: prevRevenue,
        change: revenueChange
      },
      orders: {
        current: currentOrderCount,
        previous: prevOrderCount,
        change: ordersChange
      },
      topProducts,
      recentSales,
      customerStats: {
        totalCustomers: uniqueCustomers,
        returningCustomers
      }
    });
  } catch (error) {
    console.error('Error fetching seller analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @desc    Update seller profile
// @route   PUT /api/seller/profile
// @access  Private (Seller only)
router.put('/profile', protect, seller, async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      businessInfo,
      bankInfo
    } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user fields
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (businessInfo) user.businessInfo = businessInfo;
    if (bankInfo) user.bankInfo = bankInfo;

    await user.save();

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      businessInfo: user.businessInfo,
      bankInfo: user.bankInfo
    });
  } catch (error) {
    console.error('Error updating seller profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
