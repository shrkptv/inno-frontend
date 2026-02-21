import { useState } from "react";
import api from "../api/axios.js";
import {Link, useNavigate} from "react-router-dom";

export default function LoginPage() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();

    const purpleStyle = {
        backgroundColor: '#6f42c1',
        borderColor: '#6f42c1',
        color: 'white'
    };

    const cardHeaderStyle = {
        color: '#5a32a3',
        fontWeight: '600'
    };

    function handleChange(event) {
        const {name, value} = event.target;
        setLoginData({
            ...loginData,
            [name]: value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const request = {
            login: loginData.email,
            password: loginData.password
        };

        await api
            .post(`/auth/login`, request)
            .then((response) => {
                const accessToken = response.data.accessToken;
                const refreshToken = response.data.refreshToken;
                console.log("Access token: " + accessToken);
                console.log("Refresh token: " + refreshToken);
                if(accessToken && refreshToken)
                {
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    alert("Login successful!");
                    navigate("/orders");
                }
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.Error || error.response?.data?.detail || "Login failed";
                alert(errorMsg);
            });

    }

    const handleGoogleLogin = () => {
        const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL;
        const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

        const responseType = "code";
        const scope = "openid";
        const idpHint = "google";

        const authUrl = `${keycloakUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}&kc_idp_hint=${idpHint}`;

        window.location.href = authUrl;
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="col-md-5 col-lg-4">
                <div className="card shadow-lg border-0 rounded-4 p-4">
                    <h2 className="text-center mb-4" style={cardHeaderStyle}>Login</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="form-label fw-bold">Email</label>
                            <input
                                className="form-control border-2"
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                value={loginData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Password</label>
                            <input
                                className="form-control border-2"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-lg shadow-sm fw-bold"
                                style={purpleStyle}
                                type="submit">
                                Sign In
                            </button>
                        </div>
                        <div className="d-grid gap-2 mt-3">
                            <button
                                className="btn btn-outline-danger btn-lg shadow-sm fw-bold"
                                type="button"
                                onClick={handleGoogleLogin}>
                                <i className="bi bi-google me-2"></i> Sign in with Google
                            </button>
                        </div>
                        <div className="mt-3 text-sm-center">
                            <Link to="/register">Register</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}