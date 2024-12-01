import React from 'react';
import './tabs.css'; // Import the CSS file for styles

const Tabs = ({ activeTab, onChange }) => {
    return (
        <div className="tabs">
            <button
                className={`tab-button ${activeTab === 'achievements' ? 'active' : ''}`}
                onClick={() => onChange('achievements')}
            >
                🎉 Достижения
            </button>
            <button
                className={`tab-button ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => onChange('courses')}
            >
                📚 Курсы
            </button>
        </div>
    );
};

export default Tabs;
