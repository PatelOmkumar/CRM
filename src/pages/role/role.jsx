import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Role = () => {
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isLoggedIn = localStorage.getItem("token");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    fetchRoles();
    // eslint-disable-next-line
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/role/getalldata_role/",
        {
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setRoles(response.data.roles);
      } else {
        console.error("Invalid response data:", response.data);
      }
    } catch (error) {
      console.error("Error fetching role data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/role/hard_delete/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      setRoles(roles.filter((role) => role.role_id !== id));
      alert("Role deleted successfully!");
    } catch (error) {
      console.error("Error deleting role:", error);
      alert("Error deleting role. Please try again later.");
    }
  };

  const handleArchiveUser = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/role/soft_delete/${id}/`, {
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      setRoles(roles.filter((role) => role.role_id !== id));
      alert("User Archived successfully!");
    } catch (error) {
      console.log("Error deleting user:", error);
      // alert('Error deleting user. Please try again later.');
    }
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.role_id,
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.role_name,
      sortable: true,
    },
    {
      name: "Slug",
      selector: (row) => row.role_slug,
      sortable: true,
    },
    {
      name: "Roleperm...",
      cell: (row) => (
        <Link
          className="btn btn-primary btn-sm me-2"
          to={`/role/permission/${row.role_id}`}
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
            onClick={() => handleArchiveUser(row.role_id)}
          >
            <i class="bi bi-archive-fill"></i>
          </button>
          <Link
            className="btn btn-primary btn-sm me-2"
            to={`/role/edit/${row.role_id}`}
          >
            <i class="bi bi-pencil-square"></i>
          </Link>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.role_id)}
          >
            <i class="bi bi-trash3-fill"></i>
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="container mt-4">
      <h3 className="text-dark mb-3">Roles List</h3>
      <div className="mb-3">
        <Link className="btn btn-success me-2" to="/role/add">
          Add
        </Link>
        <Link className="btn btn-info me-2" to="/role/archive">
          Restore Role
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={roles}
        striped
        bordered
        small
        pagination
        highlightOnHover
      />
    </div>
  );
};

export default Role;
