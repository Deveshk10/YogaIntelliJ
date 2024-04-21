import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import store from './store/store'; // Import your Redux store
import Home from './pages/Home/Home';
import Yoga from './pages/Yoga/Yoga';
import About from './pages/About/About';
import Tutorials from './pages/Tutorials/Tutorials';
import Signin from './pages/Sign In/Signin';
import Signup from './pages/Sign Up/Signup';
import './App.css';
import { selectUsers } from './store/usersSlice';
import { useSelector } from 'react-redux';
import Profile from './pages/Profile/Profile';
import { selectCurrentUser } from './store/usersSlice';
import Welcome from './pages/Welcome/Welcome';
import Contact from "./pages/Contact/Contact"

export default function App() {

  const currentUser = useSelector(selectUsers);
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path='/welcome' element={<Welcome/>} />
          <Route path='/' element={<Home />} />
          <Route path='/start/:email' element={<Yoga />} />
          <Route path='/signin' element={<Signin />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/about' element={<About />} />
          <Route path='/tutorials' element={<Tutorials />} />
          <Route path='/profile/:email' element={<Profile />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </Router>
    </Provider>
  );
}