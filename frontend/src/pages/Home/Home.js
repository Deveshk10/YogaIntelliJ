import React from 'react'
import { Link } from 'react-router-dom'
import Carousel from "react-elastic-carousel";
import Item from "./Item";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faGithub  } from '@fortawesome/free-brands-svg-icons';
import './Home.css'
import { useSelector } from 'react-redux';
import { selectUsers } from '../../store/usersSlice';
import Signup from '../Sign Up/Signup';
import Profile from '../Profile/Profile';
import { auth } from '../../Firebase/firebase-config';
import { signOut } from '@firebase/auth';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/usersSlice';
import user1Image from "../../images/profile.png"
import user4Image from "../../images/user4Image.jpeg"
import user3Image from "../../images/user3Image.jpeg"
import user2Image from "../../images/user2Image.jpeg"

const KeyFeatureCard = ({ title, description }) => {
    return (
        <div className="key-feature-card">
            <h3>{title}</h3>
            <p>{description}</p>
        </div>
    );
};
const breakPoints = [
    { width: 1, itemsToShow: 1 },
    { width: 550, itemsToShow: 1 },
    { width: 768, itemsToShow: 1 },
    { width: 1200, itemsToShow: 1 },
  ];

export default function Home() {
    const dispatch = useDispatch();
    function handleSignOut(){
        if(window.confirm('Are you sure you want to log out?')){

            signOut(auth)
        .then(() => {
            dispatch(setUser(null))
        })
        .catch((error)=> {
            console.log(error);
        })
        }
        else{

        }
        
    }

    

    const user = useSelector(selectUsers);
    
    if (user.currentUser) {
        console.log(user.currentUser.email);
        // User is signed up or logged in, show the Home content
        return (
            <div className='cont'>
                <div className='home-container'>
                <div className='home-header'>
    <h1 className='home-heading'>YogAlign</h1>
    
    <div className="navbar">
        <Link to={`/profile/${user.currentUser.email}`}>
            <button className="nav-btn" id="profile-btn">Profile</button>
        </Link>
        <Link to='#'>
            <button onClick={handleSignOut} className="nav-btn" id="sign-out-btn">Sign Out</button>
        </Link>
    </div>
</div>

    
                
                <div className="home-main">
                <h1 className="description">A Yoga AI Trainer</h1>
                    <div className="btn-section">
                        <Link to={`/start/${user.currentUser.email}`}>
                            <button
                                className="start-btn "
                            >Let's Start</button>
                        </Link>
                        <Link to='/tutorials'>
                            <button
                                className="start-btn"
                            >Tutorials</button>
                        </Link>
    
                    </div>
                </div>
    
                <div className="home-main2">
                    <div className="info-section">
                        <h2>What is YogAlign?</h2>
                        <p>YogAlign is an AI-powered yoga trainer that provides personalized yoga sessions tailored to your needs and goals.</p>
                    </div>

    
    
    
                    <div className="feature-section">
        <h2>Key Features</h2>
        <div className="feature-cards">
            <div className="feature-card">
                <h3>Personalized yoga sessions</h3>
                <p>Get yoga sessions tailored to your needs and goals.</p>
            </div>
            <div className="feature-card">
                <h3>Real-time feedback and guidance</h3>
                <p>Receive immediate feedback and guidance during your yoga practice.</p>
            </div>
            <div className="feature-card">
                <h3>Progress tracking and analytics</h3>
                <p>Track your progress and analyze your performance over time.</p>
            </div>
            <div className="feature-card">
                <h3>Access to a library of yoga poses and sequences</h3>
                <p>Explore a comprehensive library of yoga poses and sequences.</p>
            </div>
        </div>
    </div>
    
    
    <div className="benefits-section">
        <h2>Benefits of YogAlign</h2>
        <div className="benefits-cards">
            <div className="benefit-card">
                <h3>Improve flexibility and strength</h3>
                <p>YogAlign helps improve flexibility and strength through personalized yoga sessions.</p>
            </div>
            <div className="benefit-card">
                <h3>Reduce stress and anxiety</h3>
                <p>Using YogAlign can reduce stress and anxiety levels with tailored yoga practices.</p>
            </div>
            <div className="benefit-card">
                <h3>Enhance mindfulness and relaxation</h3>
                <p>YogAlign promotes mindfulness and relaxation with guided yoga sessions.</p>
            </div>
            <div className="benefit-card">
                <h3>Boost overall well-being</h3>
                <p>Regular use of YogAlign contributes to overall well-being by improving physical and mental health.</p>
            </div>
        </div>
    </div>

    <h2>Testimonials</h2>
                    <div className="testimonial-section">
                    
                    <Carousel>
      <Item style={{ backgroundColor: "#FDF4F5" }} className="testimonial-item">
        <div className="testimonial">
        
          <img src={user1Image} alt="User 1" className="user-image" />
          <p>{"YogAlign has improved my flexibility and mindfulness. I can feel the positive impact on my overall well-being."}</p>
          <span>- {"Simran"}</span>
        </div>
      </Item>
      <Item style={{ backgroundColor: "#D2E0FB" }} className="testimonial-item">
        <div className="testimonial">
          <img src={user2Image} alt="User 2" className="user-image" />
          <p>{"YogAlign has transformed my yoga practice. I feel more confident and stronger with each session."}</p>
          <span>- {"Rohan"}</span>
        </div>
      </Item>
      <Item style={{ backgroundColor: "#F9F5F6" }} className="testimonial-item">
        <div className="testimonial">
          <img src={user3Image} alt="User 3" className="user-image" />
          <p>{"YogAlign has elevated my yoga practice to new heights, leaving me feeling confident and empowered after each session"}</p>
          <span>- {"Mihir"}</span>
        </div>
      </Item>
      <Item style={{ backgroundColor: "#E3F4F4" }} className="testimonial-item">
        <div className="testimonial">
          <img src={user4Image} alt="User 4" className="user-image" />
          <p>{"YogAlign has elevated my yoga practice to new heights, leaving me feeling confident and empowered after each session"}</p>
          <span>- {"Devesh"}</span>
        </div>
      </Item>
    </Carousel>
                        
                        
                    </div>       
    <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <div className="footer-links">
                            <Link to='/about' className="footer-link">About Us</Link>
                            <Link to='/contact' className="footer-link">Contact Us</Link>
                            <Link to='/privacy' className="footer-link">Privacy Policy</Link>
                        </div>
                        <div className="social-media-icons">
                            <a href="https://www.facebook.com" className="social-icon"><FontAwesomeIcon icon={faFacebook} /></a>
                            <a href="https://www.twitter.com" className="social-icon"><FontAwesomeIcon icon={faTwitter} /></a>
                            <a href="https://www.instagram.com" className="social-icon"><FontAwesomeIcon icon={faInstagram} /></a>
                            <a href="https://www.github.com" className="social-icon"><FontAwesomeIcon icon={faGithub} /></a>
                        </div>
                    </div>
                    <p className="footer-text">&copy; 2024 YogAlign. All rights reserved.</p>
                </div>
            </footer>
                </div>
    
                
            </div>
            </div>
            
        )
      } else {
        // User is not signed up or logged in, show the Signup page
        return <Signup />;
      }
    

}








