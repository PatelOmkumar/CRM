
import { NavLink } from "react-router-dom";

import "./sidebar.css";

const sidebar = () => {
    
    return (
        <div className="sidebar-content">
            <NavLink to="/dashboard" className="sidebar-header d-flex align-items-center text-decoration-none">
                <div className="sidebar-item">
                    <i className="bi bi-pie-chart"></i>
                    <h3 className="m-0 ps-3">Task Master</h3>
                </div>
            </NavLink>
            <NavLink to="dashboard" className="sidebar-item">
                <i className="bi bi-speedometer2 me-3"></i>
                Dashboard
            </NavLink>
            <NavLink to="workplace" className="sidebar-item">
                <i className="bi bi-people me-3"></i>
                WorkPlace
            </NavLink>
            <NavLink to="role" className="sidebar-item">
                <i className="bi bi-people me-3"></i>
                Role
            </NavLink>
            <NavLink to="user" className="sidebar-item">
                <i className="bi bi-people me-3"></i>
                User
            </NavLink>
            <NavLink to="profile" className="sidebar-item">
                <i className="bi bi-people me-3"></i>
                Profile
            </NavLink>
            <NavLink to="notes" className="sidebar-item">
                <i className="bi-file-earmark-text me-3"></i>
                Notes
            </NavLink>
        </div>
    );
};

export default sidebar;