import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ArchiveUser = () => {
    const [archivedUsers, setArchivedUsers] = useState([]);

    const token = localStorage.getItem('token');


    const fetchArchivedUsers = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/signup-signin/get_soft_all_user/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            console.log(response)
            if (response.data.success) {
                setArchivedUsers(response.data.users);
            } else {
                console.error('Invalid response data:', response.data);
            }
        } catch (error) {
            console.error('Error fetching archived users:', error);
        }
    };

    const handleRestoreUser = async (userId) => {
        try {
            await axios.put(`http://localhost:8000/signup-signin/restore/${userId}/`, null, {
                headers: {
                    'Content-Type': 'application/json',
                    'auth-token': token
                }
            });
            setArchivedUsers(archivedUsers.filter(user => user.user_id !== userId));
            alert('User restored successfully!');
        } catch (error) {
            console.error('Error restoring user:', error);
            alert('Error restoring user. Please try again later.');
        }
    };

    useEffect(() => {
        fetchArchivedUsers();
        // eslint-disable-next-line
    }, []);

    const columns = [
        {
            name: 'Id',
            selector: row => row.user_id,
            sortable: true,
        },
        {
            name: 'First name',
            selector: row => row.first_name,
            sortable: true,
        },
        {
            name: 'Last name',
            selector: row => row.last_name,
            sortable: true,
        },
        {
            name: 'User name',
            selector: row => row.user_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
        },
        {
            name: "Action",
            cell: row => (
                <>
                    <button className='btn btn-success btn-sm' onClick={() => handleRestoreUser(row.user_id)}>Restore</button>

                </>
            )
        }
    ];

    return (
        <div className="container mt-4 usercontainer">
            <h3 className="text-dark mb-3">Archived Users</h3>
            <div className="d-flex justify-content-between mb-3">
                <div>
                    <Link className='btn btn-success me-2' to='/user'>Back</Link>
                </div>
            </div>
            <DataTable
                columns={columns}
                data={archivedUsers}
                striped
                pagination
                highlightOnHover
            />
        </div>
    );
};

export default ArchiveUser;
