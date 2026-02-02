import { useState } from "react";
import api from "../api/axios.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";

export default function RegisterPage() {
    const [registerData, setRegisterData] = useState({
        login: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        birthDate: ''
    });

    const today = new Date().toISOString().split('T')[0];
    const isPasswordMatch = registerData.password === registerData.confirmPassword;
    const showMatchError = !isPasswordMatch && registerData.confirmPassword.length > 0;

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
        const {name , value} = event.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        const request = {
            login: registerData.login,
            password: registerData.password,
            name: registerData.name,
            surname: registerData.surname,
            birthDate: registerData.birthDate
        };

        await api
            .post(`/auth/register`, request)
            .then((response) => {
                alert("Success: " + response.data);
                console.log(response);
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    const data = error.response.data;

                    const errorMessage = data.detail || data.Error || data.message ||
                        (typeof data === 'string' ? data : "Registration failed");

                    alert(errorMessage);
                } else {
                    alert("Network Error: Cannot connect to server");
                }
                console.log(error);
            });

    }

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="col-md-6 col-lg-4">
                <div className="card shadow-lg border-0 rounded-4 p-4">
                    <h2 className="text-center mb-4" style={cardHeaderStyle}>Create Account</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-6 mb-3">
                                <label className="form-label fw-bold">Name</label>
                                <input
                                    className="form-control border-2"
                                    type="text"
                                    name="name"
                                    value={registerData.name}
                                    onChange={handleChange}
                                    required
                                    pattern="^[A-Za-z\s]+$"
                                    title="Please use only letters"
                                />
                            </div>
                            <div className="col-6 mb-3">
                                <label className="form-label fw-bold">Surname</label>
                                <input
                                    className="form-control border-2"
                                    type="text"
                                    name="surname"
                                    value={registerData.surname}
                                    onChange={handleChange}
                                    required
                                    pattern="^[A-Za-z\s]+$"
                                    title="Please use only letters"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Birth Date</label>
                            <input
                                className="form-control border-2"
                                type="date"
                                name="birthDate"
                                value={registerData.birthDate}
                                onChange={handleChange}
                                required
                                max={today}
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Email</label>
                            <input
                                className="form-control border-2"
                                type="email"
                                name="login"
                                placeholder="name@example.com"
                                value={registerData.login}
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
                                value={registerData.password}
                                onChange={handleChange}
                                required
                                minLength={8}
                                title="Password must have at least 8 characters"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="form-label fw-bold">Confirm password</label>
                            <input
                                className="form-control border-2"
                                type="password"
                                name="confirmPassword"
                                value={registerData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={8}
                                title="Password must have at least 8 characters"
                            />
                            {showMatchError && <div className="text-danger mt-2">Passwords don't match</div>}
                        </div>

                        <div className="d-grid">
                            <button
                                className="btn btn-lg shadow-sm fw-bold"
                                style={purpleStyle}
                                type="submit">
                                Register
                            </button>
                        </div>

                        <div className="mt-3 text-sm-center">
                            <Link to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}