import React, { useEffect } from 'react';

const GameContainer = () => {
    useEffect(() => {
        // Сохраняем текущие стили и настройки
        const originalBackground = document.body.style.background;
        const originalMargin = document.body.style.margin;
        const originalOverflow = document.body.style.overflow;

        // Убираем отступы и прокрутку, задаем фон
        document.body.style.background = 'linear-gradient(135deg, #c8e6c9, #a5d6a7)';
        document.body.style.margin = '0';
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.background = originalBackground;
            document.body.style.margin = originalMargin;
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)',
                zIndex: 9999,
            }}
        >
            <iframe
                src="/game/index.html"
                title="Game"
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
            />
        </div>
    );
};

export default GameContainer;
