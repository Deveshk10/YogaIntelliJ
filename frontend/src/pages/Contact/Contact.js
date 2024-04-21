import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore'; // Import Firestore methods
import './Contact.css';
import { firestore } from '../../Firebase/firebase-config'; // Import your Firestore instance

const ContactPage = () => {
  const [feedback, setFeedback] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Save form data to Firestore
      const feedbackRef = collection(firestore, 'Feedback');
      await addDoc(feedbackRef, {
        name: name,
        email: email,
        phone: phone,
        feedback: feedback,
        timestamp: new Date().toISOString(), // Optional: Add timestamp for each entry
      });

      // Reset form fields and show success message
      alert('Thank you for your feedback!');
      setFeedback('');
      setName('');
      setEmail('');
      setPhone('');
      navigate('/');
    } catch (error) {
      console.error('Error saving feedback:', error);
      // Handle error or show error message to the user
      alert('An error occurred while saving your feedback. Please try again later.');
    }
  };

  return (
    <div className="contact-page">
      <h2>Contact Us</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="phone">Phone:</label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label htmlFor="feedback">Feedback:</label>
        <textarea
          id="feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          required
        ></textarea>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default ContactPage;
