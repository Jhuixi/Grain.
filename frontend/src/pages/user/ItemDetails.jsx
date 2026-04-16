import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Modal, Button } from 'rsuite';
import '../../styles/ItemDetails.css';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [customisationData, setCustomisationData] = useState([]);
    const [selectedCustomisations, setSelectedCustomisations] = useState({});
    const [remarks, setRemarks] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                //get item
                const itemResponse = await fetch(`http://localhost:5001/api/menu/${id}`);
                const itemData = await itemResponse.json();
                setItem(itemData.data);
                
                //get customisation
                const customResponse = await fetch(`http://localhost:5001/api/customisations`);
                const customData = await customResponse.json();
                if (customData.success) {
                    setCustomisationData(customData.data);
                    
                    const initialSelections = {};
                    customData.data.forEach(group => {
                        initialSelections[group.id] = [];
                    });
                    
                    customData.data.forEach(group => {
                        if (group.is_required && group.options.length > 0) {
                            initialSelections[group.id] = [group.options[0].id];
                        }
                    });
                    
                    setSelectedCustomisations(initialSelections);
                }
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleCustomisationChange = (groupId, optionId, isCheckbox = false) => {
        setSelectedCustomisations(prev => {
            if (isCheckbox) {
                const current = prev[groupId] || [];
                const newSelection = current.includes(optionId) ? current.filter(id => id !== optionId) : [...current, optionId]; 
                return { ...prev, [groupId]: newSelection };
            } else {
                return { ...prev, [groupId]: [optionId] };
            }
        });
    };

    const handleAddToCart = () => {
        if (!item) return;
        const customisations = {};
        
        Object.entries(selectedCustomisations).forEach(([groupId, optionIds]) => {
            if (optionIds && optionIds.length > 0) {
            const group = customisationData.find(g => g.id === parseInt(groupId));
            
            const optionDetails = optionIds.map(optionId => {
                const option = group?.options.find(opt => opt.id === optionId);
                return {
                id: optionId,
                name: option?.option_name || `Option ${optionId}`
                };
            });
            
            customisations[groupId] = {
                groupName: group?.name || `Group ${groupId}`,
                options: optionDetails
            };
            }
        });
        
        const cartItem = {
            item_id: item.item_id,
            name: item.name,
            quantity: quantity,
            customisations: customisations,
            remarks: remarks,
            image_url: item.image_url,
            category: item.category
        };
        
        addToCart(cartItem);
        // alert(`Added ${quantity} ${item.name}(s) to cart!`);
        return (
            <Modal open={open} >
                <Modal.Header>
                    <Modal.Title>Added ${quantity} ${item.name}(s) to cart.</Modal.Title>
                </Modal.Header>
                <Modal.Footer>
                    <Button onClick={navigate('/cart')} appearance="subtle">
                        View Cart
                    </Button>
                    <Button onClick={navigate('/')} appearance="primary">
                        Return to Main Menu
                    </Button>
                </Modal.Footer>
            </Modal>
        )
    };

    // const addCartModal = () => {
    //     return (
    //         <Modal open={open} onClose={handleClose}>
    //             <Modal.Header>
    //                 <Modal.Title>Added ${quantity} ${item.name}(s) to cart.</Modal.Title>
    //             </Modal.Header>
    //             <Modal.Footer>
    //                 <Button onClick={navigate('/cart')} appearance="subtle">
    //                     View Cart
    //                 </Button>
    //                 <Button onClick={navigate('/')} appearance="primary">
    //                     Return to Main Menu
    //                 </Button>
    //             </Modal.Footer>
    //         </Modal>
    //     )
    // }

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading item details...</p>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="error-container">
                <h2>Error Loading Item</h2>
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className="btn-back">
                    Go Back
                </button>
            </div>
        );
    }
    
    if (!item) {
        return (
            <div className="not-found">
                <h2>Item Not Found</h2>
                <button onClick={() => navigate('/')} className="btn-back">
                    Back to Menu
                </button>
            </div>
        );
    }

    return (
        <div className="item-details-page">
            <button onClick={() => navigate(-1)} className="btn-back">
                Back to Menu
            </button>
            <div className="item-main">
                <div className="item-image-section">
                    <img 
                        src={`http://localhost:5173${item.image_url}`}
                        alt={item.name}
                        className="item-image"
                        onError={(e) => {
                            e.target.src = '/images/placeholder-food.jpg';
                        }}
                    />
                    <div className="item-category-badge">{item.category}</div>
                </div>
                
                <div className="item-info-section">
                    <h1 className="item-title">{item.name}</h1>
                    
                    <div className="item-description">
                        <h3>Description</h3>
                        <p>{item.description}</p>
                    </div>
                    
                    {item.allergies && item.allergies.trim() && (
                        <div className="item-allergies">
                            <h3>Allergies</h3>
                            <p>{item.allergies}</p>
                        </div>
                    )}
                    
                    {customisationData.length > 0 && (
                        <div className="customisations-section">
                            <h2>Customise Your Order</h2>
                            
                            {customisationData.map(group => (
                                <div key={group.id} className="customisation-group">
                                    <div className="group-header">
                                        <h3>
                                            {group.name}
                                            {group.is_required && <span className="required-star"> *</span>}
                                        </h3>
                                        {group.max_selections > 1 && (
                                            <span className="selection-limit">
                                                (Select up to {group.max_selections})
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className={`options-container ${group.max_selections === 1 ? 'radio-options' : 'checkbox-options'}`}>
                                        {
                                            group.options.filter(option => option.is_available).map(option => {
                                                const isSelected = selectedCustomisations[group.id]?.includes(option.id);
                                                const isRadio = group.max_selections === 1;
                                                
                                                return (
                                                    <label 
                                                        key={option.id} 
                                                        className={`option-label ${isSelected ? 'selected' : ''}`}
                                                    >
                                                        <input
                                                            type={isRadio ? 'radio' : 'checkbox'}
                                                            name={`customisation-${group.id}`}
                                                            value={option.id}
                                                            checked={isSelected}
                                                            onChange={() => handleCustomisationChange(group.id, option.id, !isRadio)}
                                                            className="option-input"
                                                        />
                                                        <span className="option-name">{option.option_name}</span>
                                                    </label>
                                                );
                                            })
                                        }
                                        {group.options.filter(opt => opt.is_available).length === 0 && (<p className="no-options">No options available</p>)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <div className="remarks-section">
                        <h3>Remarks</h3>
                        <textarea
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            rows="3"
                            className="remarks-textarea"
                        />
                    </div>
                    
                    {/* Set quantity and add cart */}
                    <div className="action-section">
                        <div className="quantity-selector">
                            <label>Quantity:</label>
                            <div className="quantity-controls">
                                <button 
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                    className="qty-btn"
                                > − </button>
                                <span className="qty-display">{quantity}</span>
                                <button 
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="qty-btn"
                                > + </button>
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleAddToCart}
                            className="btn-add-to-cart"
                            disabled={customisationData.some(group => 
                                group.is_required && 
                                (!selectedCustomisations[group.id] || 
                                selectedCustomisations[group.id].length === 0)
                            )}
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;