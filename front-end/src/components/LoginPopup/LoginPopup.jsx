import React, { useEffect, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/frontend_assets/assets';
import { useContext } from 'react';
import { StoreContext } from '../../context/ShowContext';
import { toast } from 'react-toastify'
import axios from "axios"

const LoginPopup = ({setShowLogin}) => {

    const {url, setToken} = useContext(StoreContext)

    const [currentState, setCurrentState] = useState("Login");
    const [forgotPassword, setForgotPassword] = useState(false);
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        verifyPassword: ""
    });

    useEffect(() => {
        setForgotPassword(false);
    }, []);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();

        if (forgotPassword) {
            try {
                const response = await axios.post(url + "/api/user/forgot-password", { email: data.email });
                if (response.data.success) {
                    alert("Reset password has sent to your email.")
                    setForgotPassword(false);
                } else {
                    alert(response.data.message);
                }
            } catch (err) {
                alert("Error")
            }
            return;
        }

        if (currentState === "Sign Up") {
            if (data.password !== data.verifyPassword) {
                alert("Password and Verify password are not match")
                return;
            }
        }

        const apiUrl = currentState === "Login" ? "/api/user/login" : "/api/user/register";

        try {
            const response = await axios.post(url + apiUrl, data);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message)
            }
        } catch (err) {
            alert("An error occurs when connect to server.");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className='login-popup-container'>
                <div className="login-popup-title">
                    <h2>{forgotPassword ? "Forgotten password" : currentState}</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>

                <div className="login-popup-inputs">
                    {forgotPassword ? (
                        <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Type your email to reset password' required />
                    ) : (
                        <>
                            {currentState === "Sign Up" && (
                                <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                            )}
                            <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                            <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                            {currentState === "Sign Up" && (
                                <input name='verifyPassword' onChange={onChangeHandler} value={data.verifyPassword} type="password" placeholder='Verify password' required />
                            )}
                            {!forgotPassword && currentState === "Login" ? 
                            <p className='login-popup-link' onClick={() => setForgotPassword(true)}>Forgotten password?</p> : <div></div>}
                        </>
                    )}
                </div>

                <button type='submit'>
                    {forgotPassword ? "Send email to reset password" : (currentState === "Sign Up" ? "Create account" : "Login")}
                </button>

                {!forgotPassword && (
                    <div className="login-popup-condition">
                        <input type="checkbox" required />
                        <p>By continuing, I agree to the terms of use & privacy policy.</p>
                    </div>
                )}

                {!forgotPassword && (
                    currentState === "Login" ?
                        <p>Create a new account? <span onClick={() => setCurrentState("Sign Up")}>Click here</span></p> :
                        <p>Already have an account? <span onClick={() => setCurrentState("Login")}>Login here</span></p>
                )}

                {forgotPassword && (
                    <p><span className='login-popup-link' onClick={() => setForgotPassword(false)}>Back to login</span></p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;