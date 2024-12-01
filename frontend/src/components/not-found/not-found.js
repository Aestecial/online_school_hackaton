import React from 'react'
import { Link } from 'react-router-dom';
import './not-found.css'

const NotFound = () => {
    return (
        <div className='main_section'>
            <div className='not_found'>
                <a>Ошибка, ничего не найдено!</a>
                <Link to="/"><a className='underline'>Перейти на главную</a></Link>
            </div>
        </div>
    );
};

export default NotFound