const API_URL = 'https://devayin.ru/api';

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
