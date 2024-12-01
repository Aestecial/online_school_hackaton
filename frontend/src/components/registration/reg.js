import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './reg.css';
import { registerUser } from '../../api';

const Registration = () => {
    const navigate = useNavigate(); // Initialize the navigate hook

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        middleName: '',
        username: '',
        password: '',
        email: '',
        referralCode: '', // Added field for referral code
    });
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        const requestData = {
            first_name: formData.firstName,
            last_name: formData.lastName,
            profile: { 
                middle_name: formData.middleName,
                referral_code: formData.referralCode
            },
            username: formData.username,
            password: formData.password,
            email: formData.email,
        };

        console.log('Отправляемые данные:', requestData);

        try {
            await registerUser(requestData);
            setIsFormSubmitted(true);
            navigate('/login'); // Redirect to the login page on success
        } catch (err) {
            console.error('Ошибка сервера:', err.response?.data); // Log detailed error
            setError(err.response?.data?.username?.[0] || 'Ошибка регистрации');
            setShowErrorModal(true);
        }
    };

    const handleReset = () => {
        setIsFormSubmitted(false);
        setFormData({
            firstName: '',
            lastName: '',
            middleName: '',
            username: '',
            password: '',
            email: '',
            referralCode: '',
        });
        setError(null);
    };

    const closeErrorModal = () => {
        setShowErrorModal(false); // Close the error modal
    };

    return (
        <div className="registration">
            {showErrorModal && (
                <div className="error-modal">
                    <div className="error-modal-content">
                        <p>{error}</p>
                        <button onClick={closeErrorModal} className="close-button">
                            Закрыть
                        </button>
                    </div>
                </div>
            )}
            <div className="registration-form">
                <h2>Регистрация</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="lastName">Фамилия:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Введите фамилию"
                            required
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="firstName">Имя:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Введите имя"
                            required
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="middleName">Отчество:</label>
                        <input
                            type="text"
                            id="middleName"
                            name="middleName"
                            value={formData.middleName}
                            onChange={handleChange}
                            placeholder="Введите отчество"
                            required
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="username">Логин:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Введите логин"
                            required
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Введите пароль"
                            required
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Введите email"
                            required
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="referralCode">Реферальный код:</label>
                        <input
                            type="text"
                            id="referralCode"
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            placeholder="Введите реферальный код (если есть)"
                            disabled={isFormSubmitted}
                        />
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="rounded-button"
                            onClick={isFormSubmitted ? handleReset : null}
                        >
                            {isFormSubmitted ? 'Сбросить' : 'Зарегистрироваться'}
                        </button>
                    </div>
                    <div className="bot_button">
                        Уже есть аккаунт?
                        <Link to="/login" className="underline"> Войти</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Registration;
