import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import '../../styles/Cart.css';

const Cart = () => {
	const { cart, removeFromCart, updateQuantity, clearCart, cartTotal, isCartEmpty } = useCart();
	const navigate = useNavigate();

	if (isCartEmpty) {
		return (
		<div className="cart-empty">
			<h2>Your cart is empty</h2>
			<p>Add some delicious items from our menu!</p>
			<button onClick={() => navigate('/')} className="btn-primary">
				Browse Menu
			</button>
		</div>
		);
	}

	return (
		<div className="cart-page">
			<h1>Your Cart</h1>
			
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
				<div className="summary-row">
					<span>Subtotal:</span>
					<span>${cartTotal}</span>
				</div>
				<div className="summary-row">
					<span>Tax (10%):</span>
					<span>${(cartTotal * 0.1).toFixed(2)}</span>
				</div>
				<div className="summary-row total">
					<span>Total:</span>
					<span>${(parseFloat(cartTotal) * 1.1).toFixed(2)}</span>
				</div>
				
				<div className="cart-actions">
					<button onClick={clearCart} className="btn-secondary">
						Clear Cart
					</button>
					<button onClick={() => navigate('/checkout')} className="btn-primary">
						Proceed to Checkout
					</button>
				</div>
			</div>
		</div>
	);
};

export default Cart;