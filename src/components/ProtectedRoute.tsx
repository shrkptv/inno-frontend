import React, {type FC, type ReactNode} from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const hasCode = params.has("code");

    if (!token && !hasCode) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;

