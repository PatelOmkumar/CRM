import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Board from '@lourenci/react-kanban';
import '@lourenci/react-kanban/dist/styles.css';
import './task.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Task = () => {

    const { task_id } = useParams();
    const [boards, setBoards] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState('');
    const [boardName, setBoardName] = useState('');
    const [boardDescription, setBoardDescription] = useState('');
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [taskStartDate, setTaskStartDate] = useState('');
    const [taskEndDate, setTaskEndDate] = useState('');


    useEffect(() => {
        fetchBoards();
        // eslint-disable-next-line
    }, []);

    const fetchBoards = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/folderboard/get_folderboard/${task_id}/`, {
                headers: {
                    'auth-token': localStorage.getItem('token')
                }
            });
            setBoards(response.data.board_data);
        } catch (error) {
            console.error('Error fetching boards:', error);
        }
    };

    const createBoard = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/folderboard/folderboard/`,
                {
                    board_name: boardName,
                    description: boardDescription,
                    folder_id: task_id
                },
                {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                }
            );
            const newBoard = response.data;
            setBoards(prevBoards => [...prevBoards, newBoard]);
            setBoardName('');
            setBoardDescription('');
            document.querySelector('.modal.fade.show .btn-close').click(); // Close modal
            fetchBoards()
            boards.map(board => (
                getBoardData([board])
            ))
            toast.success("Board created successfully..!");
        } catch (error) {
            console.error('Error creating board:', error);
        }
    };

    const getBoardData = (boardData) => {
        const columns = boardData.map(board => ({
            id: `board-${board.board_id}`,
            title: board.board_name,
            cards: (board.task_data && Array.isArray(board.task_data)) ? // Check if task_data exists and is an array
                board.task_data.map(task => ({
                    id: `task-${task.task_id}`,
                    title: task.task_name,
                    description: task.description
                })) : [] // Return an empty array if task_data is undefined or not an array
        }));

        return {
            columns
        };
    }

    const createTask = async () => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/task/task/`,
                {
                    task_name: taskName,
                    description: taskDescription,
                    startdate: taskStartDate,
                    enddate: taskEndDate,
                    status: 'TO-DO',
                    board_id: selectedBoard
                },
                {
                    headers: {
                        'auth-token': localStorage.getItem('token')
                    }
                }
            );
            // Optionally, you can update the boards state to refresh the data
            setTaskName('');
            setTaskDescription('');
            setTaskStartDate('');
            setTaskEndDate('');
            document.querySelector('.modal.fade.show .btn-close').click(); // Close modal
            window.location.reload();
            toast.success("Task created successfully..!");
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    

    const moveTask = (taskId, currentBoardId, newBoardId, newPosition) => {
        // Find the task in the current board
        const currentBoardIndex = boards.findIndex(board => board.board_id === currentBoardId);
        const newBoardIndex = boards.findIndex(board => board.board_id === newBoardId);
        
        if (currentBoardIndex !== -1 && newBoardIndex !== -1) {
            // Find the task
            const taskIndex = boards[currentBoardIndex].task_data.findIndex(task => task.task_id === taskId);
            
            if (taskIndex !== -1) {
                // Remove task from current board
                const task = boards[currentBoardIndex].task_data.splice(taskIndex, 1)[0];
                // Update task's board_id
                task.board_id = newBoardId;
                // Insert task into new board at specified position
                boards[newBoardIndex].task_data.splice(newPosition, 0, task);
                // Update state
                setBoards([...boards]);
            }
        }
    };
    


    return (
        <>
            <div className="text-end">
                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    Add New Board
                </button>
                <button type="button" className="btn btn-primary ms-2" data-bs-toggle="modal" data-bs-target="#exampleModalTask">
                    Add New Task
                </button>
            </div>
            <div className='d-flex'>
                {boards.map(board => (
                    <Board
                        key={board.board_id}
                        initialBoard={getBoardData([board])}
                        onCardDragEnd={(taskId, currentBoardId, newBoardId, newPosition) => {
                            moveTask(taskId, currentBoardId, newBoardId, newPosition);
                        }}
                    />
                ))}

                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Create Board</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="boardName" className="form-label">Board Name</label>
                                    <input type="text" className="form-control" id="boardName" value={boardName} onChange={(e) => setBoardName(e.target.value)} placeholder="Enter Board name" />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="boardDescription" className="form-label">Description</label>
                                    <textarea className="form-control" id="boardDescription" value={boardDescription} onChange={(e) => setBoardDescription(e.target.value)} placeholder="Enter description"></textarea>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary" onClick={createBoard}>Create Board</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="exampleModalTask" tabIndex="-1" aria-labelledby="exampleModalLabelTask" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="exampleModalLabelTask">Create Task</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label htmlFor="taskName" className="form-label">Task Name</label>
                                <input type="text" className="form-control" id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} placeholder="Enter Task name" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskDescription" className="form-label">Description</label>
                                <textarea className="form-control" id="taskDescription" value={taskDescription} onChange={(e) => setTaskDescription(e.target.value)} placeholder="Enter description"></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskStartDate" className="form-label">Start Date</label>
                                <input type="date" className="form-control" id="taskStartDate" value={taskStartDate} onChange={(e) => setTaskStartDate(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskEndDate" className="form-label">End Date</label>
                                <input type="date" className="form-control" id="taskEndDate" value={taskEndDate} onChange={(e) => setTaskEndDate(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="taskBoard" className="form-label">Select Board</label>
                                <select className="form-select" id="taskBoard" value={selectedBoard} onChange={(e) => setSelectedBoard(e.target.value)}>
                                    <option value="">Select a board</option>
                                    {boards.map(board => (
                                        <option key={board.board_id} value={board.board_id}>{board.board_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary" onClick={createTask}>Create Task</button>
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

export default Task;
