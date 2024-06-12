// import React from "react";

// const Profile = () => {
//     return (
//         <div className='user-data-wrapper'>
//             <div className='user-img'>
//                 <img src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png" alt="user-img" />
//             </div>
//             <div className='user-data-top-sec h-50'>
//                 <h1>CRM</h1>
//             </div>
//             <div className='user-data-bottom-sec h-50'>
//                 <div className='user-info'>
//                     <h3>Name</h3>
//                     <h5>Heli Shah</h5>
//                 </div>
//                 <div className='user-info'>
//                     <h3>Email</h3>
//                     <h5>heli@gmail.com</h5>
//                 </div>
//                 <div className='user-info'>
//                     <h3>User Name</h3>
//                     <h5>Heli_Shah</h5>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default Profile;


import  { useEffect, useState } from "react";
import axios from "axios";


const Profile = () => {

    const user_id = localStorage.getItem('user_id')
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
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
                const response = await axios.get(`http://127.0.0.1:8000/signup-signin/getalldata_id_user/${user_id}/`,config);
                setUserData(response.data.user);
                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error loading user data.</p>;

    return (
        <div className='user-data-wrapper'>
            <div className='user-img'>
                <img src="https://png.pngtree.com/png-vector/20220709/ourmid/pngtree-businessman-user-avatar-wearing-suit-with-red-tie-png-image_5809521.png" alt="user-img" />
            </div>
            <div className='user-data-top-sec h-50'>
                <h1>CRM</h1>
            </div>
            <div className='user-data-bottom-sec h-50'>
                <div className='user-info'>
                    <h3>First Name</h3>
                    <h5>{userData.first_name}</h5>
                </div>
                <div className='user-info'>
                    <h3>Last Name</h3>
                    <h5>{userData.last_name}</h5>
                </div>
                <div className='user-info'>
                    <h3>Email</h3>
                    <h5>{userData.email}</h5>
                </div>
                <div className='user-info'>
                    <h3>User Name</h3>
                    <h5>{userData.user_name}</h5>
                </div>
                <div className='user-info'>
                    <h3>Role</h3>
                    <h5>{userData.role_id}</h5>
                </div>
            </div>
        </div>
    );
};

export default Profile;
