
# Nomotix - Premium E-Commerce Platform
A full-stack, scalable e-commerce web application built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and styled with Tailwind CSS. Nomotix provides a modern, Amazon-style shopping experience with comprehensive product catalog, user management, and secure payment processing.

<img width="1462" height="827" alt="Screenshot 2025-08-12 at 9 23 08 AM" src="https://github.com/user-attachments/assets/0052dd0e-19c4-4db2-99d9-ea0810a2573a" />

<img width="1464" height="832" alt="Screenshot 2025-08-12 at 9 25 59 AM" src="https://github.com/user-attachments/assets/20f1af18-d0ec-4008-a86e-b3669ab06c69" />


## 🚀 Features

### 🧑‍💼 User & Authentication
- User registration, login, logout
- JWT-based authentication
- Role-based access: buyer, seller, admin
- Profile update, password change

### 🛒 Buyer Features
- Product catalog with search and filtering
- Product detail page with images, description, reviews
- Shopping cart with quantity controls
- Checkout flow with address and payment options
- Order history and tracking

### 🧾 Seller Features
- Dashboard with sales and inventory stats
- Add/Edit/Delete products
- View orders and update order status

### 🛠 Admin Panel
- Manage users, sellers, products
- View analytics (orders, revenue, top sellers)
- Moderate product listings and user reports

### 💳 Payment Integration
- Stripe payment processing
- Order confirmation after successful payment

### 🔍 Search & Filter
- Search by product name, category, seller
- Filter by price range, rating, availability

### 📬 Notifications
- Order confirmation emails using NodeMailer
- In-app notification for order updates

## 🛠 Tech Stack

### Frontend
- React.js with Vite
- Tailwind CSS for styling
- React Router for navigation
- Redux Toolkit for state management
- Axios for API calls
- React Hot Toast for notifications

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing
- Stripe for payments
- NodeMailer for emails

### Testing
- Jest + React Testing Library (Frontend)
- Mocha/Jest (Backend)

## 📁 Project Structure

```
ecommerce_project/
├── backend/                 # Express.js backend
│   ├── config/             # Database and app configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── tests/             # Backend tests
│   └── server.js          # Entry point
├── frontend/              # React.js frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── utils/         # Utility functions
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── tests/         # Frontend tests
│   └── package.json
├── docs/                  # Documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd ecommerce_project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Set up environment variables (see .env.example files)

5. Start the development servers
```bash
# Backend (from backend directory)
npm run dev

# Frontend (from frontend directory)
npm run dev
```

## 📝 API Documentation

API documentation will be available at `/api/docs` when the server is running.

## 🧪 Testing

```bash
# Run backend tests
cd backend && npm test

# Run frontend tests
cd frontend && npm test
```

## 🚀 Deployment

Instructions for deploying to Render/Heroku (backend) and Vercel/Netlify (frontend) will be provided in the deployment guide.

## 📄 License

This project is licensed under the MIT License.
