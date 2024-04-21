import React from 'react';
import './About.css';

export default function About() {
    return (
        <div className="about-container">
            
            <div className="about-main">
                <p className="about-content">
                    This is a real-time AI-based Yoga Trainer which detects your pose and evaluates your performance.
                    It was developed as a group project, aiming to provide a platform for users to improve their yoga practice with AI assistance.
                    The project is open-source and available on GitHub - <a href="">https://github.com/</a>.
                    
                    The AI system predicts keypoints or coordinates of different body parts in an image and utilizes a classification model to identify yoga poses.
                    When the AI detects a pose with over 96% probability, it provides feedback by highlighting the virtual skeleton in green, indicating correct alignment.
                    The pose detection model is based on Tensorflow's pretrained Movenet Model, and a neural network is built on top of it to classify yoga poses.

                    The model training was conducted using Python, and leveraging TensorFlowJS, the Keras/Tensorflow model was converted to TensorFlowJS for browser support.
                </p>
                <div className="developer-info">
                    <h4>About Developers</h4>
                    <p className="about-content">The Yoga Trainer project was developed collaboratively by a group of developers passionate about technology and AI.
                        The aim was to create an accessible tool for individuals to enhance their yoga practice through AI guidance.
                    </p>
                    {/* <h4>Contact</h4> */}
                </div>
            </div>
        </div>
    );
}

