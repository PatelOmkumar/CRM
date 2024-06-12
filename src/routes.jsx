import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./App"; // Import the App component

// Import individual pages or components for structured routing
import Dashboard from "./pages/dashboard/dashboard";
import WorkPlace from "./pages/workplace/workplace";
import Folder from "./pages/folders/folder";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Profile from "./pages/profile/Profile";
import Notes from "./pages/notes/Notes";
import Role from "./pages/role/role"; // Placeholder for nested roles routes

import AddRole from "./pages/role/AddRole/AddRole";
import EditRole from "./pages/role/EditRole/EditRole";
import Rolepermission from "./pages/role/RolePermission/RolePermission";
import ArchiveRole from "./pages/role/ArchiveRole/ArchiveRole";
import AddUser from "./pages/users/AddUser/AddUser";
import EditUser from "./pages/users/EditUser/EditUser";
import PermissionPage from "./pages/users/UserPermission/UserPermission";
import ArchiveUser from "./pages/users/ArchiveUser/ArchiveUser";

import Users from "./pages/users/users"; // Placeholder for nested users routes
import Projects from "./pages/projects/projects";
import Task from "./pages/task/task";

// Function to handle nested routes for roles and users (if needed)
const NestedRoutes = ({ children }) => {
  return children;
};

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<App />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/workplace" element={<WorkPlace />} />
          <Route path="/folder" element={<Folder />} />
          <Route path="/project/:project_id" element={<Projects />} />
          <Route path="/task/:task_id" element={<Task />} />

          {/* Nested routes for roles (example) */}
          <Route path="/role" element={<Role />}></Route>
          <Route path="/role/add/" element={<AddRole />} />
          <Route path="/role/edit/:role_id" element={<EditRole />} />
          <Route path="role/permission/:roleId" element={<Rolepermission />} />
          <Route path="role/archive/" element={<ArchiveRole />} />

          {/* Nested routes for users (example) */}
          {/* <Route path="/user" element={<NestedRoutes><Users /></NestedRoutes>}> */}
          <Route path="/user" element={<Users />}></Route>
          <Route path="user/add" element={<AddUser />} />
          <Route path="user/edit/:user_id" element={<EditUser />} />
          {/* <Route path="user/permission/:userId" element={<UserPermission />} /> */}
          <Route path="user/permission/:userId" element={<PermissionPage />} />
          <Route path="user/archive" element={<ArchiveUser />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
