import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import '../App.css';

function Dashboard() {
    const navigate = useNavigate();
    const [user , setUser] = useState(null);

    // Fetch user profile When dashboard loads
    useEffect(() => {
        const fetchUser = async () => {
        try {
            const res = await API.get('/user/profile');
            setUser(res.data.user);
        } catch (error) {
            navigate('/');
        }
    }
    fetchUser();
}, [navigate]);

const logout = async () => {
    localStorage.removeItem('token');
    // await API.post('/auth/logout');
    navigate('/');
};

if (!user)
    return <div>Loading...</div>;

return (
    <div>
        <h1>Dashboard</h1>
        <p>Welcome, {user.name}!</p>
        <button onClick={logout}>Logout</button>
    </div>
);
};
export default Dashboard