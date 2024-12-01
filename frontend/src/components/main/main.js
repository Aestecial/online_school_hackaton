import React from 'react';
import './main.css';
import img1 from '../../img/1.webp';
import img2 from '../../img/2.jpg';
import img3 from '../../img/4.webp';
import { Link } from 'react-router-dom';

const Main = () => {
    return (
        <div className='main_section'>
            <div className='main_content'>
                <h2>Добро пожаловать!</h2>
                <a>Вот чем наш сайт может быть Вам полезен:</a>
                <div className='card_catalog'>
                    <div className='card'>
                        <div className='card_image'>
                            <img src={img1} alt="User" className="cropped-image"/>
                        </div>
                        <h2>Курсы</h2>
                        <a><span className='orange_let'>Курсы</span> сделанные при помощи AI, которые повысят ваши скиллы!</a>
                        <div className='custom'>
                            <Link to="/courses">
                                <button className='rounded-button'>Перейти на вкладку</button>
                            </Link>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card_image'>
                            <img src={img2} alt="User" className="cropped-image"/>
                        </div>
                        <h2>AI-помошник</h2>
                        <a><span className='orange_let'>AI-помошник</span>, который поможет даже в самых сложных заданиях!</a>
                        <div className='custom'>
                            <Link to="/ai">
                                <button className='rounded-button'>Перейти на вкладку</button>
                            </Link>
                        </div>
                    </div>
                    <div className='card'>
                        <div className='card_image'>
                            <img src={img3} alt="User" className="cropped-image"/>
                        </div>
                        <h2>Интерактивные игры</h2>
                        <a>Множество <span className='orange_let'>игр</span> для разного уровня. Учись играя!</a>
                        <div className='custom'>
                            <Link to="/games">
                                <button className='rounded-button'>Перейти на вкладку</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Main;