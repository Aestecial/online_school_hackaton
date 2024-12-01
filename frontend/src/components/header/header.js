import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.css';
import { validateAccessToken, getUserInfo } from '../../api';
import NewMenu from './NewMenu';

const Header = () => {
    const [isBurgerActive, setBurgerActive] = useState(false);
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isNewMenuVisible, setNewMenuVisible] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [isAIModalVisible, setAIModalVisible] = useState(false); // Состояние для отображения AI
    const navigate = useNavigate();

    const toggleBurger = () => {
        setBurgerActive(!isBurgerActive);
        setMenuVisible(!isMenuVisible);
        setNewMenuVisible(!isNewMenuVisible);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible);
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
    };

    const redirToMain = () => {
        navigate('/');
    };

    const redirToReg = () => {
        navigate('/registration');
        toggleBurger();
    };

    const redirToLog = () => {
        navigate('/login');
        toggleBurger();
    };

    const toggleAIModal = () => {
        setAIModalVisible(!isAIModalVisible);
    };

    useEffect(() => {
        const accessToken = localStorage.getItem('access');

        if (accessToken) {
            validateAccessToken(accessToken)
                .then(() => {
                    setIsAuthenticated(true);
                    return getUserInfo(accessToken);
                })
                .then((data) => setUserInfo(data))
                .catch(() => {
                    setIsAuthenticated(false);
                    localStorage.removeItem('access');
                    localStorage.removeItem('refresh');
                });
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        setIsAuthenticated(false);
        navigate('/login');
        closeDropdown();
        window.location.reload();
    };

    const isTeacher = userInfo?.role === 'Teacher';

    return (
        <body>
            <NewMenu isVisible={isNewMenuVisible} onClose={toggleBurger} />
            <title>Мое Супер Приложение</title>
            <header className="header">
                <div className={`burger ${isBurgerActive ? 'active' : ''}`} onClick={toggleBurger}>
                    <span></span>
                </div>
                <div onClick={redirToMain} className="logo"><span className='blue_let'>К</span>од<span className='orange_let'>К</span>рафт</div>
                <nav className={`nav ${isMenuVisible ? 'visible' : ''}`}>
                    <ul className="nav-list">
                        <li><a href="/courses">Курсы</a></li>
                        <li><a href="/ide">Web-IDE</a></li>
                        <li><a href="/chats">Мессенджер</a></li>
                        <li><a href="/games">Игры</a></li>
                        {isTeacher && <li><a href="/students">Студенты</a></li>}
                        {!isAuthenticated && (
                            <div className='hideble'>
                                <button onClick={redirToLog} className='rounded-button'>Вход</button>
                                <button onClick={redirToReg} className='rounded-button-red'>Регистрация</button>
                            </div>
                        )}
                    </ul>
                </nav>
                <div className="push-to-end">
                    {isAuthenticated ? (
                        <div className="dropdown">
                            <div className="dropdown-trigger" onClick={toggleDropdown}>
                                <img
                                    src={userInfo?.avatar || '/default-avatar.png'}
                                    alt="User Avatar"
                                    className="user-avatar"
                                />
                                <span className="user-name">{userInfo?.first_name || 'Пользователь'}</span>
                            </div>
                            {isDropdownVisible && (
                                <div className="dropdown-menu">
                                    <button
                                        className="dropdown-item logout-button"
                                        onClick={() => {
                                            closeDropdown();
                                            navigate('/account');
                                        }}
                                    >
                                        Профиль
                                    </button>
                                    <button
                                        className="dropdown-item logout-button"
                                        onClick={handleLogout}
                                    >
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='push-to-end'>
                            <Link to="/registration"><a>Регистрация</a></Link>
                            <Link to="/login"><button className="rounded-button">Войти</button></Link>
                        </div>
                    )}
                </div>
            </header>
            <button className="floating-button" onClick={toggleAIModal}>?</button>

            {/* AI Модальное окно */}
            {isAIModalVisible && (
                <div className="ai-modal">
                    <div className="ai-modal-content">
                    <iframe
                        src="https://71e3-87-117-61-47.ngrok-free.app/"
                        title="AI Chat"
                        className="ai-iframe"
                    ></iframe>
                        <button className="close-ai-modal" onClick={toggleAIModal}>
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
        </body>
    );
};

export default Header;
