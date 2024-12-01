import React, { useState } from 'react';
import './chat.css';

const Chat = () => {
    const [activeChat, setActiveChat] = useState(null); // Хранит выбранный чат
    const [messages, setMessages] = useState({}); // Хранит сообщения для каждого чата
    const [newMessage, setNewMessage] = useState(''); // Новое сообщение для отправки

    const chats = [
        { id: 1, name: 'No Name Chat' },
        { id: 2, name: 'Python Chat' },
        { id: 3, name: 'Мобильщики' },
        { id: 4, name: 'C#-чат' },
    ];

    // Устанавливает активный чат
    const selectChat = (chatId) => {
        setActiveChat(chatId);
        if (!messages[chatId]) {
            setMessages((prevMessages) => ({ ...prevMessages, [chatId]: [] }));
        }
    };

    // Обработчик отправки нового сообщения
    const sendMessage = () => {
        if (!newMessage.trim()) return;

        setMessages((prevMessages) => ({
            ...prevMessages,
            [activeChat]: [...prevMessages[activeChat], { sender: 'user', text: newMessage }],
        }));
        setNewMessage('');
    };

    // Рендер сообщений для текущего чата
    const renderMessages = () => {
        if (!activeChat) {
            return <div className="chat_placeholder">Выберите чат, чтобы начать переписку</div>;
        }

        return (
            <div className="messages">
                {messages[activeChat]?.map((message, index) => (
                    <div
                        key={index}
                        className={`message ${message.sender === 'user' ? 'user-message' : 'chat-message'}`}
                    >
                        {message.text}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="main_section">
            <div className="main_box">
                {/* Список чатов */}
                <div className="column">
                    <div className="chat_list">
                        {chats.map((chat) => (
                            <div
                                key={chat.id}
                                className={`chat ${activeChat === chat.id ? 'selected' : ''}`}
                                onClick={() => selectChat(chat.id)}
                            >
                                <h2 className="chat_title">{chat.name}</h2>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Содержимое чата */}
                <div className="chat_content">
                    {renderMessages()}

                    {/* Поле ввода нового сообщения */}
                    {activeChat && (
                        <div className="message_input_section">
                            <input
                                type="text"
                                placeholder="Введите сообщение..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                className="message_input"
                            />
                            <button onClick={sendMessage} className="send_button">
                                Отправить
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;
