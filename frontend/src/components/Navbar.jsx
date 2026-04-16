import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Badge } from 'rsuite'
import { CartIcon, UserIcon, OrderIcon } from './Icon'
import '../styles/Navbar.css'


const Navbar = ({ cartItemCount }) => {
	const { user, logout } = useAuth();
	const { itemCount } = useCart();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate('/');
	};

	return (
		<nav className="navbar">
			<div className="nav-container">
				{/* Left - Shop Name */}
				<Link to="/" className="nav-brand">
					<h1 className="nav-logo">Grain</h1>
				</Link>

				{/* Right - Icons */}
				<div className="nav-icons">
					{user ? (
						<>
							<button className="icon-btn" onClick={() => navigate('/profile')}>
								<UserIcon />
								<span className="user-name">{user.username}</span>
							</button>
							<button className="icon-btn" onClick={handleLogout}>
								Logout
							</button>
						</>
						) : (
						<>
							<button className="icon-btn" onClick={() => navigate('/track-order')}>
								<OrderIcon /> 
							</button>
							<button className="icon-btn" onClick={() => navigate('/login')}>
								<UserIcon />
							</button>
						</>
					)}
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