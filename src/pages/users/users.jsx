import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  const token = localStorage.getItem("token");

  const isLoggedIn = localStorage.getItem("token");
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/signup-signin/getalldata_user/",
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      console.log("Response data:", response.data); // Log response data
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // console.log("Users state:", users);

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:8000/signup-signin/hard_delete/${userId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      setUsers(users.filter((user) => user.user_id !== userId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again later.");
    }
  };

  const handleArchiveUser = async (userId) => {
    try {
      await axios.delete(
        `http://localhost:8000/signup-signin/soft_delete/${userId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      setUsers(users.filter((user) => user.user_id !== userId));
      alert("User Archived successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Error deleting user. Please try again later.");
    }
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.user_id,
      sortable: true,
    },
    {
      name: "First name",
      selector: (row) => row.first_name,
      sortable: true,
    },
    {
      name: "Last name",
      selector: (row) => row.last_name,
      sortable: true,
    },
    {
      name: "User name",
      selector: (row) => row.user_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
    },
    {
      name: "Role",
      selector: (row) => row.role_name,
    },
    {
      name: "Userperm...",
      cell: (row) => (
        <Link
          className="btn btn-primary btn-sm me-2"
          to={`/user/permission/${row.user_id}`}
        >
          <i class="bi bi-lock-fill"></i>
        </Link>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <>
          <button
            className="btn btn-success btn-sm me-2"
            onClick={() => handleArchiveUser(row.user_id)}
          >
            <i class="bi bi-archive-fill"></i>
          </button>
          <Link
            className="btn btn-primary btn-sm me-2"
            to={`/user/edit/${row.user_id}`}
          >
            <i class="bi bi-pencil-square"></i>
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteUser(row.user_id)}
          >
            <i class="bi bi-trash3-fill"></i>
          </button>
        </>
      ),
    },
  ];

  useEffect(() => {
    fetchUserData();
    const storedPage = localStorage.getItem("currentPage"); // Get stored page number
    if (storedPage) {
      setCurrentPage(parseInt(storedPage, 10)); // Set current page from storage
    }
  }, []);

  // Update current page in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("currentPage", currentPage.toString());
  }, [currentPage]);

  return (
    <>
      <div className="container mt-4 usercontainer">
        <h3 className="text-dark mb-3">User</h3>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <Link className="btn btn-success me-2" to="/user/add">
              Add
            </Link>
            <Link className="btn btn-info me-2" to="/user/archive">
              Restore Users
            </Link>
          </div>
        </div>
        {Array.isArray(users) && users.length > 0 ? (
          <DataTable
            columns={columns}
            data={users}
            striped
            bordered
            pagination
            highlightOnHover
            paginationPerPage={5}
            paginationDefaultPage={currentPage}
            onChangePage={(page) => setCurrentPage(page)}
          />
        ) : (
          <p>No users found.</p>
        )}
      </div>
    </>
  );
};

export default Users;
