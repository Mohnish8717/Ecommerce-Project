import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderConfirmation from './pages/OrderConfirmation'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import Orders from './pages/Orders'
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import SellerOrders from './pages/seller/SellerOrders'
import SellerAnalytics from './pages/seller/SellerAnalytics'
import SellerProfile from './pages/seller/SellerProfile'
import ProductForm from './pages/seller/ProductForm'
import AdminDashboard from './pages/admin/AdminDashboard'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { loadUser } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load user from localStorage on app start
    dispatch(loadUser())
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            theme: {
              primary: '#4aed88',
            },
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Public Routes */}
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="order-confirmation" element={
            <ProtectedRoute>
              <OrderConfirmation />
            </ProtectedRoute>
          } />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          
          {/* Seller Routes */}
          <Route path="seller" element={
            <ProtectedRoute requiredRole="seller">
              <SellerDashboard />
            </ProtectedRoute>
          } />
          <Route path="seller/products" element={
            <ProtectedRoute requiredRole="seller">
              <SellerProducts />
            </ProtectedRoute>
          } />
          <Route path="seller/products/new" element={
            <ProtectedRoute requiredRole="seller">
              <ProductForm />
            </ProtectedRoute>
          } />
          <Route path="seller/products/:id/edit" element={
            <ProtectedRoute requiredRole="seller">
              <ProductForm />
            </ProtectedRoute>
          } />
          <Route path="seller/orders" element={
            <ProtectedRoute requiredRole="seller">
              <SellerOrders />
            </ProtectedRoute>
          } />
          <Route path="seller/analytics" element={
            <ProtectedRoute requiredRole="seller">
              <SellerAnalytics />
            </ProtectedRoute>
          } />
          <Route path="seller/profile" element={
            <ProtectedRoute requiredRole="seller">
              <SellerProfile />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="admin/*" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
