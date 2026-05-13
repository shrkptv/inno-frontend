import { useState, type FC, type FormEvent, type ChangeEvent } from "react";
import api from "../api/axios.ts";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link, useNavigate} from "react-router-dom";
import type {AxiosError} from "axios";

interface RegisterFormData {
    login: string;
    password: string;
    confirmPassword: string;
    name: string;
    surname: string;
    birthDate: string;
}

interface RegisterRequest {
    name: string;
    surname: string;
    birthDate: string;
    email: string;
    password: string;
}

const RegisterPage: FC = () => {
    const [registerData, setRegisterData] = useState<RegisterFormData>({
        login: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        birthDate: ''
    });

    const navigate = useNavigate();

    const today = new Date().toISOString().split('T')[0];
    const isPasswordMatch = registerData.password === registerData.confirmPassword;
    const showMatchError = !isPasswordMatch && registerData.confirmPassword.length > 0;

    const purpleStyle = {
        backgroundColor: '#6f42c1',
        borderColor: '#6f42c1',
        color: 'white' as const
    };

    const cardHeaderStyle = {
        color: '#5a32a3',
        fontWeight: '600' as const
    };

    function handleChange(event: ChangeEvent<HTMLInputElement>): void {
        const {name , value} = event.currentTarget;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault();

        const request: RegisterRequest = {
            name: registerData.name,
            surname: registerData.surname,
            birthDate: registerData.birthDate,
            email: registerData.login,
            password: registerData.password
        };

        try {
            const response = await api.post(`/users/register`, request);
            alert("Registration successful! Please login");
            console.log(response);
            navigate("/login");
        } catch (error) {
            const axiosError = error as AxiosError<{ detail?: string; Error?: string; message?: string }>;

            if (axiosError.response && axiosError.response.data) {
                const data = axiosError.response.data;
                const errorMessage = data.detail || data.Error || data.message || "Registration failed";
                alert(errorMessage);
            } else {
                alert("Network Error: Cannot connect to server");
            }
            console.error(error);
        }

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
                                    pattern="^[A-Za-zА-Яа-яЁё\s]+$"
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
                                    pattern="^[A-Za-zА-Яа-яЁё\s]+$"
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
                                className={`form-control border-2 ${showMatchError ? 'border-danger' : ''}`}
                                type="password"
                                name="confirmPassword"
                                value={registerData.confirmPassword}
                                onChange={handleChange}
                                required
                                minLength={8}
                            />
                            {showMatchError && (
                                <div className="text-danger small mt-1">Passwords do not match</div>
                            )}
                        </div>

                        <div className="d-grid gap-2">
                            <button
                                className="btn btn-lg shadow-sm fw-bold"
                                style={purpleStyle}
                                type="submit"
                                disabled={!isPasswordMatch}>
                                Create Account
                            </button>
                        </div>
                        <div className="mt-3 text-center">
                            <span className="me-2">Already have an account?</span>
                            <Link to="/login">Login</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;

