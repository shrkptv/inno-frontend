import OrderList from "../components/OrderList.jsx";

export default function OrdersPage(){
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-8">
                    <OrderList />
                </div>
            </div>
        </div>
    );
};