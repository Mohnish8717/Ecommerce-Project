// Currency formatting utilities for Indian Rupees

/**
 * Format price in Indian Rupees
 * @param {number} price - The price to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, showSymbol = true) => {
  if (price === null || price === undefined || isNaN(price)) {
    return showSymbol ? '₹0' : '0'
  }

  const numPrice = parseFloat(price)
  
  // Format with Indian number system (lakhs, crores)
  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(numPrice)

  if (!showSymbol) {
    return formatted.replace('₹', '').trim()
  }

  return formatted
}

/**
 * Format price range
 * @param {number} minPrice - Minimum price
 * @param {number} maxPrice - Maximum price
 * @returns {string} Formatted price range
 */
export const formatPriceRange = (minPrice, maxPrice) => {
  if (!minPrice && !maxPrice) return ''
  if (!minPrice) return `Up to ${formatPrice(maxPrice)}`
  if (!maxPrice) return `From ${formatPrice(minPrice)}`
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`
}

/**
 * Parse price string to number
 * @param {string} priceString - Price string to parse
 * @returns {number} Parsed price
 */
export const parsePrice = (priceString) => {
  if (!priceString) return 0
  return parseFloat(priceString.toString().replace(/[₹,\s]/g, '')) || 0
}

/**
 * Calculate discount percentage
 * @param {number} originalPrice - Original price
 * @param {number} discountPrice - Discounted price
 * @returns {number} Discount percentage
 */
export const calculateDiscountPercentage = (originalPrice, discountPrice) => {
  if (!originalPrice || !discountPrice || discountPrice >= originalPrice) return 0
  return Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
}

/**
 * Format discount display
 * @param {number} originalPrice - Original price
 * @param {number} discountPrice - Discounted price
 * @returns {object} Formatted discount info
 */
export const formatDiscount = (originalPrice, discountPrice) => {
  const percentage = calculateDiscountPercentage(originalPrice, discountPrice)
  const savings = originalPrice - discountPrice
  
  return {
    percentage,
    savings: formatPrice(savings),
    hasDiscount: percentage > 0
  }
}

export default {
  formatPrice,
  formatPriceRange,
  parsePrice,
  calculateDiscountPercentage,
  formatDiscount
}
