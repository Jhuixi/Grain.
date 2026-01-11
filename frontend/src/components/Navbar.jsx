import { Badge } from 'rsuite'
import { CartIcon, UserIcon } from './Icon'
import '../styles/Navbar.css'

const Navbar = ({ cartItemCount }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Left: Shop Name */}
        <div className="nav-brand">
          <h1 className="nav-logo">Grain</h1>
        </div>

        {/* Right: Icons */}
        <div className="nav-icons">
          <button className="icon-btn">
            <UserIcon />
          </button>
          <button className="icon-btn cart-btn">
            <CartIcon />
            {cartItemCount > 0 && (
              <Badge content={cartItemCount} className="cart-badge" />
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar