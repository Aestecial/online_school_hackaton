import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Убираем navigate, используем href для перезапуска страницы
import './login.css';
import { loginUser } from '../../api'; // Функция для API-запроса

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null); // Для отображения ошибок

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null); // Сбрасываем ошибку перед новым запросом

        if (username.trim() === '' || password.trim() === '') {
            setError('Логин и пароль не могут быть пустыми');
            return;
        }

        try {
            const response = await loginUser({ username, password }); // Отправляем запрос на сервер
            console.log('Успешный вход:', response);

            // Сохраняем токены в localStorage
            localStorage.setItem('access', response.access);
            localStorage.setItem('refresh', response.refresh);

            // Перенаправляем на страницу аккаунта с перезагрузкой
            window.location.href = '/account';
        } catch (err) {
            console.error('Ошибка входа:', err.response?.data || err.message);
            setError(err.response?.data?.detail || 'Ошибка входа. Проверьте логин и пароль.');
        }
    };

    return (
        <div className="login">
            <div className="login-form">
                <h2>Войти</h2>
                {error && <p className="error">{error}</p>} {/* Отображение ошибки */}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Логин:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleUsernameChange}
                            placeholder="Введите логин"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            placeholder="Введите пароль"
                            required
                        />
                    </div>
                    <button type="submit" className="rounded-button">
                        Войти
                    </button>
                    <div className="bot_button">
                        Нет аккаунта? <br />
                        <Link to="/registration" className="underline">Зарегистрироваться</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
