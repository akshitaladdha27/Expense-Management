import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from '../components/AdminDashboard';
import ManagerDashboard from '../components/ManagerDashboard';
import EmployeeDashboard from '../components/EmployeeDashboard';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Manager':
        return <ManagerDashboard />;
      case 'Employee':
        return <EmployeeDashboard />;
      default:
        // If role is unknown, redirect to login
        navigate('/login');
        return null;
    }
  };

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={handleLogout}>Logout</button>
      <hr />
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;