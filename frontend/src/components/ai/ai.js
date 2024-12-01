import React from 'react';
import { Link } from 'react-router-dom';
import './ai.css';

const Ai = () => {
    return (
        <div className="games-container">
            <div className="iframe-fullscreen">
            <iframe
                src="https://71e3-87-117-61-47.ngrok-free.app/"
                title="AI Chat"
                className="ai-iframe"
            ></iframe>
            </div>
        </div>
    );
};

export default Ai;
