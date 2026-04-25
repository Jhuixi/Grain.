import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar'
// import Footer from './components/Footer'

import HomePage from './pages/Home'
import ItemDetailsPage from './pages/user/ItemDetails'
import CartPage from './pages/user/Cart'
import OrdersPage from './pages/user/Order'
import OrderConfirmationPage from './pages/user/OrderConfirmation'
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import Profile from './pages/user/Profile';
import OrderHistory from './pages/user/OrderHistory';
import OrderHistoryDetails from './pages/user/OrderHistoryDetails';
import TrackOrder from './pages/user/TrackOrder';
import Admin from './pages/admin/Admin';

// import AdminPage from './pages/admin/Admin'

import './App.css'

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="App">
                        <Navbar />
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/item/:id" element={<ItemDetailsPage />} />
                                <Route path="/cart" element={<CartPage />} />
                                <Route path="/order" element={<OrdersPage />} />
                                <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />
                                <Route path="/profile" element={ <ProtectedRoute> <Profile /> </ProtectedRoute>} />
                                <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
                                <Route path="/orders/:orderId" element={<ProtectedRoute><OrderHistoryDetails /></ProtectedRoute>} />
                                <Route path="/track-order" element={<TrackOrder />} />
                                <Route path="/admin" element={<Admin />} />
                                {/* <Route path="/admin" element={<AdminPage />} /> */}
                            </Routes> 
                        </main>
                        {/* <Footer /> */}
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    )
}

export default App