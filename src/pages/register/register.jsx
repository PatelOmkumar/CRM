// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import bgImg from '../../../src/assets/images/5031659.jpg'

// const Register = () => {

//     const [showPassword, setShowPassword] = useState(false);
//     const [showConfirmPassword, setShowConfirmPass] = useState(false);

//     const handleHideShowPass = (title) => {
//         if (title === 'password') {
//             setShowPassword(!showPassword);
//         } else {
//             setShowConfirmPass(!showConfirmPassword)
//         }
//     };

//     return (
//         <div>
//             <div className="container">
//                 <div className='row vh-100 align-items-center'>
//                     <div className='col-12 col-md-6 col-xl-7'>
//                         <img src={bgImg} height={"100%"} width={"100%"} alt="" />
//                     </div>
//                     <div className="col-12 col-xl-4 col-lg-5 col-md-7 col-sm-9 mx-auto p-0">
//                         <div className="card p-4 rounded-2">
//                             <h2 className="my-4 text-dark-blue fw-bold text-center">Add new user</h2>
//                             <form method='POST' className='row'>
//                                 <div className='col-6'>
//                                     <label htmlFor="name" className="label">User Name</label>
//                                     <input type='text' placeholder='Name' id='name' name='name' className='col-12 input mb-4' />
//                                 </div>
//                                 <div className='col-6'>
//                                     <label htmlFor="email" className="label">Email</label>
//                                     <input type='text' placeholder='Email' id='email' className='col-12 input mb-4 ' />
//                                 </div>
//                                 <div className='input-box'>
//                                     <label htmlFor="password" className="label">Password</label>
//                                     <input type={showPassword ? 'text' : 'password'} placeholder='Password' id='password' name='password' className='col-12 input mb-4 ' />
//                                     {
//                                         showPassword ?
//                                             <i className="bi bi-eye-fill show-hide-icon" onClick={() => { handleHideShowPass('password') }} role='button'></i> :
//                                             <i className="bi bi-eye-slash-fill show-hide-icon" onClick={() => { handleHideShowPass('password') }} role='button'></i>
//                                     }
//                                 </div>
//                                 <div className='input-box'>
//                                     <label htmlFor="confirmPassword" className="label">Confirm Password</label>
//                                     <input type={showConfirmPassword ? 'text' : 'password'} placeholder='Confirm Password' id='confirmPassword' name='confirmPassword' className='col-12 input mb-4 ' />
//                                     {
//                                         showConfirmPassword ?
//                                             <i className="bi bi-eye-fill show-hide-icon" onClick={() => { handleHideShowPass('confirm password') }} role='button'></i> :
//                                             <i className="bi bi-eye-slash-fill show-hide-icon" onClick={() => { handleHideShowPass('confirm password') }} role='button'></i>
//                                     }
//                                 </div>
//                                 <div className="w-100 py-3">
//                                     <button type='submit' className='mb-2 col-12 btn btn-yellow'>Sign up</button>
//                                 </div>
//                                 <p>Alredy Register..! <Link to='/login'>Login</Link> </p>
//                             </form>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Register;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bgImg from '../../../src/assets/images/5031659.jpg';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        user_name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPass] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleHideShowPass = (title) => {
        if (title === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPass(!showConfirmPassword);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { first_name, last_name, user_name, email, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/signup-signin/signup/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    first_name,
                    last_name,
                    user_name,
                    email,
                    password,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Signup successful:', data);
                navigate('/login'); // Redirect to login page
            } else {
                const errorData = await response.json();
                setError(errorData.message);
            }
        } catch (error) {
            setError('An error occurred during signup. Please try again.');
        }
    };

    return (
        <div>
            <div className="container">
                <div className='row vh-100 align-items-center'>
                    <div className='col-12 col-md-6 col-xl-7'>
                        <img src={bgImg} height={"100%"} width={"100%"} alt="" />
                    </div>
                    <div className="col-12 col-xl-4 col-lg-5 col-md-7 col-sm-9 mx-auto p-0">
                        <div className="card p-4 rounded-2">
                            <h2 className="my-4 text-dark-blue fw-bold text-center">Add new user</h2>
                            <form onSubmit={handleSubmit} className='row'>
                                <div className='col-6'>
                                    <label htmlFor="first_name" className="label">First Name</label>
                                    <input
                                        type='text'
                                        placeholder='First Name'
                                        id='first_name'
                                        name='first_name'
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        className='col-12 input mb-4'
                                    />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor="last_name" className="label">Last Name</label>
                                    <input
                                        type='text'
                                        placeholder='Last Name'
                                        id='last_name'
                                        name='last_name'
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        className='col-12 input mb-4'
                                    />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor="user_name" className="label">User Name</label>
                                    <input
                                        type='text'
                                        placeholder='User Name'
                                        id='user_name'
                                        name='user_name'
                                        value={formData.user_name}
                                        onChange={handleInputChange}
                                        className='col-12 input mb-4'
                                    />
                                </div>
                                <div className='col-6'>
                                    <label htmlFor="email" className="label">Email</label>
                                    <input
                                        type='text'
                                        placeholder='Email'
                                        id='email'
                                        name='email'
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className='col-12 input mb-4'
                                    />
                                </div>
                                <div className='input-box'>
                                    <label htmlFor="password" className="label">Password</label>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder='Password'
                                        id='password'
                                        name='password'
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className='col-12 input mb-4'
                                    />
                                    {showPassword ?
                                        <i className="bi bi-eye-fill show-hide-icon" onClick={() => { handleHideShowPass('password') }} role='button'></i> :
                                        <i className="bi bi-eye-slash-fill show-hide-icon" onClick={() => { handleHideShowPass('password') }} role='button'></i>
                                    }
                                </div>
                                <div className='input-box'>
                                    <label htmlFor="confirmPassword" className="label">Confirm Password</label>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder='Confirm Password'
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className='col-12 input mb-4'
                                    />
                                    {showConfirmPassword ?
                                        <i className="bi bi-eye-fill show-hide-icon" onClick={() => { handleHideShowPass('confirm password') }} role='button'></i> :
                                        <i className="bi bi-eye-slash-fill show-hide-icon" onClick={() => { handleHideShowPass('confirm password') }} role='button'></i>
                                    }
                                </div>
                                {error && <p className="text-danger">{error}</p>}
                                <div className="w-100 py-3">
                                    <button type='submit' className='mb-2 col-12 btn btn-yellow'>Sign up</button>
                                </div>
                                <p>Already Registered? <Link to='/login'>Login</Link></p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
