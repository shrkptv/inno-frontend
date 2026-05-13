import React, { type FC, useState, useEffect } from 'react';
import api from '../api/axios.ts';

interface Product {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartItem {
    itemId: number;
    name: string;
    quantity: number;
    price: number;
}

interface OrderCreateProps {
    onOrderCreated?: () => void;
}

interface OrderData {
    items: Array<{
        itemId: number;
        quantity: number;
    }>;
}

const OrderCreate: FC<OrderCreateProps> = ({ onOrderCreated }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    const [selectedProductId, setSelectedProductId] = useState<string>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [maxStock, setMaxStock] = useState<number>(0);

    useEffect(() => {
        const fetchItems = async (): Promise<void> => {
            try {
                const response = await api.get('/orders/available-items');
                setProducts(response.data);
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        fetchItems();
    }, []);

    const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>): void => {
        const id = e.target.value;
        setSelectedProductId(id);
        const prod = products.find(p => p.id === parseInt(id));
        setMaxStock(prod ? prod.quantity : 0);
    };

    const addToCart = (): void => {
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
            quantity: parseInt(String(quantity)),
            price: product.price
        }]);

        setSelectedProductId('');
        setQuantity(1);
    };

    const removeFromCart = (id: number): void => {
        setCart(cart.filter(item => item.itemId !== id));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        if (cart.length === 0) return alert("Cart is empty!");

        const orderData: OrderData = {
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
                        <input
                            type="number"
                            className="form-control"
                            min="1"
                            max={maxStock}
                            value={quantity}
                            onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                        />
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-outline-primary w-100" onClick={addToCart} disabled={!selectedProductId}>
                            Add to List
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="card border-light bg-light mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        {cart.length === 0 ? (
                            <div className="text-center py-4 text-muted">Cart is empty</div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {cart.map(item => (
                                    <li key={item.itemId} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <div className="fw-bold">{item.name}</div>
                                            <div className="text-muted small">Qty: {item.quantity} x ${item.price.toFixed(2)}</div>
                                        </div>
                                        <div className="d-flex gap-2 align-items-center">
                                            <span className="fw-bold">${(item.quantity * item.price).toFixed(2)}</span>
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-danger"
                                                onClick={() => removeFromCart(item.itemId)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {cart.length > 0 && (
                        <>
                            <div className="mb-3 p-3 bg-light rounded">
                                <div className="d-flex justify-content-between align-items-center">
                                    <span className="fw-bold">Total:</span>
                                    <span className="fw-bold" style={{ color: '#6f42c1', fontSize: '1.2rem' }}>
                                        ${cart.reduce((sum, item) => sum + (item.quantity * item.price), 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <button className="btn w-100" style={{ backgroundColor: '#6f42c1', color: 'white' }} type="submit">
                                Create Order
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
};

export default OrderCreate;