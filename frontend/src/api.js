import axios from 'axios';

const API_URL = 'https://devayin.ru/api';
const URL = 'https://devayin.ru';

// const API_URL = 'http://127.0.0.1:8000/api';
// const URL = 'http://127.0.0.1:8000';


export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register/`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error('Ошибка сервера:', error.response.data);
            throw new Error(error.response.data.detail || 'Ошибка регистрации');
        } else {
            throw new Error('Ошибка сети. Попробуйте снова.');
        }
    }
};

export const loginUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/login/`, userData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data; // Ожидаем, что сервер вернет токен
    } catch (error) {
        if (error.response) {
            console.error('Ошибка сервера:', error.response.data);
            throw new Error(error.response.data.detail || 'Ошибка входа.');
        } else {
            throw new Error('Ошибка сети. Попробуйте позже.');
        }
    }
};

export const validateAccessToken = async (accessToken) => {
    try {
        await axios.post(`${API_URL}/token/verify/`, { token: accessToken }, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        return true;
    } catch (error) {
        throw new Error('Access токен недействителен');
    }
};

export const refreshAccessToken = async (refreshToken) => {
    try {
        const response = await axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
        return response.data; // Возвращает новые access и refresh токены
    } catch (error) {
        throw new Error('Refresh токен недействителен');
    }
};

export const getUserInfo = async (accessToken) => {
    try {
        const response = await axios.get(`${API_URL}/user-info/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        const userInfo = response.data;

        // Если avatar — это относительный путь, добавляем к нему базовый URL
        if (userInfo.avatar && !userInfo.avatar.startsWith('http')) {
            userInfo.avatar = `${URL}${userInfo.avatar}`;
        }

        return userInfo; // Возвращаем данные пользователя с полным URL для аватара
    } catch (error) {
        console.error('Ошибка получения информации о пользователе:', error.response?.data || error.message);
        throw error;
    }
};

// Получение данных курса по ID
export const getCourseById = async (courseId) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}/`);
        const course = response.data;

        // Ensure full path for the course image
        if (course.image && !course.image.startsWith('http')) {
            course.image = `${URL}${course.image}`;
        }

        return course; // Return the processed course object
    } catch (error) {
        console.error("Ошибка загрузки курса:", error.response?.data || error.message);
        throw new Error('Не удалось загрузить курс.');
    }
};

// Запись на курс
export const enrollInCourse = async (courseId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/courses/${courseId}/enroll/`,
            {}, // Пустое тело запроса
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Передача токена в заголовках
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка записи на курс:", error.response?.data || error.message);
        throw error;
    }
};

// Проверка записи на курс
export const fetchEnrollmentStatus = async (courseId, token) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}/status/`, {
            headers: {
                Authorization: `Bearer ${token}`, // Передача токена в заголовках
            },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка проверки записи на курс:", error.response?.data || error.message);
        throw error;
    }
};

export const getCourseSteps = async (courseId, token) => {
    try {
        const response = await axios.get(`${API_URL}/courses/${courseId}/steps/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка получения этапов курса:", error.response?.data || error.message);
        throw error;
    }
};

export const completeStep = async (courseId, stepId, token) => {
    try {
        const response = await axios.post(
            `${API_URL}/courses/${courseId}/steps/${stepId}/complete/`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Ошибка завершения этапа:", error.response?.data || error.message);
        throw error;
    }
};

export const getUserCourses = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/user/courses/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching user courses:", error.response?.data || error.message);
        throw error;
    }
};

export const getAllAchievements = async () => {
    try {
        const response = await axios.get(`${API_URL}/achievements/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching all achievements:', error.response?.data || error.message);
        throw error;
    }
};

export const assignAchievement = async (token, achievementTitle) => {
    try {
        const response = await axios.post(
            `${API_URL}/achievements/grant/`,
            { title: achievementTitle },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error assigning achievement:', error.response?.data || error.message);
        throw error;
    }
};

export const getUserAchievements = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/achievements/user/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const achievements = response.data;

        // Process the image URLs to ensure full paths
        achievements.forEach((entry) => {
            const achievement = entry.achievement;
            if (achievement.image && !achievement.image.startsWith('http')) {
                achievement.image = `${URL}${achievement.image}`;
            }
        });

        return achievements;
    } catch (error) {
        console.error('Error fetching user achievements:', error.response?.data || error.message);
        throw error;
    }
};

export const getCourses = async () => {
    try {
        const response = await axios.get(`${API_URL}/courses/`);
        const courses = response.data;

        // Ensure full paths for image URLs
        courses.forEach((course) => {
            if (course.image && !course.image.startsWith('http')) {
                course.image = `${URL}${course.image}`;
            }
        });

        return courses; // Return processed courses
    } catch (error) {
        console.error('Error fetching courses:', error.response?.data || error.message);
        throw new Error('Не удалось загрузить курсы.');
    }
};

// Получение рефералов
export const fetchReferrals = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/referrals/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Ошибка при загрузке рефералов:', error.response?.data || error.message);
        throw new Error('Не удалось загрузить рефералов. Попробуйте позже.');
    }
};