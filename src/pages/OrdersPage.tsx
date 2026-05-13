import OrderCreate from "../components/OrderCreate.tsx";
import OrderList from "../components/OrderList.tsx";
import {useEffect, useRef, useState, type FC} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

const OrdersPage: FC = () => {
    const [isExchanging, setIsExchanging] = useState<boolean>(() => {
        return new URLSearchParams(window.location.search).has("code");
    });

    const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

    const handleRefresh = (): void => {
        setRefreshTrigger(prev => prev + 1);
    };

    const navigate = useNavigate();

    const interceptorCalled = useRef<boolean>(false);

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
                .then((res) => {
                    const data = res.data;
                    localStorage.setItem("accessToken", data.access_token);
                    localStorage.setItem("refreshToken", data.refresh_token);
                    window.history.replaceState({}, '', "/orders");
                    setIsExchanging(false);
                })
                .catch((err) => {
                    console.error("Token exchange failed:", err.response?.data);
                    setIsExchanging(false);
                    navigate("/login");
                });
        }
    }, [navigate]);

    if (isExchanging) {
        return <div className="text-center mt-5">Authentication..</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-4">
                    <OrderCreate onOrderCreated={handleRefresh} />
                </div>
                <div className="col-md-8">
                    <OrderList key={refreshTrigger} />
                </div>
            </div>
        </div>
    );
};

export default OrdersPage;

