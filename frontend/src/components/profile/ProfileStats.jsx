import { motion } from 'framer-motion'
import { FiShoppingBag, FiDollarSign, FiCreditCard, FiTrendingUp, FiAward, FiHeart } from 'react-icons/fi'

const ProfileStats = ({ stats }) => {
  const statCards = [
    {
      id: 'orders',
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'blue',
      description: 'Orders placed'
    },
    {
      id: 'spent',
      title: 'Total Spent',
      value: `$${(stats.totalSpent || 0).toFixed(2)}`,
      icon: FiDollarSign,
      color: 'green',
      description: 'Lifetime spending'
    },
    {
      id: 'saved',
      title: 'Money Saved',
      value: `$${(stats.totalSaved || 0).toFixed(2)}`,
      icon: FiTrendingUp,
      color: 'purple',
      description: 'From discounts'
    },
    {
      id: 'payments',
      title: 'Payment Methods',
      value: stats.savedPaymentMethods || 0,
      icon: FiCreditCard,
      color: 'orange',
      description: 'Saved methods'
    },
    {
      id: 'loyalty',
      title: 'Loyalty Points',
      value: stats.loyaltyPoints || 0,
      icon: FiAward,
      color: 'yellow',
      description: 'Reward points'
    },
    {
      id: 'wishlist',
      title: 'Wishlist Items',
      value: stats.wishlistItems || 0,
      icon: FiHeart,
      color: 'red',
      description: 'Saved items'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        icon: 'text-blue-600',
        text: 'text-blue-900'
      },
      green: {
        bg: 'bg-green-50',
        icon: 'text-green-600',
        text: 'text-green-900'
      },
      purple: {
        bg: 'bg-purple-50',
        icon: 'text-purple-600',
        text: 'text-purple-900'
      },
      orange: {
        bg: 'bg-orange-50',
        icon: 'text-orange-600',
        text: 'text-orange-900'
      },
      yellow: {
        bg: 'bg-yellow-50',
        icon: 'text-yellow-600',
        text: 'text-yellow-900'
      },
      red: {
        bg: 'bg-red-50',
        icon: 'text-red-600',
        text: 'text-red-900'
      }
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon
        const colorClasses = getColorClasses(stat.color)
        
        return (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className={`w-10 h-10 rounded-lg ${colorClasses.bg} flex items-center justify-center mr-3`}>
                    <IconComponent className={`w-5 h-5 ${colorClasses.icon}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-600">{stat.title}</h3>
                    <p className="text-xs text-gray-500">{stat.description}</p>
                  </div>
                </div>
                
                <div className="mt-3">
                  <p className={`text-2xl font-bold ${colorClasses.text}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Progress indicator for some stats */}
            {stat.id === 'orders' && stats.totalOrders > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>This month</span>
                  <span>{stats.monthlyOrders || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min((stats.monthlyOrders || 0) / Math.max(stats.totalOrders, 1) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
            
            {stat.id === 'loyalty' && stats.loyaltyPoints > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Next reward</span>
                  <span>{1000 - (stats.loyaltyPoints % 1000)} pts</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-yellow-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(stats.loyaltyPoints % 1000) / 10}%` 
                    }}
                  ></div>
                </div>
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProfileStats
