import OrderCreate from "../components/OrderCreate.jsx";
import OrderList from "../components/OrderList.jsx";
import api from "../api/axios.js";
import {useEffect, useState} from "react";

export default function OrdersPage(){
    const [isExchanging, setIsExchanging] = useState(() => {
        return new URLSearchParams(window.location.search).has("code");
    });

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code) {
            api.post(`/auth/google-callback?code=${code}`)
                .then(res => {
                    localStorage.setItem("accessToken", res.data.accessToken);
                    localStorage.setItem("refreshToken", res.data.refreshToken);
                    window.history.replaceState({}, '', "/orders");
                    setIsExchanging(false);
                })
                .catch(() => setIsExchanging(false));
        }
    }, []);

    if (isExchanging) {
        return <div className="text-center mt-5">Authentication..</div>;
    }

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