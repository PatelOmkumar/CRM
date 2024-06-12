
import './App.css';
import Sidebar from './pages/sidebar/sidebar';
import Header from './pages/header/header';
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
const App = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = (data) => {
    setIsOpen(data);
  };

  return (
    <div className='d-flex vh-100 w-100'>
      <div className={(isOpen ? 'sidebar' : 'sidebar-sm')}>
        <Sidebar />
      </div>
      <div className='w-100'>
        <div className='nav-bar'>
          <Header toggle={toggleSidebar} />
        </div>
        <div className='w-100 content overflow-auto position-relative p-3'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default App;
