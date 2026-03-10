# VELOUR — Premium Fashion E-Commerce
Full-Stack MERN E-Commerce for Men, Women & Kids clothing brand.
**Author:** Manish Kumar | **License:** MIT


<img width="1912" height="934" alt="Screenshot 2026-03-10 073143" src="https://github.com/user-attachments/assets/ac9d1f8f-acb2-4e30-918b-81ddd889de6a" />

---

## 🚀 Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env    # Fill your credentials
npm run dev             # Runs on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start               # Runs on http://localhost:3000
```

---

## 📁 Project Structure

```
velour/
├── LICENSE
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── server.js
│   ├── config/
│   │   ├── db.js
│   │   └── passport.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── errorMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   └── Order.js
│   └── routes/
│       ├── authRoutes.js
│       ├── productRoutes.js
│       ├── orderRoutes.js
│       └── userRoutes.js
└── frontend/
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── index.js
        ├── index.css
        ├── App.js
        ├── components/
        │   ├── auth/GoogleLoginButton.jsx
        │   ├── cart/CartDrawer.jsx
        │   ├── cart/CartItem.jsx
        │   ├── layout/Navbar.jsx
        │   ├── layout/Footer.jsx
        │   ├── product/ProductCard.jsx
        │   ├── product/ProductGrid.jsx
        │   ├── product/ProductFilters.jsx
        │   ├── product/ReviewForm.jsx
        │   └── common/Loader.jsx
        ├── hooks/
        │   ├── useAuth.js
        │   └── useCart.js
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── ShopPage.jsx
        │   ├── ProductDetailPage.jsx
        │   ├── CartPage.jsx
        │   ├── CheckoutPage.jsx
        │   ├── OrderSuccessPage.jsx
        │   ├── ProfilePage.jsx
        │   └── LoginPage.jsx
        ├── redux/
        │   ├── store.js
        │   └── slices/
        │       ├── authSlice.js
        │       ├── cartSlice.js
        │       └── productSlice.js
        ├── services/
        │   └── api.js
        └── utils/
            ├── formatPrice.js
            └── razorpayHelper.js
```

---

## 💳 Razorpay Flow
1. Frontend → `POST /api/orders/create-razorpay-order` → gets `order_id`
2. Razorpay modal opens in browser
3. On payment success → `POST /api/orders/verify-payment`
4. Backend verifies HMAC-SHA256 signature using `crypto` module
5. Order saved to MongoDB on success

---

## 🔐 Tech Stack
- **Frontend:** React 18, Tailwind CSS, Redux Toolkit
- **Backend:** Node.js, Express.js
- **DB:** MongoDB + Mongoose (`ecommerce_db`)
- **Auth:** Google OAuth via Passport.js + JWT
- **Payment:** Razorpay
