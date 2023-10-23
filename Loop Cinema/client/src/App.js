import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Review from './pages/Review';
import Register from './pages/Register';
import LogIn from './pages/LogIn';
import UserContext from './tools/UserContext';
import React, { useState, useEffect } from 'react';
import Profile from './pages/Profile';
import ReviewHistory from './pages/ReviewHistory';
import Auth from './tools/Auth';
import Booking from './pages/Booking';

function App() {  

  const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('user');
        if (loggedInUser) {
            const foundUser = JSON.parse(loggedInUser);
            setUser(foundUser);
        }
    }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Header/>
        <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/reviews/:movieId' element={<Review />} />
        <Route path="/user-reviews/:userEmail" element={<Auth><ReviewHistory /></Auth>} />
        <Route path="/bookings/:movieId" element={<Booking />} />
        <Route path='/profile' element={<Auth><Profile /></Auth>} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<LogIn />} />
        </Routes>
      </Router>
  
    </UserContext.Provider>
  );
}

export default App;
