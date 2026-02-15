import React, { useState, useEffect } from 'react';
import api from '../api/axios';

const CreateOrder = ({ onOrderCreated }) => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);

    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [maxStock, setMaxStock] = useState(0);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/orders/available-items');
                setProducts(response.data);
            } catch (error) {
                console.error("Ошибка загрузки товаров:", error);
            }
        };
        fetchItems();
    }, []);

    const handleProductChange = (e) => {
        const id = e.target.value;
        setSelectedProductId(id);
        const prod = products.find(p => p.id === parseInt(id));
        setMaxStock(prod ? prod.quantity : 0);
    };

    const addToCart = () => {
        const product = products.find(p => p.id === parseInt(selectedProductId));
        if (!product) return;

        const existing = cart.find(item => item.itemId === product.id);
        if (existing) {
            alert("This item is already in your cart");
            return;
        }

        setCart([...cart, {
            itemId: product.id,
            name: product.name,
            quantity: parseInt(quantity),
            price: product.price
        }]);

        setSelectedProductId('');
        setQuantity(1);
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.itemId !== id));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return alert("Cart is empty!");

        const orderData = {
            items: cart.map(item => ({
                itemId: item.itemId,
                quantity: item.quantity
            }))
        };

        try {
            await api.post('/orders', orderData);
            alert('Order created!');
            setCart([]);
            if (onOrderCreated) onOrderCreated();
        } catch (error) {
            alert('Error creating order');
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-5" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            <div className="card-body p-4">
                <h4 className="fw-bold mb-4" style={{ color: '#6f42c1' }}>New Order</h4>

                <div className="row g-3 align-items-end mb-4">
                    <div className="col-md-5">
                        <label className="form-label small text-muted">Select Product</label>
                        <select className="form-select" value={selectedProductId} onChange={handleProductChange}>
                            <option value="">Choose...</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label small text-muted">Qty</label>
                        <input type="number" className="form-control" min="1" max={maxStock}
                               value={quantity} onChange={e => setQuantity(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-outline-primary w-100" onClick={addToCart} disabled={!selectedProductId}>
                            Add to List
                        </button>
                    </div>
                </div>

                {cart.length > 0 && (
                    <div className="mb-4">
                        <h6>Items in this order:</h6>
                        <ul className="list-group mb-3">
                            {cart.map(item => (
                                <li key={item.itemId} className="list-group-item d-flex justify-content-between align-items-center">
                                    {item.name} (x{item.quantity}) - ${ (item.price * item.quantity).toFixed(2) }
                                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.itemId)}>×</button>
                                </li>
                            ))}
                        </ul>
                        <button className="btn text-white w-100 fw-bold"
                                style={{ backgroundColor: '#6f42c1' }} onClick={handleSubmit}>
                            Place Order (${cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2)})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CreateOrder;