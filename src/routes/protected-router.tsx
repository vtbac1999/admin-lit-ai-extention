import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem('token'); // Hoặc localStorage.getItem('token')
    if (!token) {
      navigate('/authentication/sign-in', { replace: true }); // useNavigate để điều hướng
    }
  }, [navigate]);
  return <div>Dashboard Content</div>;
};
export default Dashboard;
