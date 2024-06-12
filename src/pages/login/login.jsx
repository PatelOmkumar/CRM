import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import bgImg from '../../../src/assets/images/5031659.jpg'

const Login = () => {

    const [showPassword, setShowPassword] = useState(false);

    const handleHideShowPass = () => {
        setShowPassword(!showPassword);
    };

    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    // const [rememberMe, setRememberMe] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                // 'http://localhost:8000/api/users/signup-signin/login/',
                'http://127.0.0.1:8000/signup-signin/login/',
                {
                    user_name: userName,
                    password: password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(response);
            if (response.data.token) {
                // Store the token in local storage
                localStorage.setItem('token', response.data.token.access);
                localStorage.setItem('role_id', response.data.user.role_id);
                localStorage.setItem('user_id', response.data.user.user_id);
                console.log('Login successful', response.data.token.access);
                navigate('/dashboard');
                toast.success("Login successfully..!");
            } else {
                console.error('Login failed:', response.data.message);
                toast.error("Login failed");
            }
        } catch (error) {
            console.error('Error occurred:', error);
            toast.error("Invalid credentials");
        }
    };

    return (
        <>
        <div>
            <div className="container">
                <div className='row align-items-center vh-100'>
                    <div className='col-12 col-md-6 col-xl-7'>
                        <img src={bgImg} height={"100%"} width={"100%"} alt="" />
                    </div>
                    <div className="col-12 col-md-6 col-xl-5">
                        <div className="p-4 col-12 col-xxl-10 card">
                            <h2 className="my-5 text-dark-blue fw-bold text-center">Sign in</h2>
                            <form onSubmit={handleSubmit} className='row'>
                                <div>
                                    <label htmlFor="email" className="label">UserName</label>
                                    <input
                                        type="text"
                                        placeholder='User name'
                                        className='col-12 input mb-4'
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        required
                                    />

                                </div>
                                <div className='input-box'>
                                    <label htmlFor="password" className="label">Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Password'
                                        id='password'
                                        className='col-12 input mb-4'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                        {
                                            showPassword ?
                                                <i className="bi bi-eye-fill show-hide-icon" onClick={handleHideShowPass} role='button'></i> :
                                                <i className="bi bi-eye-slash-fill show-hide-icon" onClick={handleHideShowPass} role='button'></i>
                                        }
                                </div>
                                <p>Click Here To <Link to='/register'>Register</Link> </p>
                                <div className="w-100 py-3">
                                    <button type='submit' className='mb-2 col-12 btn btn-yellow'>Sign in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            theme="dark"
        />
    </>
    )
}

export default Login