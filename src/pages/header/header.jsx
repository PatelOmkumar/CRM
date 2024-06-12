/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './header.css';


const Header = (props) => {

    const [isOpen, setOpen] = useState(false);


    const toggleSidebar = () => {
        setOpen(!isOpen);
        props.toggle(isOpen)
    }

    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const role_id = parseInt(localStorage.getItem('role_id'));
        console.log(role_id);
        if (role_id === 1 || role_id === 2) {
            setIsAdmin(true);
        } else {
            setIsAdmin(false);
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        window.location.href = '/'; // Redirect to the login page
    };



    return (
        <div className="nav-bar-content py-3 px-4">
            <div className="d-flex align-items-center">
                <i className="bi bi-list me-3 d-none d-sm-block" onClick={toggleSidebar} role="button"></i>
                <h5 className="m-0 fw-bold text-capitalize">CRM</h5>
            </div>
            <div className='d-flex align-items-center'>
                <Link to={"workplace"} className='text-decoration-none text-black me-4'>Workplace</Link>

                {isAdmin && (
                    <div className="dropdown me-4">
                        <i className="bi bi-gear-fill fs-4"></i>
                        <div className="dropdown-content">
                            <Link to={'role'}>Role</Link>
                            <Link to={'user'}>User</Link>
                        </div>
                    </div>
                )}
                <div className="dropdown">
                    <i className="bi bi-person-circle fs-4"></i>
                    <div className="dropdown-content">
                        <Link onClick={handleLogout}>Logout</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header