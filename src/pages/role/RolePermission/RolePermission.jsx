import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Rolepermission = () => {
  const { roleId } = useParams();
  console.log(roleId);
  const [permissions, setPermissions] = useState({
    user: {
      "create-user": false,
      "get-user": false,
      "update-user": false,
      "delete-user": false,
    },
    role: {
      "create-role": false,
      "get-role": false,
      "update-role": false,
      "delete-role": false,
    },
    permission: {
      "get-permission": false,
    },
    role_permission: {
      "get-role-permission": false,
      "update-role-permission": false,
    },
    user_permission: {
      "get-user-permission": false,
      "update-user-permission": false,
    },
  });

  const permissionLabels = {
    "create-user": "Add",
    "get-user": "View",
    "update-user": "Update",
    "delete-user": "Delete",
    "create-role": "Add",
    "get-role": "View",
    "update-role": "Update",
    "delete-role": "Delete",
    "get-permission": "View",
    "get-role-permission": "View",
    "update-role-permission": "Update",
    "get-user-permission": "View",
    "update-user-permission": "Update",
  };

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token provided");
          return;
        }
        const config = {
          headers: {
            "auth-token": `${token}`,
          },
        };
        console.log(config);

        const response = await axios.get(
          `http://127.0.0.1:8000/role_permission/getalldata_id_rolepermission/${roleId}/`,
          config
        );

        const permissions = response.data.permissions;

        setPermissions((prevState) => {
          const updatedPermissions = { ...prevState };

          permissions.forEach((permission) => {
            const per_name = permission;
            Object.keys(updatedPermissions).forEach((type) => {
              if (Object.prototype.hasOwnProperty.call(updatedPermissions[type], per_name)) {
                updatedPermissions[type][per_name] = true;
              }
            });
          });
          return updatedPermissions;
        });
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissions();
  }, [roleId]);

  const handlePermissionChange = (type, permission) => {
    const updatedPermissions = { ...permissions };
    updatedPermissions[type][permission] =
      !updatedPermissions[type][permission];
    setPermissions(updatedPermissions);
    managePermission(type, permission, updatedPermissions[type][permission]);
  };

  const handleSelectAllPermissions = (type) => {
    const updatedPermissions = { ...permissions };
    const allChecked = Object.values(updatedPermissions[type]).every(Boolean);
    Object.keys(updatedPermissions[type]).forEach((permission) => {
      updatedPermissions[type][permission] = !allChecked;
      managePermission(type, permission, !allChecked);
    });
    setPermissions(updatedPermissions);
  };

  const managePermission = async (type, permission, isChecked) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token provided");
        return;
      }
      const config = {
        headers: {
          "auth-token": `${token}`,
        },
      };
      const operation = isChecked ? "add" : "delete";

      await axios.put(
        `http://127.0.0.1:8000/role_permission/updateRolePermission/${roleId}/`,
        {
          permission_name: permission,
          operation,
        },
        config
      );
      console.log(`Permission ${operation}ed successfully: ${permission}`);
    } catch (error) {
      console.error("Error managing permissions:", error);
    }
  };

  const renderCheckboxes = (type, permissions) => {
    return Object.entries(permissions).map(([key, value]) => (
      <div key={key} className="me-5">
        <input
          type="checkbox"
          checked={value}
          onChange={() => handlePermissionChange(type, key)}
        />
        <label className="ms-2 me-4">{permissionLabels[key]}</label>
      </div>
    ));
  };

  const renderPermissionSection = (type, title) => {
    return (
      <div className="row mb-2">
        <div className="col-6">
          <h3 className="text-primary">{title}</h3>
        </div>
        <div className="col-6 d-flex justify-content-end align-items-center">
          <input
            type="checkbox"
            checked={Object.values(permissions[type]).every(Boolean)}
            onChange={() => handleSelectAllPermissions(type)}
          />
          <label className="ms-2">Select All</label>
        </div>
        <div className="col-11 d-flex justify-content-between">
          {renderCheckboxes(type, permissions[type])}
        </div>
      </div>
    );
  };

  const handleSelectAllPermissionsAll = () => {
    const updatedPermissions = { ...permissions };
    const allChecked = Object.keys(updatedPermissions).every((type) =>
      Object.values(updatedPermissions[type]).every(Boolean)
    );
    Object.keys(updatedPermissions).forEach((type) => {
      Object.keys(updatedPermissions[type]).forEach((permission) => {
        updatedPermissions[type][permission] = !allChecked;
        managePermission(type, permission, !allChecked);
      });
    });
    setPermissions(updatedPermissions);
  };

  return (
    <div className="container">
      <div className="row mb-3">
        <div className="col">
          <input
            type="checkbox"
            checked={Object.keys(permissions).every((type) =>
              Object.values(permissions[type]).every(Boolean)
            )}
            onChange={() => handleSelectAllPermissionsAll()}
          />
          <label className="ms-2">Select All Permissions</label>
        </div>
      </div>

      {renderPermissionSection("user", "User")}
      {renderPermissionSection("role", "Role")}
      {renderPermissionSection("permission", "Permission")}
      {renderPermissionSection("role_permission", "Role Permission")}
      {renderPermissionSection("user_permission", "User Permission")}
    </div>
  );
};

export default Rolepermission;
