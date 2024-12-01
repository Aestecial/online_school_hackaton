import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './newmenu.css'



const NewMenu = ({ isVisible, onClose }) => {

    const navigate = useNavigate();

    const redirToMain = () => {
    navigate("/main");
};
    return (
        <div className={`new-menu ${isVisible ? 'visible' : ''}`}>
        </div>
    );
};

export default NewMenu;