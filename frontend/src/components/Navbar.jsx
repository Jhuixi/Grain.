import { Badge } from 'rsuite'
import { CartIcon, UserIcon } from './Icon'
import { useCart } from '../context/CartContext'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Navbar.css'


const Navbar = ({ cartItemCount }) => {
	const { itemCount } = useCart();
	const navigate = useNavigate();

	return (
		<nav className="navbar">
			<div className="nav-container">
				{/* Left: Shop Name */}
				<Link to="/" className="nav-brand">
					<h1 className="nav-logo">Grain</h1>
				</Link>

				{/* Right: Icons */}
				<div className="nav-icons">
					<button className="icon-btn">
						<UserIcon />
					</button>
					<button className="icon-btn cart-btn" onClick={() => navigate('/Cart')}>
						<CartIcon />
						{cartItemCount > 0 && ( <Badge content={cartItemCount} className="cart-badge" /> )}
					</button>
				</div>
			</div>
		</nav>
	)
}

export default Navbar