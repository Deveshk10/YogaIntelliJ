import React from 'react'

import './Tutorials.css'

import { tutorials, fixCamera } from '../../utils/data'
import { useSelector } from 'react-redux';
import { selectUsers } from '../../store/usersSlice';
import Signup from '../Sign Up/Signup';


export default function Tutorials() {
   
    const user = useSelector(selectUsers);
    if (user.currentUser) {
        return (
            <div className="tutorials-container">
                <h1 className="tutorials-heading">Basic Tutorials</h1>
                <div className="tutorials-content-container">
                    {tutorials.map((tutorial) => (
                        <p className="tutorials-content">{tutorial}</p>
                    ))}
                </div>
                <h1 className="tutorials-heading">Camera Not Working?</h1>
                <div className="tutorials-content-container">
                    {fixCamera.map((points) => (
                        <p className="tutorials-content">{points}</p>
                    ))}
                </div>
                
            </div>
        )
    }
    else {
        window.alert("Please SignUP first")
        return <Signup />;
      }
}
