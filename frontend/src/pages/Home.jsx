import { useState, useEffect, useRef } from 'react'
import '../styles/Home.css'

const API_BASE = 'http://localhost:5001/api';

const Home = () => {
    const [menuItems, setMenuItems] = useState([])
    const [categories, setCategories] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const categoriesRef = useRef(null)

    const fetchMenuItems = async () => {
        try {
            const response = await fetch(`${API_BASE}/menu`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
            }
            
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.log('Non-JSON response:', text.substring(0, 200));
                throw new Error(`Expected JSON but got: ${contentType}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.message || 'Failed to fetch menu');
            }
            
            setMenuItems(data.data);
            
            const dynamicCategories = [
                { id: 'all', name: 'All' },
                ...Array.from(new Set(data.data.map(item => item.category))).map(cat => ({ id: cat, name: cat }))
            ];
            setCategories(dynamicCategories);
            
        } catch (err) {
            console.error('Error fetching menu:', err);
            setError('Unable to load menu items. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuItems()
    }, [])

    const filteredItems = selectedCategory === 'all'
        ? menuItems
        : menuItems.filter(item => item.category === selectedCategory)

    const handleItemClick = (itemId) => {
        window.location.href = `/item/${itemId}`
    }

    const scrollCategories = (direction) => {
        if (categoriesRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200
            categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (loading) {
        return (
        <div className="home-page">
            <div className="loading-spinner">
                <div className="spinner"></div>
                <p>Loading menu...</p>
            </div>
        </div>
        )
    }

    if (error) {
        return (
        <div className="home-page">
            <div className="error-message">
                <p>{error}</p>
                <button className="btn btn-outline" onClick={fetchMenuItems}>
                    Retry
                </button>
            </div>
        </div>
        )
    }

    return (
        <div className="home-page">
            <div className="banner-section">
                <div className="banner-container">
                {[
                    { id: 1, image: '/images/banner.jpg', title: 'New Seasonal Drinks', subtitle: 'Try our autumn specials' },
                    { id: 2, image: '/images/banner.jpg', title: 'Pastries', subtitle: 'Freshly baked daily' }
                ].map(banner => (
                    <div key={banner.id} className="banner-slide">
                        <div
                            className="banner-image"
                            style={{ backgroundImage: `url(${banner.image})` }}
                        >
                            <div className="banner-content">
                            <h2>{banner.title}</h2>
                            <p>{banner.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="categories-section">
                <div className="categories-header">
                    <h2>Our Menu</h2>
                    <div className="scroll-buttons">
                        <button className="scroll-btn left" onClick={() => scrollCategories('left')}>‹</button>
                        <button className="scroll-btn right" onClick={() => scrollCategories('right')}>›</button>
                    </div>
                </div>

                <div className="categories-container">
                    <div className="categories-scroll" ref={categoriesRef}>
                        {categories.map(category => (
                        <button
                            key={category.id}
                            className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <span className="category-name">{category.name}</span>
                        </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="menu-section">
                <div className="menu-grid">
                {filteredItems.map(item => (
                    <div
                        key={item.item_id}
                        className="menu-item card"
                        onClick={() => handleItemClick(item.item_id)}
                    >
                    <div className="item-image">
                        <img 
                            src={`http://localhost:5173${item.image_url}`}
                            alt={item.name}
                            onError={(e) => {
                                console.error('Failed to load:', item.image_url);
                            }}
                        />
                        <div className="item-category-tag">{item.category}</div>
                    </div>

                    <div className="item-content">
                        <h3 className="item-title">{item.name}</h3>
                        <p className="item-description">{item.description}</p>

                        <div className="item-actions">
                            <button
                                className="btn btn-primary view-details-btn"
                                onClick={(e) => { e.stopPropagation(); handleItemClick(item.item_id) }}
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                    </div>
                ))}
                </div>

                {filteredItems.length === 0 && (
                <div className="empty-state">
                    <p>No items found in this category.</p>
                    <button className="btn btn-outline" onClick={() => setSelectedCategory('all')}>
                        View All Items
                    </button>
                </div>
                )}
            </div>
        </div>
    )
}

export default Home
