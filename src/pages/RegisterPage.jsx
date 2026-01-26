import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [registerData, setRegisterData] = useState({
        login: '',
        password: '',
        confirmPassword: '',
        name: '',
        surname: '',
        birthDate: ''
    });

    function handleChange(event) {
        const {name , value} = event.target;
        setRegisterData({
            ...registerData,
            [name]: value
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if(registerData.password !== registerData.confirmPassword) {
            alert("Passwords don't match, please try again");
            return null;
        }

        const request = {
            login: registerData.login,
            password: registerData.password,
            name: registerData.name,
            surname: registerData.surname,
            birthDate: registerData.birthDate
        };

        await axios
            .post("http://localhost:8080/api/v1/auth/register", request)
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
        <div>
            <h2>Create account</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="login"
                        value={registerData.login}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Confirm password: </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={registerData.name}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Surname: </label>
                    <input
                        type="text"
                        name="surname"
                        value={registerData.surname}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label>Birth date: </label>
                    <input
                        type="date"
                        name="birthDate"
                        value={registerData.birthDate}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <button type="submit">Register</button>
                </div>
            </form>
        </div>
    );
}