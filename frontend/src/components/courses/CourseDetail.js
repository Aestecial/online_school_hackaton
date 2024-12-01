import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { getCourseById, enrollInCourse, fetchEnrollmentStatus } from "../../api";
import "./styles/CoursesDetail.css";

const CourseDetail = ({ token }) => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        getCourseById(id)
            .then((data) => setCourse(data))
            .catch((error) => {
                console.error("Ошибка загрузки курса:", error.response?.data || error.message);
            });

        if (token) {
            fetchEnrollmentStatus(id, token)
                .then((data) => setIsEnrolled(data.is_enrolled))
                .catch((error) => console.error("Ошибка проверки записи:", error));
        }
    }, [id, token]);

    const handleEnroll = async () => {
        try {
            await enrollInCourse(id, token);
            setMessage("Вы успешно записались на курс!");
            setIsEnrolled(true);
        } catch (error) {
            setMessage(error.response?.data?.error || "Ошибка записи на курс.");
        }
    };

    if (!course) return <p>Загрузка...</p>;

    return (
        <div className="course-detail-container">
            <div className="course-card">
                <div className="course-image-wrapper">
                    <img
                        src={`${course.image}`}
                        alt={course.title}
                        className="course-image"
                    />
                </div>
                <div className="course-content">
                    <h2 className="course-title">{course.title}</h2>
                    <ReactMarkdown className="course-description">
                        {course.description}
                    </ReactMarkdown>
                    <p className="course-author">Автор: {course.creator_name}</p>
                    {isEnrolled ? (
                        <Link to={`/courses/${id}/steps`} className="btn btn-primary">
                            Продолжить курс
                        </Link>
                    ) : (
                        <button className="btn btn-success" onClick={handleEnroll}>
                            Записаться на курс
                        </button>
                    )}
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
