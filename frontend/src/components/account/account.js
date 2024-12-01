import React, { useEffect, useState } from 'react';
import './account.css';
import { getUserInfo } from '../../api'; // Import the API function
import Tabs from './tabs'; // Import Tabs component
import TabContent from './tabcontent'; // Import TabContent component

const Account = () => {
    const [userData, setUserData] = useState({
        fullName: '',
        email: '',
        username: '',
        avatar: '', 
    });
    const [activeTab, setActiveTab] = useState('achievements'); // Default tab is 'achievements'

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const token = localStorage.getItem('access'); // Get the token from localStorage
                if (!token) {
                    console.error('Token is missing');
                    return;
                }
                const data = await getUserInfo(token); // API request
                setUserData({
                    fullName: `${data.first_name} ${data.last_name} ${data.middle_name || ''}`.trim(),
                    email: data.email,
                    username: data.username,
                    avatar: data.avatar, // Avatar from API
                    role: data.role,
                });
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };

        fetchUserInfo();
    }, []);
    console.log('User data:', userData);
    return (
        <div className="main_section2">
            <div className="profile">
                <div className="user_info">
                    <img 
                        src={userData?.avatar || '/default-avatar.png'} 
                        alt="User Avatar" 
                        className="user-image" 
                    />
                    <h2>{userData.fullName || 'Имя не указано'}</h2>
                    <p className="role">
                        {userData?.role === 'Teacher' ? 'Учитель' : 'Обучающийся'}
                    </p>
                </div>
                <div className="br_point"></div>
                <div className="comp_bar">
                    {/* Render Tabs */}
                    <Tabs activeTab={activeTab} onChange={setActiveTab} />
                    
                    {/* Render Tab Content */}
                    <TabContent activeTab={activeTab} />
                </div>
            </div>
        </div>
    );
};

export default Account;
