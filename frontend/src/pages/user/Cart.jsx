import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Modal } from 'rsuite';
import React from 'react';
import '../../styles/Cart.css';

const Cart = () => {
	const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartEmpty } = useCart();
	const navigate = useNavigate();
	const [openGuestModal, setGuestModal] = React.useState(false);

	if (isCartEmpty) {
		return (
		<div className="cart-empty">
			<h2>Cart is empty</h2>
			<p>Browse our menu</p>
			<button onClick={() => navigate('/')} className="btn-primary">
				Browse Menu
			</button>
		</div>
		);
	}

	const guestModal = () => {
		return(
			<Modal>

			</Modal>
		)
	}

	return (
		<div className="cart-page">
			<h1>Cart</h1>
			
			<div className="cart-items">
				{cart.map((item, index) => (
					<div key={item.cartItemId} className="cart-item">
						<div className="cart-item-image">
							<img 
								src={`http://localhost:5173${item.image_url}`} 
								alt={item.name}
							/>
						</div>
						
						<div className="cart-item-details">
							<h3>{item.name}</h3>
							
							{item.customisations && Object.keys(item.customisations).length > 0 && (
								<div className="cart-item-customisations">
									<p className="customisations-label">Customisations:</p>
									<div className="customisations-list">
										{Object.entries(item.customisations).map(([groupId, data]) => (
											<span key={groupId} className="customisation-tag">
												{data.groupName}: {data.options.map(opt => opt.name).join(', ')} 
											</span>
										))}
									</div>
								</div>
							)}
							
							{item.remarks && (
								<p className="cart-item-remarks">Note: {item.remarks}</p>
							)}
							
							<div className="cart-item-actions">
								<div className="quantity-control">
									<button onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}> − </button>
									<span>{item.quantity}</span>
									<button onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}> + </button>
								</div>
								<button 
									onClick={() => removeFromCart(item.cartItemId)}
									className="btn-remove"
								>
									Remove
								</button>
							</div>
						</div>
					</div>
				))}
			</div>
			
			<div className="cart-summary">
				<div className="cart-actions">
					<button onClick={clearCart} className="btn-secondary">
						Clear Cart
					</button>
					<button onClick={() => navigate('/order')} className="btn-primary">
						Submit Order
					</button>
				</div>
			</div>
		</div>
	);
};

export default Cart;