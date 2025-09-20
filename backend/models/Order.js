const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  postalCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  }
});

const paymentResultSchema = new mongoose.Schema({
  id: String,
  status: String,
  update_time: String,
  email_address: String
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    type: shippingAddressSchema,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'razorpay', 'cash_on_delivery']
  },
  paymentResult: paymentResultSchema,
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
    min: 0
  },
  discountAmount: {
    type: Number,
    default: 0.0,
    min: 0
  },
  couponCode: {
    type: String,
    trim: true
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'refunded'
    ],
    default: 'pending'
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  estimatedDelivery: {
    type: Date
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  cancelReason: {
    type: String,
    maxlength: [200, 'Cancel reason cannot exceed 200 characters']
  },
  refundAmount: {
    type: Number,
    min: 0
  },
  refundReason: {
    type: String,
    maxlength: [200, 'Refund reason cannot exceed 200 characters']
  },
  statusHistory: [{
    status: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    note: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'orderItems.seller': 1 });
orderSchema.index({ trackingNumber: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ isDelivered: 1 });

// Virtual for order number
orderSchema.virtual('orderNumber').get(function() {
  return `ORD-${this._id.toString().slice(-8).toUpperCase()}`;
});

// Pre-save middleware to add status to history
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date()
    });
  }
  next();
});

// Pre-save middleware to set paidAt when isPaid changes to true
orderSchema.pre('save', function(next) {
  if (this.isModified('isPaid') && this.isPaid && !this.paidAt) {
    this.paidAt = new Date();
  }
  next();
});

// Pre-save middleware to set deliveredAt when isDelivered changes to true
orderSchema.pre('save', function(next) {
  if (this.isModified('isDelivered') && this.isDelivered && !this.deliveredAt) {
    this.deliveredAt = new Date();
    this.status = 'delivered';
  }
  next();
});

// Method to calculate total items
orderSchema.methods.getTotalItems = function() {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
};

// Method to get unique sellers
orderSchema.methods.getUniqueSellers = function() {
  const sellers = this.orderItems.map(item => item.seller.toString());
  return [...new Set(sellers)];
};

// Method to update status with history
orderSchema.methods.updateStatus = function(newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy
  });
};

// Method to cancel order
orderSchema.methods.cancelOrder = function(reason, cancelledBy = null) {
  if (['delivered', 'cancelled', 'refunded'].includes(this.status)) {
    throw new Error('Cannot cancel order in current status');
  }
  
  this.status = 'cancelled';
  this.cancelReason = reason;
  this.statusHistory.push({
    status: 'cancelled',
    timestamp: new Date(),
    note: `Order cancelled: ${reason}`,
    updatedBy: cancelledBy
  });
};

// Method to process refund
orderSchema.methods.processRefund = function(amount, reason, processedBy = null) {
  if (this.status !== 'delivered' && this.status !== 'cancelled') {
    throw new Error('Can only refund delivered or cancelled orders');
  }
  
  this.status = 'refunded';
  this.refundAmount = amount;
  this.refundReason = reason;
  this.statusHistory.push({
    status: 'refunded',
    timestamp: new Date(),
    note: `Refund processed: $${amount} - ${reason}`,
    updatedBy: processedBy
  });
};

// Static method to get orders by seller
orderSchema.statics.getOrdersBySeller = function(sellerId, options = {}) {
  return this.find({
    'orderItems.seller': sellerId
  }, null, options)
    .populate('user', 'name email')
    .populate('orderItems.product', 'name images');
};

// Static method to get sales analytics
orderSchema.statics.getSalesAnalytics = async function(sellerId = null, dateRange = {}) {
  const matchStage = {
    isPaid: true,
    status: { $ne: 'cancelled' }
  };

  if (sellerId) {
    matchStage['orderItems.seller'] = new mongoose.Types.ObjectId(sellerId);
  }

  if (dateRange.start || dateRange.end) {
    matchStage.createdAt = {};
    if (dateRange.start) matchStage.createdAt.$gte = new Date(dateRange.start);
    if (dateRange.end) matchStage.createdAt.$lte = new Date(dateRange.end);
  }

  const pipeline = [
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        averageOrderValue: { $avg: '$totalPrice' },
        totalItems: { $sum: { $sum: '$orderItems.quantity' } }
      }
    }
  ];

  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItems: 0
  };
};

// Transform output
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Order', orderSchema);
