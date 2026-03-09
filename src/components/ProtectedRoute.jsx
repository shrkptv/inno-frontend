import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("accessToken");
    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const hasCode = params.has("code");

    if (!token && !hasCode) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;