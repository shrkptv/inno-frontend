import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const OrderList = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/my');
                setOrders(response.data);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString.replace(' ', 'T')).toLocaleString();
    };

    return (
        <div className="container mt-4" style={{ maxWidth: '600px' }}>
            <h2 className="mb-4 text-center fw-bold">Order History</h2>

            {orders.length === 0 ? (
                <div className="text-center p-5 border rounded bg-light">
                    <p className="text-muted">You haven't placed any orders yet</p>
                </div>
            ) : (
                orders.map((order) => (
                    <div key={order.id} className="card mb-4 shadow-sm border-0">
                        <div className="card-header text-white d-flex justify-content-between align-items-center"
                             style={{ backgroundColor: '#6f42c1' }}>
                            <span className="fw-bold">Order #{order.id}</span>
                            <span className="badge bg-light text-dark">{order.status}</span>
                        </div>

                        <div className="card-body">
                            <p className="text-muted small mb-3 text-end">Placed on: {formatDate(order.creationDate)}</p>

                            <div className="order-items">
                                {order.orderItems?.map((oi) => (
                                    <div key={oi.id} className="d-flex justify-content-between mb-2 pb-2 border-bottom">
                                        <div>
                                            <div className="fw-bold">{oi.item?.name || 'Product'}</div>
                                            <div className="text-muted small">Qty: {oi.quantity}</div>
                                        </div>
                                        <div className="fw-bold align-self-center">
                                            ${(oi.item?.price * oi.quantity || 0).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-footer bg-white border-0 d-flex justify-content-end align-items-center">
                            <span className="me-2 text-muted">Total amount:</span>
                            <span className="h4 mb-0 fw-bold" style={{ color: '#6f42c1' }}>
                                ${order.orderItems?.reduce((sum, oi) =>
                                sum + (oi.quantity * (oi.item?.price || 0)), 0).toFixed(2)
                            }
                            </span>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default OrderList;