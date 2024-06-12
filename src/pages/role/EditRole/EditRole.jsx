import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const EditRole = () => {
    const [roleData, setRoleData] = useState({
        role_name: '',
        role_slug: ''
    });

    const navigate = useNavigate();
    const { role_id } = useParams();
    const token = localStorage.getItem('token');

    const loadRole = useCallback(async () => {
        try {
            const response = await axios.get(`http://localhost:8000/role/getalldata_id_role/${role_id}/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            setRoleData(response.data.role); // Assuming API response contains role_name and slug directly
        } catch (error) {
            console.error('Error loading role:', error);
        }
    }, [role_id, token]);

    useEffect(() => {
        loadRole();
    }, [loadRole]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedSlug = value.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        setRoleData(prevState => ({
            ...prevState,
            [name]: value,
            role_slug: formattedSlug
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:8000/role/updatealldata_id_role/${role_id}`, roleData, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            console.log('Role updated successfully:', response.data);
            navigate('/role');
        } catch (error) {
            console.error('Error updating role:', error);
        }
    };

    const handleBack = () => {
        navigate('/role');
    };

    // Generate slug based on role name when role name changes
    useEffect(() => {
        const formattedSlug = roleData.role_name.toUpperCase().replace(/[^A-Z0-9]/g, '_');
        setRoleData(prevState => ({
            ...prevState,
            role_slug: formattedSlug
        }));
    }, [roleData.role_name]);

    return (
        <div>
            <h2 className='mt-5'>Edit Role</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row mb-3">
                    <div className="col-md-6">
                        <label htmlFor="roleName" className="form-label">Role Name:</label>
                        <input
                            type="text"
                            className="form-control"
                            id="roleName"
                            name="role_name"
                            value={roleData.role_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="slug" className="form-label">Slug :</label>
                        <input
                            type="text"
                            className="form-control"
                            id="slug"
                            name="role_slug"
                            value={roleData.role_slug}
                            readOnly
                        />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-12 d-flex justify-content-end">
                        <button type="button" className="btn btn-secondary me-2" onClick={handleBack}>Back</button>
                        <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default EditRole;
