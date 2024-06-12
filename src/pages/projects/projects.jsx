import React, { useEffect, useState } from 'react';
import './projects.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Projects = () => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const { project_id } = useParams();
    const [folderName, setFolderName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [folderToEdit, setFolderToEdit] = useState({});

    const isLoggedIn = localStorage.getItem('token');

    const fetchFolders = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/folder/get_folder/${project_id}/`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            console.log(response);
            if (response.data.success) {
                setFolders(response.data.folders);
            }
        } catch (error) {
            console.error('Error fetching folders:', error);
        }
    };

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
        else {
            fetchFolders();
        }
        //eslint-disable-next-line
    }, []);

    const createFolder = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/folder/folder/', {
                description: description,
                folder_name: folderName,
                project_id: project_id
            }, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            if (response.data.success) {
                toast.success("Folder created successfully..!");
                setFolderName('')
                setDescription('')
                fetchFolders(); // Refresh folders after creation
                document.querySelector('.modal.fade.show .btn-close').click();
            }
        } catch (error) {
            console.error('Error creating folder:', error);
            // Handle error here, display an error message or take appropriate action
        }
    };

    const handleEdit = (folderId) => {
        // Find the folder with the given folderId
        const folder = folders.find(folder => folder.folder_id === folderId);

        if (folder) {
            // Set the folder details in the state
            setFolderToEdit(folder);
            // Open the edit modal
            document.querySelector('#editModal').classList.add('show');

        }
    };


    const handleDelete = async (folderId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/folder/hard_delete/${folderId}/`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            if (response.data.success) {
                toast.success("Folder deleted successfully..!");
                fetchFolders(); // Refresh folders after deletion
            }
        } catch (error) {
            console.error('Error deleting folder:', error);
            // Handle error here, display an error message or take appropriate action
        }
    };

    const updateFolder = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:8000/folder/update_folder/${folderToEdit.folder_id}/`, {
                folder_name: folderToEdit.folder_name
            }, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });

            if (response.data.success) {
                toast.success("Folder updated successfully..!");
                fetchFolders(); // Refresh folders after update
                document.querySelector('.modal.fade.show .btn-close').click(); // Close the edit modal
            }
        } catch (error) {
            console.error('Error updating folder:', error);
            // Handle error here, display an error message or take appropriate action
        }
    };


    return (
        <>
            <div>

                <div className='d-flex align-items-center'>
                    <h3 className='my-4'>Folders</h3>
                    <div className='mx-3 add-icon-wrapper'>
                        <i class="bi bi-plus-square add-icon" role='button' data-bs-toggle="modal" data-bs-target="#exampleModal"></i>
                    </div>
                </div>

                <div className='row align-items-center'>
                    {folders.length > 0 ? (
                        folders.map((folder, index) => (


                            <div key={index} className='text-center col-3 text-decoration-none text-black folder-wrapper'
                                onMouseEnter={() => setSelectedFolderId(folder.folder_id)}
                                onMouseLeave={() => setSelectedFolderId(null)}>
                                <i className="bi bi-folder folder-icon" style={{ cursor: 'pointer' }} onClick={() => { navigate(`/task/${folder.folder_id}`) }}></i>
                                <h4>{folder.folder_name}</h4>
                                {selectedFolderId === folder.folder_id && (
                                    <div className="folder-actions">
                                        <button className='btn btn-lg btn-default' data-bs-toggle="modal" data-bs-target="#editModal" onClick={() => handleEdit(folder.folder_id)}><i className='bi bi-pencil-square' style={{ color: 'blue' }}></i></button>
                                        <button className='btn btn-lg btn-default ms-2' onClick={() => handleDelete(folder.folder_id)}><i className='bi bi-trash' style={{ color: 'red' }}></i></button>
                                    </div>
                                )}
                            </div>

                            
                        ))
                    ) : (
                        <h5>No folders available for this project</h5>
                    )}
                </div>

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create Folder</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="folder_name" className="form-label">Folder Name</label>
                                    <input type="text" className="form-control" id="folder_name" placeholder="Enter folder name" value={folderName} onChange={(e) => setFolderName(e.target.value)} />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="description" placeholder="Enter description" value={description} onChange={(e) => setDescription(e.target.value)} />
                                </div>
                                
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={createFolder}>Create Folder</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="editModalLabel">Edit Folder</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="edit_folder_name" className="form-label">Folder Name</label>
                                    <input type="text" className="form-control" id="edit_folder_name" placeholder="Enter folder name" value={folderToEdit.folder_name} onChange={(e) => setFolderToEdit({ ...folderToEdit, folder_name: e.target.value })} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={updateFolder}>Save Changes</button>
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
}

export default Projects;