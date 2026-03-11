import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Cart } from './context/CartContext';
import Navbar from './components/Navbar'
// import Footer from './components/Footer'

import HomePage from './pages/Home'
import ItemDetailsPage from './pages/user/ItemDetails'
import CartPage from './pages/user/Cart'
// import OrdersPage from './pages/user/Orders'
// import AdminPage from './pages/admin/Admin'

import './App.css'

function App() {
    return (
        <Cart>
            <Router>
                <div className="App">
                    <Navbar />
                    <main className="main-content">
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/item/:id" element={<ItemDetailsPage />} />
                            <Route path="/cart" element={<CartPage />} />
                            {/* <Route path="/orders" element={<OrdersPage />} />
                            <Route path="/admin" element={<AdminPage />} /> */}
                        </Routes> 
                    </main>
                    {/* <Footer /> */}
                </div>
            </Router>
        </Cart>
    )
}

export default App