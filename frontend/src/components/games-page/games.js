import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './games.css'
import NF from '../../img/4.webp'
import img1 from '../../img/games/1.jpg'
import img2 from '../../img/games/2.jpg'
import img3 from '../../img/games/3.jpg'
import img4 from '../../img/games/4.jpg'
import img5 from '../../img/games/5.jpg'
import img6 from '../../img/games/6.jpg'

const GamesPage = () => {
    const navigate = useNavigate();
    return (
        <div className='game_section'>
            <div className='game_content'>
                <div className='age_group'><h2>Для всех возрастов</h2><a>(0+)</a></div>
                <div className='games_group'>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={img1} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Crunchzilla</a></a>
                        <a>Язык: JavaScript</a>
                        <div className='custom'><button onClick={() => navigate('/games/crunchzilla')} className='rounded-button'>Перейти</button></div>
                    </div>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={NF} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Snake Game</a></a>
                        <a>Язык: Python</a>
                        <div className='custom'><button onClick={() => navigate('/games/snake-game')} className='rounded-button'>Перейти</button></div>
                    </div>
                </div>
                <div className='age_group'><h2>Для детей</h2><a>(8-12 лет)</a></div>
                <div className='games_group'>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={img2} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Flex Froggy</a></a>
                        <a>Язык: CSS</a>
                        <div className='custom'><button onClick={() => navigate('/games/flexfroggy')} className='rounded-button'>Перейти</button></div>
                    </div>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={img3} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Flexbox Defence</a></a>
                        <a>Язык: CSS</a>
                        <div className='custom'><button onClick={() => navigate('/games/flexbox-defence')} className='rounded-button'>Перейти</button></div>
                    </div>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={img4} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Grid Garden</a></a>
                        <a>Язык: CSS</a>
                        <div className='custom'><button onClick={() => navigate('/games/grid-garden')} className='rounded-button'>Перейти</button></div>
                    </div>
                </div>
                <div className='age_group'><h2>Для подростков</h2><a>(13-15 лет)</a></div>
                <div className='games_group'>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={img5} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Return True To Win</a></a>
                        <a>Язык: PHP</a>
                        <div className='custom'><button onClick={() => navigate('/games/return-true-to-win')} className='rounded-button'>Перейти</button></div>
                    </div>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={NF} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Elevator Saga</a></a>
                        <a>Язык: JavaScript</a>
                        <div className='custom'><button onClick={() => navigate('/games/elevator-saga')} className='rounded-button'>Перейти</button></div>
                    </div>
                </div>
                <div className='age_group'><h2>Для подростков</h2><a>(15+ лет)</a></div>
                <div className='games_group'>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={img6} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Untruster</a></a>
                        <a>Язык: JavaScript</a>
                        <div className='custom'><button onClick={() => navigate('/games/untrusted')} className='rounded-button'>Перейти</button></div>
                    </div>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={NF} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>Python Challenge</a></a>
                        <a>Язык: Python</a>
                        <div className='custom'><button onClick={() => navigate('/games/python-challenge')} className='rounded-button'>Перейти</button></div>
                    </div>
                    <div className='game_card'>
                        <div className='game_card_image'>
                            <img src={NF} alt="User" className="cropped-image"/>
                        </div>
                        <a>Название: <a className='game_name'>BitBurner</a></a>
                        <a>Язык: JavaScript</a>
                        <div className='custom'><button onClick={() => navigate('/games/bitburner')} className='rounded-button'>Перейти</button></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamesPage;