import React, { useEffect } from 'react';
import './dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const navigate = useNavigate();
    
    const isLoggedIn = localStorage.getItem('token');
    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div>
            <div className='row mb-3'>
                <div className='col-12 col-md-6 col-xl-3 mb-4'>
                    <div className='px-3 py-4 h-100 rounded-2 text-light d-flex align-items-center' style={{ background: '#3c4b64' }}>
                        <div className='count-circel'>
                            <h3 className='m-0' style={{ color: '#3c4b64' }}>2</h3>
                        </div>
                        <h5 className='ms-3 m-0'>Total properties</h5>
                    </div>
                </div>
                <div className='col-12 col-md-6 col-xl-3 mb-4'>
                    <div className='px-3 py-4 h-100 rounded-2 text-light d-flex align-items-center' style={{ background: '#0d6efd' }}>
                        <div className='count-circel'>
                            <h3 className='m-0' style={{ color: '#0d6efd' }}>3</h3>
                        </div>
                        <h5 className='ms-3 m-0'>Available properties</h5>
                    </div>
                </div>
                <div className='col-12 col-md-6 col-xl-3 mb-4'>
                    <div className='px-3 py-4 h-100 rounded-2 text-light d-flex align-items-center' style={{ background: '#f0a019' }}>
                        <div className='count-circel'>
                            <h3 className='m-0' style={{ color: '#f0a019' }}>4</h3>
                        </div>
                        <h5 className='ms-3 m-0'>Sold properties</h5>
                    </div>
                </div>
                <div className='col-12 col-md-6 col-xl-3 mb-4'>
                    <div className='px-3 py-4 h-100 rounded-2 text-light d-flex align-items-center' style={{ background: '#1eba34' }}>
                        <div className='count-circel'>
                            <h3 className='m-0' style={{ color: '#1eba34' }}>6</h3>
                        </div>
                        <h5 className='ms-3 m-0'>Total property requests</h5>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard



