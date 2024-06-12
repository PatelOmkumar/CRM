import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ArchiveRole = () => {
    const [archivedRoles, setArchivedRoles] = useState([]);

    const token = localStorage.getItem('token');

    const fetchArchivedRoles = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/role/get_soft_all_role/`, {
                headers: {
                    'auth-token': token
                }
            });
            if (response.data.success) {
                setArchivedRoles(response.data.users);
            } else {
                console.error('Invalid response data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching archived users:', error);
        }
    };

    const handleRestoreRole = async (id) => {
        try {
            await axios.put(`http://127.0.0.1:8000/role/restore/${id}/`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            setArchivedRoles(archivedRoles.filter(role => role.role_id !== id));
            alert('User restored successfully!');
        } catch (error) {
            console.error('Error restoring user:', error);
            alert('Error restoring user. Please try again later.');
        }
    };

    useEffect(() => {
        fetchArchivedRoles();
        // eslint-disable-next-line
    }, []);

    const columns = [
        {
            name: 'Id',
            selector: row => row.role_id,
            sortable: true,
        },
        {
            name: 'Name',
            selector: row => row.role_name,
            sortable: true,
        },
        {
            name: 'Slug',
            selector: row => row.role_slug,
            sortable: true,
        },
        {
            name: "Action",
            cell: row => (
                <>
                    <button className='btn btn-success btn-sm' onClick={() => handleRestoreRole(row.role_id)}>Restore</button>

                </>
            )
        }
    ];

    return (
        <div className="container mt-4 usercontainer">
            <h3 className="text-dark mb-3">Archived Roles</h3>
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <Link className='btn btn-success me-2' to='/role'>Back</Link>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={archivedRoles}
                striped
                pagination
                highlightOnHover
            />
        </div>
    );
};

export default ArchiveRole;
