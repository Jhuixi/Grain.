import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar'
// import Footer from './components/Footer'

import HomePage from './pages/Home'
import ItemDetailsPage from './pages/user/ItemDetails'
import CartPage from './pages/user/Cart'
import OrdersPage from './pages/user/Order'
import OrderConfirmationPage from './pages/user/OrderConfirmation'
// import AdminPage from './pages/admin/Admin'

import './App.css'

function App() {
    return (
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
                            {/* <Route path="/admin" element={<AdminPage />} /> */}
                        </Routes> 
                    </main>
                    {/* <Footer /> */}
                </div>
            </Router>
        </CartProvider>
    )
}

export default App