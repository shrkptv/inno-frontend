import OrderCreate from "../components/OrderCreate.jsx";
import OrderList from "../components/OrderList.jsx";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function OrdersPage(){
    const [isExchanging, setIsExchanging] = useState(() => {
        return new URLSearchParams(window.location.search).has("code");
    });

    const navigate = useNavigate();

    const interceptorCalled = useRef(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");

        if (code && !interceptorCalled.current) {
            interceptorCalled.current = true;

            const tokenParams = new URLSearchParams();
            tokenParams.append('grant_type', 'authorization_code');
            tokenParams.append('client_id', import.meta.env.VITE_KEYCLOAK_CLIENT_ID);
            tokenParams.append('code', code);
            tokenParams.append('redirect_uri', import.meta.env.VITE_GOOGLE_REDIRECT_URI);

            axios.post(import.meta.env.VITE_KEYCLOAK_URL, tokenParams, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
                .then(res => {
                    localStorage.setItem("accessToken", res.data.access_token);
                    localStorage.setItem("refreshToken", res.data.refresh_token);
                    window.history.replaceState({}, '', "/orders");
                    setIsExchanging(false);
                })
                .catch((err) => {
                    console.error("Token exchange failed:", err.response?.data);
                    setIsExchanging(false);
                    navigate("/login");
                });
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