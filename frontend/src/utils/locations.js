// Indian locations and address utilities

/**
 * Indian states and union territories
 */
export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
]

/**
 * Major Indian cities
 */
export const MAJOR_CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Hyderabad',
  'Ahmedabad',
  'Chennai',
  'Kolkata',
  'Surat',
  'Pune',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Faridabad',
  'Meerut',
  'Rajkot',
  'Kalyan-Dombivali',
  'Vasai-Virar',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Navi Mumbai',
  'Allahabad',
  'Ranchi',
  'Howrah',
  'Coimbatore',
  'Jabalpur',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Raipur',
  'Kota',
  'Guwahati',
  'Chandigarh',
  'Solapur',
  'Hubballi-Dharwad',
  'Tiruchirappalli',
  'Bareilly',
  'Mysore',
  'Tiruppur',
  'Gurgaon',
  'Aligarh',
  'Jalandhar',
  'Bhubaneswar',
  'Salem',
  'Mira-Bhayandar',
  'Warangal',
  'Guntur',
  'Bhiwandi',
  'Saharanpur',
  'Gorakhpur',
  'Bikaner',
  'Amravati',
  'Noida',
  'Jamshedpur',
  'Bhilai',
  'Cuttack',
  'Firozabad',
  'Kochi',
  'Nellore',
  'Bhavnagar',
  'Dehradun',
  'Durgapur',
  'Asansol',
  'Rourkela',
  'Nanded',
  'Kolhapur',
  'Ajmer',
  'Akola',
  'Gulbarga',
  'Jamnagar',
  'Ujjain',
  'Loni',
  'Siliguri',
  'Jhansi',
  'Ulhasnagar',
  'Jammu',
  'Sangli-Miraj & Kupwad',
  'Mangalore',
  'Erode',
  'Belgaum',
  'Ambattur',
  'Tirunelveli',
  'Malegaon',
  'Gaya',
  'Jalgaon',
  'Udaipur',
  'Maheshtala'
]

/**
 * Default delivery locations for e-commerce
 */
export const DEFAULT_DELIVERY_LOCATIONS = [
  'Mumbai, Maharashtra',
  'Delhi, Delhi',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Surat, Gujarat'
]

/**
 * Format Indian address
 * @param {object} address - Address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  if (!address) return ''
  
  const parts = []
  
  if (address.line1) parts.push(address.line1)
  if (address.line2) parts.push(address.line2)
  if (address.city) parts.push(address.city)
  if (address.state) parts.push(address.state)
  if (address.pincode) parts.push(address.pincode)
  
  return parts.join(', ')
}

/**
 * Validate Indian PIN code
 * @param {string} pincode - PIN code to validate
 * @returns {boolean} Is valid PIN code
 */
export const validatePincode = (pincode) => {
  if (!pincode) return false
  const pincodeRegex = /^[1-9][0-9]{5}$/
  return pincodeRegex.test(pincode.toString())
}

/**
 * Get delivery estimate for Indian cities
 * @param {string} city - City name
 * @returns {string} Delivery estimate
 */
export const getDeliveryEstimate = (city) => {
  const majorCities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad']
  
  if (majorCities.some(majorCity => city?.toLowerCase().includes(majorCity.toLowerCase()))) {
    return '1-2 days'
  }
  
  return '3-5 days'
}

export default {
  INDIAN_STATES,
  MAJOR_CITIES,
  DEFAULT_DELIVERY_LOCATIONS,
  formatAddress,
  validatePincode,
  getDeliveryEstimate
}
