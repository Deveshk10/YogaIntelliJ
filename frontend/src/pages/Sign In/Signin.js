import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Signin.css';
import { auth } from '../../Firebase/firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import {useDispatch} from 'react-redux';
import {setUser} from "../../store/usersSlice"

export default function Signin() {
  console.log(auth);

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('login');
  const [userCredentials, setUserCredentials] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  onAuthStateChanged(auth, (user) => {
    if(user){
      const uid = user.uid;
      dispatch(setUser({id: user.uid, email: user.email}))
    }
    else{
      dispatch(setUser(null))
    }
  })

  function handleCredentials(e){
    
    setUserCredentials({...userCredentials, [e.target.name]: e.target.value });
  }
  function handleLogin(e)
 {
  e.preventDefault();
    setError("")
  signInWithEmailAndPassword(auth, userCredentials.email, userCredentials.password)
  .then((userCredentials) => {
    // Signed in 
    navigate("/", { replace: true });
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
      const errorMessage = error.message;
      setError(error.message);
  });
 }
    return (
      <div className="signin-container">
      {/*  Site header */}
      {/*  Page content */}
      <main className="signin-main">
        <section className="signin-section">
          <div className="signin-wrapper">
            <div className="signin-content">
              {/* Page header */}
              <div className="signin-header">
                <h1 className="signin-heading">Welcome back</h1>
              </div>
    
              {/* Form */}
              <div className="signin-form-wrapper">
                <form className="signin-form">
                  <div className="signin-form-group">
                    <label
                      className="signin-label"
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="signin-input"
                      placeholder="Enter your email address"
                      onChange={(e) => {handleCredentials(e)}}
                      name='email'
                      // value={email}
                      required
                    />
                  </div>
                  <div className="signin-form-group">
                    <label
                      className="signin-label"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      className="signin-input"
                      placeholder="Enter your password"
                      onChange={(e) => {handleCredentials(e)}}
                      name='password'
                      // value={password}
                      required
                    />
                  </div>
                  <div className="signin-form-group">
                    <button onClick={(e) => {handleLogin(e)}}className="signin-btn">
                      Sign in
                    </button>
                  </div>
                  {
                  error && 
                  <div className='error'>
                    {error}
                  </div>
                }
                </form>
    
                <div className="signin-footer">
                  <p className="signin-footer-text">
                    Don’t have an account?{" "}
                    <Link
                      to="/signup"
                      className="signin-footer-link"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
    
    )
}
