import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseSteps, completeStep } from "../../api";
import "./styles/CourseSteps.css";

const CourseSteps = ({ token }) => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [steps, setSteps] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchSteps();
    }, [courseId, token]);

    const fetchSteps = async () => {
        try {
            const response = await getCourseSteps(courseId, token);
            setSteps(response);
        } catch (error) {
            console.error("Ошибка загрузки этапов:", error.response?.data || error.message);
        }
    };

    const handleCompleteStep = async (stepId) => {
        try {
            const response = await completeStep(courseId, stepId, token);
            setMessage(response.message);
            fetchSteps(); // Обновление этапов после завершения
        } catch (error) {
            setMessage("Ошибка завершения этапа");
            console.error("Ошибка завершения этапа:", error.response?.data || error.message);
        }
    };

    const handleStartStep = (stepId) => {
        navigate(`/courses/${courseId}/steps/${stepId}`);
    };

    return (
        <div className="course-steps-container">
            <h2 className="course-steps-title">Этапы курса</h2>
            {message && <p className="course-steps-message">{message}</p>}
            <div className="course-steps-list">
                {steps.map((step, index) => (
                    <div
                        key={step.id}
                        className={`course-step-card ${step.is_completed ? "completed" : "available"}`}
                    >
                        <div className="course-step-content">
                            <h5 className={`course-step-title ${step.is_completed ? "line-through" : ""}`}>
                                {index + 1}. {step.title}
                            </h5>
                            <p className="course-step-status">
                                {step.is_completed ? "Этап завершён" : "Этап доступен"}
                            </p>
                        </div>
                        <div className="course-step-actions">
                            <button
                                className={`course-step-button ${
                                    step.is_completed ? "completed-button" : "start-button"
                                }`}
                                disabled={step.is_completed}
                                onClick={() => handleStartStep(step.id)}
                            >
                                {step.is_completed ? "Пройден" : "Начать этап"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CourseSteps;
