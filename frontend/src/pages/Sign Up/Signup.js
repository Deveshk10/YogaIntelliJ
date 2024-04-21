import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Signup.css';
import {useDispatch} from 'react-redux';
import {setUser} from "../../store/usersSlice"
import { v4 as uuidv4 } from 'uuid';
import { auth, firestore } from '../../Firebase/firebase-config';
import { createUserWithEmailAndPassword, onAuthStateChanged } from '@firebase/auth';
import { getFirestore, collection, addDoc } from "@firebase/firestore";

export default function Signup() {

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


  let isUnmounted = false;

  function handleSignUp(e) {
    e.preventDefault();
    setError("");
  
    const { email, password, firstName, lastName, phoneNumber, birthDate } = userCredentials;
  
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
  
        // Store additional user details in Firestore
        saveDataToFirestore(firstName, lastName, phoneNumber, birthDate, user.uid)
          .then(() => {
            // Navigate to the "/signin" page only after storing user details and checking that the component is still mounted
            if (!isUnmounted) {
              navigate("/", { replace: true });
            }
          });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (!isUnmounted) {
          setError(errorMessage);
        }
      });
  }
  
  const saveDataToFirestore = async (firstName, lastName, phoneNumber, birthDate, userId) => {
    const randomId = uuidv4();
    const db = getFirestore();
    const docRef = await addDoc(collection(db, "Users"), {
      id: randomId,
      email: userCredentials.email,
      password: userCredentials.password,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
      birthDate: birthDate,
      userId: userId
    });
    alert("Document written to Database");
  }
  
  // Cleanup function to set the isUnmounted flag when the component is unmounted
  useEffect(() => {
    return () => { isUnmounted = true; };
  }, []);

    return (
      <div className="signup-container">
        <main className="signup-main">
          <section className="signup-section">
            <div className="signup-header">
              <h1 className="signup-heading">Welcome</h1>
            </div>
            <div className="signup-form-wrapper">
              <form className="signup-form">
                <div className="signup-form-group">
                <label htmlFor="firstName" className="signup-label">First Name <span className="required">*</span></label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="Enter your first name"
                  onChange={(e) => {handleCredentials(e)}}
                  className="signup-input"
                  name='firstName'
                  required
                />
              </div>
              <div className="signup-form-group">
                <label htmlFor="lastName" className="signup-label">Last Name <span className="required">*</span></label>
              <input
                  id="lastName"
                  type="text"
                  placeholder="Enter your last name"
                  onChange={(e) => {handleCredentials(e)}}
                  className="signup-input"
                  name='lastName'
                  required
                />
              </div>
              <div className="signup-form-group">
                <label htmlFor="phoneNumber" className="signup-label">Phone Number <span className="required">*</span></label>
                <input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  onChange={(e) => {handleCredentials(e)}}
                  className="signup-input"
                  name='phoneNumber'
                  required
                />
              </div>
              <div className="signup-form-group">
                <label htmlFor="birthDate" className="signup-label">Birth Date <span className="required">*</span></label>
                <input
                  id="birthDate"
                  type="date"
                  onChange={(e) => {handleCredentials(e)}}
                  className="signup-input"
                  name='birthDate'
                  required
                />
              </div>
                <div className="signup-form-group">
                  <label htmlFor="email" className="signup-label">Email <span className="required">*</span></label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    // value={email}
                    onChange={(e) => {handleCredentials(e)}}
                    className="signup-input"
                    name='email'
                    required
                  />
                </div>
                <div className="signup-form-group">
                  <label htmlFor="password" className="signup-label">Password <span className="required">*</span></label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    // value={password}
                    className="signup-input"
                    onChange={(e) => {handleCredentials(e)}}
                    name='password'
                    required
                  />
                </div>
                <div className="signup-form-group">
                  <button onClick={(e) => {handleSignUp(e)}}type="submit" className="signup-btn">Sign up</button>
                </div>

                {
                  error && 
                  <div className='error'>
                    {error}
                  </div>
                }
              </form>
              <div className="signup-footer">
                <p className="signup-footer-text">Already have an account? <Link to="/signin" className="signup-footer-link">Sign in</Link></p>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
}
