import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/header/header';
import Main from './components/main/main';
import Login from './components/login/login';
import NotFound from './components/not-found/not-found';
import Account from './components/account/account';
import Registration from './components/registration/reg';
import Courses from './components/courses/Courses';
import CourseDetail from "./components/courses/CourseDetail";
import CourseSteps from './components/courses/CoursesSteps'; // Этапы курса
import StepDetail from './components/courses/StepDetail'; // Детали этапа
import Games from './components/games/Games';
import GamesPage from './components/games-page/games';
import SnakeGame from './components/game/GameContainer'; // Импортируем новый контейнер
import Referrals from './components/refferals/Referrals';
import Chat from './components/chat/chat';
import Ide from './components/ide/ide';
import Ai from './components/ai/ai';


function App() {
    const userToken = localStorage.getItem('access'); // Получаем токен из localStorage

    return (
        <Router>
            <div className="App">
                <Header />
                <Routes>
                    <Route path="*" element={<NotFound />} />
                    <Route path="/" element={<Main />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/account" element={<Account />} />
                    <Route path="/courses" element={<Courses />} />
                    <Route path="/courses/:id" element={<CourseDetail token={userToken} />} />
                    <Route path="/courses/:courseId/steps" element={<CourseSteps token={userToken} />} />
                    <Route path="/courses/:courseId/steps/:stepId" element={<StepDetail token={userToken} />} />
                    <Route path='/games' element={<GamesPage />}/>
                    <Route path="/games/:gameName" element={<Games />} />
                    <Route path="/games/snake" element={<SnakeGame />} />
                    <Route path="/students" element={<Referrals />} />
                    <Route path='/chats' element={<Chat />}/>
                    <Route path='/ide' element={<Ide />}/>
                    <Route path='/ai' element={<Ai />}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
