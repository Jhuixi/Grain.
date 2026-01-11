import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
// import Footer from './components/Footer'

import HomePage from './pages/Home'
// import ItemDetailsPage from './pages/ItemDetails'
// import CartPage from './pages/Cart'
// import OrdersPage from './pages/Orders'
// import AdminPage from './pages/admin/Admin'

import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/item/:id" element={<ItemDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/admin" element={<AdminPage />} /> */}
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  )
}

export default App