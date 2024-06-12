import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const EditUser = () => {
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        user_name: '',
        password: '',
        email: '',
        role_id: ''
    });
    const [userRole, setUserRole] = useState()
    const [allRoles, setAllRoles] = useState([]);

    const navigate = useNavigate();
    const { user_id } = useParams();
    const token = localStorage.getItem('token');

    const loadUser = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/signup-signin/getalldata_id_user/${user_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            console.log(response);
            setUserData(response.data.user);
            setUserRole(response.data.role_name)
        } catch (error) {
            console.error('Error loading user:', error);
        }
    }, [user_id, token]);

    const loadAllRoles = useCallback(async () => {
        try {
            const response = await axios.get('http://127.0.0.1:8000/role/getalldata_role/', {
                headers: {
                    'auth-token': token
                }
            }); // Adjust the API endpoint accordingly
            setAllRoles(response.data.roles);
        } catch (error) {
            console.error('Error loading roles:', error);
        }
    }, [token]);

    useEffect(() => {
        loadUser();
        loadAllRoles();
    }, [loadUser, loadAllRoles]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleRoleChange = (e) => {
        const selectedRoleId = parseInt(e.target.value, 10);
        setUserData(prevData => ({
            ...prevData,
            role_id: selectedRoleId // Set role_id directly in userData
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/signup-signin/updatealldata_id_user/${userData.user_id}/`, userData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            console.log('User updated successfully:', response.data);
            navigate('/user')
            // Close the edit user form here
            // For demonstration, we'll just clear the form data
            setUserData({
                first_name: '',
                last_name: '',
                user_name: '',
                password: '',
                email: '',
                role_id: '' // Reset role_id after submission
            });
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    return (
        <div>
            <h2 className='mt-5'>Edit User</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="firstName" className="form-label">First Name :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="first_name"
                            value={userData.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="lastName" className="form-label">Last Name :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="lastName"
                            name="last_name"
                            value={userData.last_name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="userName" className="form-label">Username :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="userName"
                            name="user_name"
                            value={userData.user_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email :</label>
                        <input
                            type="email"
                            className="form-control"
                            id="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="role" className="form-label">Role :</label>
                        <select
                            className="form-select"
                            id="role"
                            name="role"
                            value={userData.role_id} // Set value to userData.role_id
                            onChange={handleRoleChange}
                        >
                            {allRoles.map(role => (
                                <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12 d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditUser;
