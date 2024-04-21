import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Profile.css';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore, storage } from '../../Firebase/firebase-config'; // Assuming your Firestore instance is named 'firestore'
import { useSelector } from 'react-redux';
import { selectUsers } from '../../store/usersSlice';
import Signup from '../Sign Up/Signup';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { Link } from 'react-router-dom'

export default function Profile() {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);
  const [poseData, setPoseData] = useState(null);
  const [imgUrl, setImgUrl] = useState('');
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = collection(firestore, 'Users');
        const q = query(userRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (doc) => {
          const userData = doc.data();
          setUserData(userData);
  
          // Check if profileImage field is already present
          if (!userData.hasOwnProperty('profileImage')) {
            // Add profileImage field with the specified URL
            await updateDoc(doc.ref, { profileImage: 'https://firebasestorage.googleapis.com/v0/b/trial-ce9da.appspot.com/o/files%2Fillustration-of-human-icon-user-symbol-icon-modern-design-on-blank-background-free-vector.jpg?alt=media&token=7fa71f9b-d87f-45dd-a893-44309b91e005' });
          }
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
  
    if (email) {
      fetchUserData();
    }
  }, [email]);
  

  useEffect(() => {
    const fetchPoseData = async () => {
      try {
        const posesRef = collection(firestore, 'Poses');
        const q = query(posesRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          setPoseData(doc.data());
          console.log('Pose Data:', doc.data());
        });
      } catch (error) {
        console.error('Error fetching pose data:', error);
      }
    };

    if (email) {
      fetchPoseData();
    }
  }, [email]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const storageRef = ref(storage, `profile_images/${uuidv4()}`);

    try {
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Update user's profile image URL in Firestore based on email
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach(async (snapshot) => {
        const userDocRef = doc(firestore, 'Users', snapshot.id);
        await updateDoc(userDocRef, {
          profileImage: imageUrl,
        });
        setUserData((prevUserData) => ({
          ...prevUserData,
          profileImage: imageUrl,
        }));
      });

      setImgUrl(imageUrl); // Update the imageUrl state
    } catch (error) {
      console.error('Error uploading profile image:', error);
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const saveUserData = async () => {
    try {
      const userQuery = query(collection(firestore, 'Users'), where('email', '==', email));
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach(async (snapshot) => {
        const userDocRef = doc(firestore, 'Users', snapshot.id);
        await updateDoc(userDocRef, userData);
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const user = useSelector(selectUsers);

  return (
    <div className="profile-container black-background">
      <div className="profile-container">
        <div className="header">
          <h2>{userData ? `${userData.firstName}'s Profile` : 'Loading...'}</h2>
          {!editMode && <button className='edit-btn' onClick={toggleEditMode}>Edit</button>}
          {editMode && <button className='edit-btn' onClick={saveUserData}>Save</button>}
        </div>
        <div className="user-info">
        <h2>User Information</h2>
          {userData && (
            <div className="user-card">
              
              <div className="profile-image-container">
                <img
                  src={userData.profileImage}
                  alt="Profile"
                  height="200px"
                  width="200px"
                  onClick={() => editMode && toggleEditMode()}
                />
                {editMode && (
                  <input type="file" onChange={handleImageUpload} />
                )}
              </div>
              {!editMode && <p><strong>Email:</strong> {userData.email}</p>}
              {editMode && (
                <p><strong>Email:</strong> {userData.email}</p>
              )}
              <p><strong>First Name:</strong> {editMode ? <input value={userData.firstName} onChange={(e) => setUserData({ ...userData, firstName: e.target.value })} /> : userData.firstName}</p>
              <p><strong>Last Name:</strong> {editMode ? <input value={userData.lastName} onChange={(e) => setUserData({ ...userData, lastName: e.target.value })} /> : userData.lastName}</p>
              <p><strong>Birthdate:</strong> {editMode ? <input value={userData.birthDate} onChange={(e) => setUserData({ ...userData, birthDate: e.target.value })} /> : userData.birthDate}</p>
              <p><strong>Phone Number:</strong> {editMode ? <input value={userData.phoneNumber} onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })} /> : userData.phoneNumber}</p>
            </div>
          )}
        </div>
  
        <div className="pose-info">
          <h2>Pose Best Time</h2>
          <div className='card-cont'>
          {poseData && (
            <div className="pose-cards">
              {Object.keys(poseData).map((poseName, index) => {
                // Check if the field key is not the 12th field's key
                if (poseName !== 'email') {
                  return (
                    <div key={index} className="pose-card">
                      <p style={{ fontSize: '25px' }}>{poseName}</p>
                      <p><strong>Best Time:</strong> {poseData[poseName]}</p>
                    </div>
                  );
                }
                return null; // Exclude rendering for the 12th field
              })}
            </div>
          )}
          </div>
          <Link to='/'>
                            <button
                                className="start-btn"
                            >Back</button>
                        </Link>
        </div>

        <div className="signup-section">
          {!user.currentUser && (
            <div className="signup-message">
              <p>Please sign up first.</p>
              <Signup />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
