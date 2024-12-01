import React, { useEffect, useState } from 'react';
import './tabcontent.css'; // Import the CSS file for styles
import { getUserCourses, getUserAchievements } from '../../api'; // API calls
import { Link } from 'react-router-dom';

const TabContent = ({ activeTab }) => {
    const [courses, setCourses] = useState([]);
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const token = localStorage.getItem('access');
                if (!token) {
                    console.error('Access token is missing');
                    return;
                }

                const courseData = await getUserCourses(token);
                setCourses(courseData);

                const achievementData = await getUserAchievements(token);
                setAchievements(achievementData);
            } catch (error) {
                console.error('Error fetching data:', error.response?.data || error.message);
            }
        };

        fetchCourses();
    }, []);

    console.log(achievements);

    console.log(achievements);

    return (
        <div className="tab-content">
            {activeTab === 'achievements' && (
                <div className="info-item">
                    <h2 className="section-title">🎉 Достижения</h2>
                    {achievements.length > 0 ? (
                        <div className="achievement-list">
                            {achievements.map(({ achievement, unlocked_at }) => (
                                <div className="achievement-item" key={achievement.id}>
                                    <img
                                        src={achievement.image || '/default-image.png'} // Fallback image
                                        alt={achievement.title || 'Achievement'}
                                        className="achievement-image"
                                    />
                                    <h3>{achievement.title || 'Достижение'}</h3>
                                    <p>{achievement.description || 'Описание отсутствует.'}</p>
                                    <p className="unlocked-date">
                                        Разблокировано: {new Date(unlocked_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">У вас пока нет достижений. Продолжайте учиться!</p>
                    )}
                </div>
            )}
            {activeTab === 'courses' && (
                <div className="info-item">
                    <h2 className="section-title">📚 Курсы</h2>
                    {courses.length > 0 ? (
                        <div className="course-list">
                            {courses.map((course) => (
                                <div className="course-item" key={course.id}>
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="course-image"
                                    />
                                    <h3>{course.title}</h3>
                                    <p>{course.short_description}</p>
                                    {course.is_completed ? (
                                        <button className="btn btn-secondary" disabled>
                                            Пройден
                                        </button>
                                    ) : (
                                        <Link to={`/courses/${course.id}`} className="btn btn-primary">
                                            Подробнее
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="empty-message">Вы еще не записаны ни на один курс.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TabContent;
