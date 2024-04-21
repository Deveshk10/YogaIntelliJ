import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
    const [showAuthButtons, setShowAuthButtons] = useState(false);
    const [blurText, setBlurText] = useState(false);

    const toggleAuthButtons = () => {
        setShowAuthButtons(!showAuthButtons);
        setBlurText(true);
    };

    return (
        <div className="welcome-page">
            {showAuthButtons && <div className="blur-background"></div>} {/* Conditionally render the blur effect */}
            <h1 className={blurText ? "blur-text" : ""}>Welcome to YogAlign</h1>
            <p className={blurText ? "blur-text" : ""}>Train with our AI to improve your yoga poses and achieve better results.</p>

            <div className="btn-container">
                {showAuthButtons ? (
                    <>
                        <Link to="/signin">
                            <button className="btn">Sign In</button>
                        </Link>
                        <Link to="/signup">
                            <button className="btn btn-secondary">Sign Up</button>
                        </Link>
                    </>
                ) : (
                    <>
                        <button className="btn" onClick={toggleAuthButtons}>Get Started</button>
                        <Link to="/about">
                            <button className="btn btn-secondary">Learn More</button>
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default Welcome;
