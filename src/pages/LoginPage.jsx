import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

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

        await axios
            .post("http://localhost:8080/api/v1/auth/login", request)
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
                }
            })
            .catch((error) => {
                const errorMsg = error.response?.data?.Error || error.response?.data?.detail || "Login failed";
                alert(errorMsg);
            });

    }

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button type="submit">Sing In</button>
                </div>
            </form>
        </div>
    );
}