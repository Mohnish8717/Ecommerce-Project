import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Navbar from './Navbar'
import Footer from './Footer'
import { loadCart } from '../../store/slices/cartSlice'

const Layout = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    // Load cart from localStorage on app start
    dispatch(loadCart())
  }, [dispatch])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout
