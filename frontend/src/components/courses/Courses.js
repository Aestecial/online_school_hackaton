import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './courses.css'; // Create or update the CSS file for styles
import { getCourses } from "../../api"; // Import the API function

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const data = await getCourses(); // Fetch courses using the API function
                setCourses(data);
                setLoading(false);
            } catch (err) {
                console.error("Ошибка загрузки курсов:", err.message);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return <div className="text-center mt-4">Загрузка курсов...</div>;
    }

    if (error) {
        return <div className="text-center text-danger mt-4">{error}</div>;
    }

    return (
        <div className="container mt-4">
            <div className="course-grid">
                {courses.map((course) => (
                    <div className="course-card" key={course.id}>
                        <div className="course-card-image">
                            <img
                                src={course.image ? `${course.image}` : "/default-course.jpg"}
                                alt={course.title}
                            />
                        </div>
                        <div className="course-card-content">
                            <h5 className="course-card-title">{course.title}</h5>
                            <p className="course-card-description">{course.short_description}</p>
                            <p className="course-card-creator">
                                Автор: {course.creator_name || "Неизвестный"}
                            </p>
                            <Link to={`/courses/${course.id}`} className="course-card-button">
                                Подробнее
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Courses;
