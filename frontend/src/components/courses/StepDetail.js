import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseSteps, completeStep } from "../../api";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { prism } from "react-syntax-highlighter/dist/esm/styles/prism"; // Syntax highlighting theme
import "./styles/markdown.css";

const customPrismTheme = {
    ...prism,
    'pre[class*="language-"]': {
        ...prism['pre[class*="language-"]'],
        background: "transparent", // Set transparent background for code blocks
        boxShadow: "none", // Remove any shadow that may be applied
        border: "none", // Remove any border for a cleaner look
    },
    'code[class*="language-"]': {
        ...prism['code[class*="language-"]'],
        background: "transparent", // Set transparent background for inline code
    },
};

const StepDetail = ({ token }) => {
    const { courseId, stepId } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(null);
    const [hiddenBlocks, setHiddenBlocks] = useState({});
    const [loading, setLoading] = useState(true); // Track loading state
    const [error, setError] = useState(null); // Track errors

    useEffect(() => {
        fetchStepDetails();
    }, [courseId, stepId, token]);

    const fetchStepDetails = async () => {
        try {
            const response = await getCourseSteps(courseId, token);
            if (response && Array.isArray(response)) {
                const currentStep = response.find((s) => s.id === parseInt(stepId));
                if (currentStep) {
                    setStep(currentStep);
                } else {
                    setError("Шаг с указанным ID не найден.");
                }
            } else {
                setError("Ответ от API не соответствует ожидаемому формату.");
            }
        } catch (error) {
            setError(error.response?.data?.error || "Ошибка загрузки этапа.");
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            await completeStep(courseId, stepId, token);
            navigate(`/courses/${courseId}/steps`);
        } catch (error) {
            setError("Ошибка завершения этапа.");
        }
    };

    const toggleBlockVisibility = (blockIndex) => {
        setHiddenBlocks((prev) => ({
            ...prev,
            [blockIndex]: !prev[blockIndex],
        }));
    };

    if (loading) return <p>Загрузка...</p>;
    if (error) return <p className="alert alert-danger">{error}</p>;
    if (!step) return <p>Данные о этапе не найдены.</p>;

    let blockCounter = 0;

    return (
        <div className="step-container mt-4">
            <div className="step-card shadow p-4">
            <div className="step-card-body">
                <h3 className="text-success text-center">{step.title}</h3>
                <hr />
                <ReactMarkdown
                    className="mt-3"
                    components={{
                        code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || "");
                            const firstLine = String(children).split("\n")[0].trim();
                            const isHidden = firstLine === "# hide";
                            const blockIndex = blockCounter++;

                            if (!inline && match) {
                                return isHidden && !hiddenBlocks[blockIndex] ? (
                                    <div className="mb-3">
                                        <button
                                            className="btn btn-outline-primary step-button"
                                            onClick={() => toggleBlockVisibility(blockIndex)}
                                        >
                                            Показать решение
                                        </button>
                                    </div>
                                ) : (
                                    <div className="mb-3 step-code-block">
                                        <SyntaxHighlighter
                                            style={customPrismTheme}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/^# hide\n/, "").replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                        {isHidden && (
                                            <button
                                                className="btn btn-outline-secondary step-button mt-2"
                                                onClick={() => toggleBlockVisibility(blockIndex)}
                                            >
                                                Скрыть решение
                                            </button>
                                        )}
                                    </div>
                                );
                            }
                            return (
                                <code className={className} {...props}>
                                    {children}
                                </code>
                            );
                        },
                    }}
                >
                    {step.content}
                </ReactMarkdown>
                <button
                    className="btn btn-success step-button mt-4"
                    onClick={handleComplete}
                >
                    Завершить этап
                </button>
            </div>
        </div>
    </div>

    );
};

export default StepDetail;
