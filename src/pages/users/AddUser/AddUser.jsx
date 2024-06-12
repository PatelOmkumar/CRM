import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');


    const navigate = useNavigate();

    const handleFirstNameChange = (e) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e) => {
        setLastName(e.target.value);
    };

    const handleUserNameChange = (e) => {
        setUserName(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            first_name: firstName,
            last_name: lastName,
            user_name: userName,
            password: password,
            email: email
        };
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:8000/signup-signin/user/', newUser, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            console.log('User added successfully:', response.data);
            navigate('/user')
            // Refetch user data after adding a new user


            // Clear form fields after successful submission
            setFirstName('');
            setLastName('');
            setUserName('');
            setPassword('');
            setEmail('');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };



    return (
        <div>
            <h2 className='mt-5'>Add User</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                {/* Input fields */}
                <div className="row mb-3">
                    {/* First name */}
                    <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label">First Name :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            value={firstName}
                            onChange={handleFirstNameChange}
                        />
                    </div>
                    {/* Last name */}
                    <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            value={lastName}
                            onChange={handleLastNameChange}
                        />
                    </div>
                </div>
                {/* Username and password */}
                <div className="row mb-3">
                    {/* Username */}
                    <div className="col-md-6">
                        <label htmlFor="userName" className="form-label">Username :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="userName"
                            value={userName}
                            onChange={handleUserNameChange}
                        />
                    </div>
                    {/* Password */}
                    <div className="col-md-6">
                        <label htmlFor="password" className="form-label">Password :</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                </div>
                {/* Email */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email :</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                </div>
                {/* Submit button */}
                <div className="d-flex justify-content-end mb-3">
                    <button type="submit" className="btn btn-primary">Add</button>
                </div>
            </form>
        </div>
    );
}

export default AddUser;
