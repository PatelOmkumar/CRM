import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddRole = () => {
    const [role_name, setRoleName] = useState('');
    const [slug, setSlug] = useState('');

    const navigate = useNavigate();

    const handleRoleNameChange = (event) => {
        const input = event.target.value;
        const formattedSlug = input.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        setRoleName(input);
        setSlug(formattedSlug);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token'); // Get the authentication token from local storage
            if (!token) {
                console.error('No token provided');
                return;
            }
            // Send POST request to add role with the authentication token included in the headers
            const response = await axios.post('http://localhost:8000/role/role/', { role_name, role_slug: slug }, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            console.log('User added successfully:', response.data);
            navigate('/role')
        } catch (error) {
            console.error("Error adding role:", error);
        }
    };

    return (
        <div className="container">
            <h2 className='mt-5'>Add Role</h2>
            <form onSubmit={handleSubmit}>
                <div className="row mt-4">
                    <div className="col-md-6 ">
                        <div className="form-group">
                            <label htmlFor="role_name">Role Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="role_name"
                                value={role_name}
                                onChange={handleRoleNameChange}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="slug">Slug:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="slug"
                                value={slug}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end mt-3">
                    <button type="submit" className="btn btn-primary">Add</button>
                </div>
            </form>
        </div>
    );
};

export default AddRole;
