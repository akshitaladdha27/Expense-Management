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
        navigate('/login');
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-white to-gray-200 p-6">

      <div className="bg-white shadow-lg rounded-2xl px-6 py-4 flex items-center justify-between mb-6">
        
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user?.name}!
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your dashboard easily
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg font-medium transition duration-200 shadow-md"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        {renderDashboard()}
      </div>

    </div>
  );
};

export default Dashboard;