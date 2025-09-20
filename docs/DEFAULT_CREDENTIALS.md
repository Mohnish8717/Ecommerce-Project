# Default Login Credentials

## 🔐 Demo User Accounts

The application comes with pre-configured demo accounts for testing different user roles. All accounts use the same password for simplicity.

### 👤 **Buyer Account**
- **Email**: `buyer@demo.com`
- **Password**: `demo123`
- **Role**: Buyer
- **Access**: Can browse products, add to cart, place orders

### 🏪 **Seller Account**
- **Email**: `seller@demo.com`
- **Password**: `demo123`
- **Role**: Seller
- **Access**: Can manage products, view orders, seller dashboard

### 👑 **Admin Account**
- **Email**: `admin@demo.com`
- **Password**: `demo123`
- **Role**: Admin
- **Access**: Full system access, user management, admin dashboard

## 🚀 **How to Login**

1. **Navigate to Login Page**: Go to http://localhost:3001/login
2. **Use Demo Credentials**: Click on any of the demo credential buttons to auto-fill
3. **Or Manual Entry**: Enter email and password manually
4. **Click Sign In**: You'll be redirected based on your role

## 📱 **Quick Access Buttons**

The login page includes convenient buttons to automatically fill in demo credentials:
- Click "buyer@demo.com / demo123" to login as a buyer
- Click "seller@demo.com / demo123" to login as a seller  
- Click "admin@demo.com / demo123" to login as an admin

## 🔧 **Creating New Accounts**

You can also create new accounts using the registration page:
1. Go to http://localhost:3001/register
2. Fill in your details
3. Choose account type (Buyer or Seller)
4. Submit the form

## 🛡️ **Security Notes**

⚠️ **Important**: These are demo credentials for development/testing only.

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- In production, use strong, unique passwords
- Enable proper password policies
- Consider implementing 2FA

## 🎯 **Role-Based Features**

### **Buyer Features**
- Browse product catalog
- Search and filter products
- Add items to shopping cart
- Checkout and place orders
- View order history
- Update profile

### **Seller Features**
- All buyer features
- Seller dashboard
- Add/edit/delete products
- Manage inventory
- View and update order status
- Sales analytics

### **Admin Features**
- All seller features
- User management
- Product moderation
- System analytics
- Admin dashboard
- Site configuration

## 🔄 **Password Reset**

For demo purposes, password reset functionality is not fully implemented. Use the default credentials or create a new account if needed.

## 📞 **Support**

If you encounter any issues with login:
1. Ensure both backend (port 5000) and frontend (port 3001) servers are running
2. Check browser console for any errors
3. Verify the credentials are entered correctly
4. Try refreshing the page

## 🎨 **UI Features**

The login page includes:
- ✅ Responsive design for all devices
- ✅ Password visibility toggle
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Demo credential quick-fill buttons
- ✅ Links to registration and password reset
