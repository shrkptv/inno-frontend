import OrderCreate from "../components/OrderCreate.jsx";
import OrderList from "../components/OrderList.jsx";

export default function OrdersPage(){
    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <OrderCreate />
                </div>
                <div className="col-md-8">
                    <OrderList />
                </div>
            </div>
        </div>
    );
};