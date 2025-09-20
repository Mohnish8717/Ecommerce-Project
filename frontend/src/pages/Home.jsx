import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import { getProducts } from '../store/slices/productSlice'
import CSS3DShowcase from '../components/3d/CSS3DShowcase'
import ParticleBackground from '../components/3d/ParticleBackground'

const Home = () => {
  const dispatch = useDispatch()
  const { products, isLoading } = useSelector((state) => state.product)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    // Fetch featured products
    dispatch(getProducts({ limit: 16 }))
  }, [dispatch])

  const heroSlides = [
    {
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop',
      title: 'Fashion Sale',
      subtitle: 'Up to 70% off on trending fashion',
      cta: 'Shop now',
      link: '/products?category=Clothing'
    },
    {
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200&h=400&fit=crop',
      title: 'Electronics Deal',
      subtitle: 'Latest gadgets at unbeatable prices',
      cta: 'Explore deals',
      link: '/products?category=Electronics'
    },
    {
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=400&fit=crop',
      title: 'Home & Garden',
      subtitle: 'Transform your living space',
      cta: 'Shop home',
      link: '/products?category=Home & Garden'
    }
  ]

  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=300&fit=crop',
      link: '/products?category=Electronics'
    },
    {
      name: 'Fashion',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=300&fit=crop',
      link: '/products?category=Clothing'
    },
    {
      name: 'Home & Garden',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
      link: '/products?category=Home & Garden'
    },
    {
      name: 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=300&fit=crop',
      link: '/products?category=Sports'
    }
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* 3D Hero Section */}
      <section className="relative h-screen overflow-hidden gradient-primary">
        {/* 3D Particle Background */}
        <ParticleBackground particleCount={30} />

        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent"></div>
        <div className="relative z-10 flex items-center justify-center h-full" style={{ perspective: '1000px' }}>
          <CSS3DShowcase className="text-center max-w-6xl mx-auto px-4">
            <div style={{ transformStyle: "preserve-3d" }}>
              {/* 3D Text Layers */}
              <div className="relative">
                {/* Background Text Shadow */}
                <h1
                  className="text-6xl md:text-8xl font-bold text-black/10 absolute inset-0"
                  style={{ transform: "translateZ(-20px) translateY(4px) translateX(4px)" }}
                >
                  Welcome to Nomotix
                </h1>

                {/* Main Text */}
                <h1
                  className="text-6xl md:text-8xl font-bold text-white relative z-10 text-3d"
                  style={{ transform: "translateZ(20px)" }}
                >
                  Welcome to{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 holographic">
                    Nomotix
                  </span>
                </h1>
              </div>

              {/* Subtitle */}
              <p
                className="text-xl md:text-2xl text-white/90 mb-12 font-medium"
                style={{ transform: "translateZ(15px)" }}
              >
                Discover amazing products with stunning 3D experiences
              </p>

              {/* 3D Buttons */}
              <div
                className="flex flex-col sm:flex-row gap-6 justify-center"
                style={{ transform: "translateZ(25px)" }}
              >
                <Link to="/products">
                  <button className="btn-3d gradient-accent px-8 py-4 rounded-2xl font-bold text-lg text-white morph-3d">
                    Shop Now
                  </button>
                </Link>

                <Link to="/products?category=Electronics">
                  <button className="btn-3d bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg border border-white/30 morph-3d">
                    Explore Electronics
                  </button>
                </Link>
              </div>

              {/* Floating 3D Elements */}
              <div
                className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-60 floating-3d"
                style={{ transform: "translateZ(40px)" }}
              />

              <div
                className="absolute top-1/3 right-1/4 w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-60 floating-3d"
                style={{ transform: "translateZ(35px)", animationDelay: "1s" }}
              />
            </div>
          </CSS3DShowcase>
        </div>

        {/* Scroll Indicator */}
        <div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 floating-3d"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce" />
          </div>
        </div>
      </section>

      {/* 3D Category Cards */}
      <section className="max-w-screen-2xl mx-auto px-4 py-16 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 text-3d">Shop by Category</h2>
          <p className="text-lg text-gray-600">Explore our wide range of products</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CSS3DShowcase key={index} className="h-full">
              <Link
                to={category.link}
                className="block card-elevated group cursor-pointer overflow-hidden h-full"
                style={{
                  transformStyle: "preserve-3d",
                  animationDelay: `${index * 0.1}s`
                }}
              >
                <div className="aspect-square overflow-hidden rounded-t-2xl relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{ transform: "translateZ(5px)" }}
                  />
                  {/* 3D Floating Elements */}
                  <div
                    className="absolute top-4 right-4 w-4 h-4 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-60 floating-3d neon-glow"
                    style={{ transform: "translateZ(20px)" }}
                  />
                  <div
                    className="absolute bottom-4 left-4 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-40 floating-3d"
                    style={{ transform: "translateZ(25px)", animationDelay: "0.5s" }}
                  />
                </div>
                <div className="p-6" style={{ transform: "translateZ(10px)" }}>
                  <h3 className="text-lg font-bold text-gray-900 text-center group-hover:text-blue-600 transition-colors duration-300 text-3d">
                    {category.name}
                  </h3>
                </div>
              </Link>
            </CSS3DShowcase>
          ))}
        </div>
      </section>

      {/* Today's Deals */}
      <section className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Today's Deals</h2>
            <Link
              to="/products?featured=true"
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              See all deals
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="w-full h-32 bg-gray-200 rounded mb-4 skeleton"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 skeleton"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 skeleton"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {products && products.length > 0 ? products.slice(0, 6).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square mb-3">
                    <img
                      src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="text-sm">
                    <div className="text-red-600 font-bold mb-1">
                      {product.discountPrice ? `${Math.round(((product.price - product.discountPrice) / product.price) * 100)}% off` : 'Deal'}
                    </div>
                    <div className="text-gray-900 font-semibold mb-1">
                      ${product.discountPrice || product.price}
                    </div>
                    {product.discountPrice && (
                      <div className="text-gray-500 line-through text-xs">
                        ${product.price}
                      </div>
                    )}
                    <div className="text-gray-700 text-xs mt-2 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.numReviews || 0})
                      </span>
                    </div>
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No deals available at the moment.</p>
                  <p className="text-gray-400 text-sm mt-2">Check back later for new deals!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Recommended Products */}
      <section className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recommended for you</h2>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="w-full h-40 bg-gray-200 rounded mb-4 skeleton"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 skeleton"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 skeleton"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {products && products.length > 0 ? products.slice(6, 16).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square mb-3">
                    <img
                      src={product.images?.[0]?.url || product.images?.[0] || '/placeholder-product.jpg'}
                      alt={product.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div className="text-sm">
                    <div className="text-gray-900 font-semibold mb-1 line-clamp-2">
                      {product.name}
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <FiStar
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(product.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">
                        ({product.numReviews || 0})
                      </span>
                    </div>
                    <div className="text-gray-900 font-bold">
                      ${product.discountPrice || product.price}
                    </div>
                    {product.discountPrice && (
                      <div className="text-gray-500 line-through text-xs">
                        ${product.price}
                      </div>
                    )}
                  </div>
                </Link>
              )) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No recommendations available.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Premium Banner */}
      <section className="max-w-screen-2xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Nomotix Premium
          </h2>
          <p className="text-xl mb-6">
            Free delivery, exclusive deals, and more benefits
          </p>
          <Link
            to="/premium"
            className="bg-orange-400 hover:bg-orange-500 text-gray-900 px-8 py-3 rounded-md font-bold text-lg transition-colors"
          >
            Start your free trial
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home
