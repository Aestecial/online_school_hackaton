import React, { useState, useEffect } from 'react';
import { fetchReferrals } from '../../api'; // Assume API function is correctly implemented
import './Referrals.css';

const Referrals = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadReferrals = async () => {
            setLoading(true);
            setError(null);

            try {
                const token = localStorage.getItem('access');
                const data = await fetchReferrals(token); // Fetch data from API
                setStudents(data);
            } catch (err) {
                setError('Ошибка при загрузке данных');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadReferrals();
    }, []);

    if (loading) return <div className="loading">Загрузка...</div>;

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="referrals-container">
            <h2>Список студентов</h2>
            {students.length === 0 ? (
                <p>У вас нет рефералов.</p>
            ) : (
                <ul>
                    {students.map((student) => (
                        <li key={student.student_id}>
                            <p>
                                <strong>ФИО: {student.student_full_name || "Имя не указано"}</strong>
                            </p>
                            <p>Email: {student.student_email || "Не указано"}</p>
                            <p>Дата регистрации: {student.enrolled_at || "Не указано"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Referrals;
