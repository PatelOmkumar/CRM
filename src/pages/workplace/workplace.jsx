import React, { useEffect, useState } from 'react';
import './workplace.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WorkPlace = () => {
    const [workplaces, setWorkplaces] = useState([]);
    const [workplaceName, setWorkplaceName] = useState('');
    const [description, setDescription] = useState('');
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [workplaceToEdit, setWorkplaceToEdit] = useState({});
    const [selectedWorkplaceId, setSelectedWorkplaceId] = useState(null);

    const [selectedProjectId, setSelectedProjectId] = useState(null);


    const navigate = useNavigate();

    const isLoggedIn = localStorage.getItem('token');
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {

        fetchWorkplaces();
    }, []);

    const fetchWorkplaces = async () => {
        try {
            const userId = localStorage.getItem('user_id');
            const response = await axios.get(`http://localhost:8000/userworkplace/getalldata_id_userworkplace/${userId}/`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            // console.log(response);
            if (response.data.success) {
                const fetchedWorkplaces = response.data.workplaces.map(async (workplace) => {
                    const projectResponse = await axios.get(`http://127.0.0.1:8000/projectworkplace/getalldata_id_projectworkplace/${workplace.workplace_id}/`, {
                        headers: {
                            'auth-token': localStorage.getItem('token')
                        }
                    });
                    // console.log(projectResponse);
                    const projects = projectResponse.data.projects;

                    // Fetch the total number of users for each project
                    const projectsWithTotalUsers = await Promise.all(projects.map(async project => {
                        const userResponse = await axios.get(`http://127.0.0.1:8000/projectuser/get_projecttouser/${project.project_id}/`, {
                            headers: {
                                'auth-token': localStorage.getItem('token')
                            }
                        });
                        // console.log("Thisis ",userResponse);
                        return { ...project, totalUsers: userResponse.data.users.length };
                    }));

                    return { ...workplace, projects: projectsWithTotalUsers };
                });

                const resolvedWorkplaces = await Promise.all(fetchedWorkplaces);
                setWorkplaces(resolvedWorkplaces);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleCardClick = (project_id) => {
        navigate(`/project/${project_id}`)
    }

    const createWorkplace = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/workplace/workplace/', {
                workplace_name: workplaceName,
                description: description,
                user_id: localStorage.getItem('user_id')
            }, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            console.log(response.data);
            if (response.data.success) {
                // alert('Workplace Created..!');
                toast.success("Workplace Created..!");
                document.querySelector('.modal.fade.show .btn-close').click(); // Close the modal after displaying the alert
                fetchWorkplaces()
            }
        } catch (error) {
            console.error('Error creating workplace:', error);
        }
    }

    const handleAddProjectClick = (workplaceId) => {
        setSelectedWorkplaceId(workplaceId);
    };

    const createProject = async (workplace_id) => {
        console.log(workplace_id);
        try {
            const response = await axios.post('http://127.0.0.1:8000/project/project/', {
                project_name: projectName,
                description: projectDescription,
                startdate: startDate,
                enddate: endDate,
                workplace_id: workplace_id
            }, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            if (response.data.success) {
                // alert('Project Created..!');
                toast.success("Project Created..!");
                document.querySelector('.modal.fade.show .btn-close').click();
                fetchWorkplaces()
                // Close the modal after displaying the alert
            }
        } catch (error) {
            console.error('Error creating project:', error);
        }
    }

    const handleEdit = (workplace_id) => {
        // Find the folder with the given folderId
        const workplace = workplaces.find(workplace => workplace.workplace_id === workplace_id);

        if (workplace) {
            // Set the folder details in the state
            setWorkplaceToEdit(workplace);
            // Open the edit modal
            document.querySelector('#editModal').classList.add('show');

        }
    };

    const updateWorkplace = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/workplace/update_workplace/${workplaceToEdit.workplace_id}/`, {
                workplace_name: workplaceToEdit.workplace_name
            }, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            if (response.data.success) {
                toast.success("Workplace updated successfully..!");
                fetchWorkplaces(); // Refresh folders after update
                document.querySelector('.modal.fade.show .btn-close').click(); // Close the edit modal
            }
        } catch (error) {
            console.error('Error updating folder:', error);
            // Handle error here, display an error message or take appropriate action
        }
    };

    const handleDelete = async (workplace_id) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/workplace/hard_delete/${workplace_id}/`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            if (response.data.success) {
                toast.success("Workplace deleted successfully..!");
                fetchWorkplaces(); // Refresh folders after deletion
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
            // Handle error here, display an error message or take appropriate action
        }
    };


    return (
        <>
            <div>
                <div className='text-end'>
                    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                        Add Workplace
                    </button>
                </div>
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create Workplace</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="workplace_name" className="form-label">Workplace Name</label>
                                    <input type="text" className="form-control" id="workplace_name" placeholder="Enter workplace name" value={workplaceName} onChange={(e) => setWorkplaceName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={createWorkplace}>Create Workplace</button>
                            </div>
                        </div>
                    </div>
                </div>

                {workplaces.map((workplace, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <div className='d-flex'>
                            <h4 className="text-dark ">{workplace.workplace_name}</h4>
                            <button className='btn btn-sm btn-default ms-2' data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => handleEdit(workplace.workplace_id)}><i className='bi bi-pencil-square' style={{ color: 'blue' }}></i></button>
                            <button className='btn btn-sm btn-default'><i className='bi bi-trash' style={{ color: 'red' }} onClick={() => handleDelete(workplace.workplace_id)}></i></button>
                        </div>
                        <div className="d-flex flex-wrap align-items-center">
                            {workplace.projects.map((project, index) => (
                                <>

                                    <div key={index} className='text-center text-decoration-none text-black folder-wrapper'
                                        onMouseEnter={() => setSelectedProjectId(project.project_id)}
                                        onMouseLeave={() => setSelectedProjectId(null)}>

                                        <div key={index} onClick={() => { handleCardClick(project.project_id) }} className='card my-3 me-3' style={{ background: '#3c4b64', width: '150px' }}>
                                            <div className='card-body' style={{ cursor: 'pointer' }} >
                                                <h5 className='card-title text-light'>{project.project_name}</h5>
                                                <p className='text-light'><i className="bi bi-people text-light"></i> {project.totalUsers}</p>
                                            </div>
                                        </div>
                                        {selectedProjectId === project.project_id && (
                                            <div className="folder-actions">
                                                <button className='btn btn-lg btn-default' data-bs-toggle="modal" data-bs-target="#" ><i className='bi bi-pencil-square' style={{ color: 'blue' }}></i></button>
                                                <button className='btn btn-lg btn-default ms-2' ><i className='bi bi-trash' style={{ color: 'red' }}></i></button>
                                            </div>
                                        )}
                                    </div>
                                </>

                            ))}

                            <div className='mx-3'>
                                <i className="bi bi-plus-square add-icon" role='button' data-bs-toggle="modal" data-bs-target="#exampleModal2" onClick={() => handleAddProjectClick(workplace.workplace_id)}></i>
                            </div>

                        </div>
                    </div>
                ))}

                <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create Project</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="project_name" className="form-label">Project Name</label>
                                    <input type="text" className="form-control" id="project_name" placeholder="Enter project name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <textarea className="form-control" id="description" placeholder="Enter description" value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}></textarea>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="startdate" className="form-label">Start Date</label>
                                    <input type="date" className="form-control" id="startdate" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="enddate" className="form-label">End Date</label>
                                    <input type="date" className="form-control" id="enddate" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={() => createProject(selectedWorkplaceId)}>Create Project</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editModalLabel">Edit Workplace</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="edit_folder_name" className="form-label">Workplace Name</label>
                                    <input type="text" className="form-control" id="edit_folder_name" placeholder="Enter folder name" value={workplaceToEdit.workplace_name} onChange={(e) => setWorkplaceToEdit({ ...workplaceToEdit, workplace_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={updateWorkplace}>Save Changes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                theme="light"
            />
        </>
    );
};

export default WorkPlace;
