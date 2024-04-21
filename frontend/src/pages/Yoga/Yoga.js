import * as poseDetection from '@tensorflow-models/pose-detection';
import * as tf from '@tensorflow/tfjs';
import React, { useRef, useState, useEffect } from 'react'
import backend from '@tensorflow/tfjs-backend-webgl'
import Webcam from 'react-webcam'
import { count } from '../../utils/music'; 
 
import Instructions from '../../components/Instrctions/Instructions';

import './Yoga.css'
 
import DropDown from '../../components/DropDown/DropDown';
import { poseImages } from '../../utils/pose_images';
import { POINTS, keypointConnections } from '../../utils/data';
import { drawPoint, drawSegment } from '../../utils/helper'
import { useSelector } from 'react-redux';
import { selectUsers } from '../../store/usersSlice';
import Signup from '../Sign Up/Signup';
import { collection, query, where, getDocs, addDoc, doc,updateDoc } from 'firebase/firestore';
import { firestore } from '../../Firebase/firebase-config'; 
import { useParams } from 'react-router-dom';

let skeletonColor = 'rgb(255,255,255)'
let poseList = [
 // Added "Select Any Pose" as the first element
  'Tree', 'Chair', 'Cobra', 'Warrior', 'Dog',
  'goddess', 'padmasana', 'plank', 'savasana', 'trikosan', 'varabhadrasana', 'warrior2'
];

let interval

// flag variable is used to help capture the time when AI just detect 
// the pose as correct(probability more than threshold)
let flag = false


function Yoga() {
  const { email } = useParams();
  const [userData, setUserData] = useState(null);
  const [poseDataCreated, setPoseDataCreated] = useState(false); // State to track if pose data is created
  const user = useSelector(selectUsers);
  const webcamRef = useRef(null)
  const canvasRef = useRef(null)

  const [startingTime, setStartingTime] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [poseTime, setPoseTime] = useState(0)
  const [bestPerform, setBestPerform] = useState(0)
  const [currentPose, setCurrentPose] = useState('Tree')
  const [isStartPose, setIsStartPose] = useState(false)
  const [poseData, setPoseData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = collection(firestore, 'Users'); // Use firestore instead of db
        const q = query(userRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // Assuming your user data is stored as an object in the Firestore document
          setUserData(doc.data());
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
    const createPoseData = async () => {
      try {
        // Construct the data to be added
        const poseData = {
          email: email,
          Tree: 0, // Default values for pose counts
          Chair: 0,
          Cobra: 0,
          Warrior: 0,
          Dog: 0,
          goddess: 0,
          padmasana: 0,
          plank: 0,
          savasana: 0,
          trikosan: 0,
          varabhadrasana: 0,
          warrior2: 0
        };

        // Add the document to the "Poses" collection
        await addDoc(collection(firestore, 'Poses'), poseData);
        setPoseDataCreated(true); // Update state to indicate pose data is created
      } catch (error) {
        console.error('Error creating pose data:', error);
      }
    };

    const checkPoseDataExists = async () => {
      try {
        const posesRef = collection(firestore, 'Poses');
        const q = query(posesRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Pose data already exists, no need to create a new document
          setPoseDataCreated(true);
        } else {
          // Pose data doesn't exist, create a new document
          createPoseData();
        }
      } catch (error) {
        console.error('Error checking pose data existence:', error);
      }
    };

    if (userData && !poseDataCreated) {
      checkPoseDataExists();
    }
  }, [userData, email, poseDataCreated]);

  useEffect(() => {
    const updatePoseCount = async () => {
      try {
        if (userData) {
          const poseRef = doc(firestore, 'Poses', email);
          const updatedPoseData = {
            [currentPose]: bestPerform // Update the corresponding pose count with the new best performance time
          };
          await updateDoc(poseRef, updatedPoseData);
        }
      } catch (error) {
        console.error('Error updating pose count:', error);
      }
    };

    if (userData && bestPerform > 0) {
      updatePoseCount();
    }
  }, [bestPerform, currentPose, email, userData]);
  

  useEffect(() => {
    const fetchPoseData = async () => {
      try {
        const posesRef = collection(firestore, 'Poses');
        const q = query(posesRef, where('email', '==', email));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // Assuming there's only one document for each email
          setPoseData(doc.data());
          console.log('Pose Data:', doc.data()); // Log the fetched data
        });
      } catch (error) {
        console.error('Error fetching pose data:', error);
      }
    };

    if (email) {
      fetchPoseData();
    }
  }, [email]);
  
  

  useEffect(() => {
    const timeDiff = (currentTime - startingTime)/1000
    if(flag) {
      setPoseTime(timeDiff)
    }
    if((currentTime - startingTime)/1000 > bestPerform) {
      setBestPerform(timeDiff)
    }
  }, [currentTime])


  useEffect(() => {
    setCurrentTime(0)
    setPoseTime(0)
    setBestPerform(0)
  }, [currentPose])

  const CLASS_NO = {
    Chair: 0,
    Cobra: 1,
    Dog: 2,
    No_Pose: 3,
    Tree: 4,
    Warrior: 5,
    goddess: 6,
    padmasana: 7,
    plank: 8,
    savasana: 9,
    trikosan: 10,
    varabhadrasana: 11,
    warrior2: 12
  }

  function get_center_point(landmarks, left_bodypart, right_bodypart) {
    let left = tf.gather(landmarks, left_bodypart, 1)
    let right = tf.gather(landmarks, right_bodypart, 1)
    const center = tf.add(tf.mul(left, 0.5), tf.mul(right, 0.5))
    return center
    
  }

  function get_pose_size(landmarks, torso_size_multiplier=2.5) {
    let hips_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    let shoulders_center = get_center_point(landmarks,POINTS.LEFT_SHOULDER, POINTS.RIGHT_SHOULDER)
    let torso_size = tf.norm(tf.sub(shoulders_center, hips_center))
    let pose_center_new = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center_new = tf.expandDims(pose_center_new, 1)

    pose_center_new = tf.broadcastTo(pose_center_new,
        [1, 17, 2]
      )
      // return: shape(17,2)
    let d = tf.gather(tf.sub(landmarks, pose_center_new), 0, 0)
    let max_dist = tf.max(tf.norm(d,'euclidean', 0))

    // normalize scale
    let pose_size = tf.maximum(tf.mul(torso_size, torso_size_multiplier), max_dist)
    return pose_size
  }

  function normalize_pose_landmarks(landmarks) {
    let pose_center = get_center_point(landmarks, POINTS.LEFT_HIP, POINTS.RIGHT_HIP)
    pose_center = tf.expandDims(pose_center, 1)
    pose_center = tf.broadcastTo(pose_center, 
        [1, 17, 2]
      )
    landmarks = tf.sub(landmarks, pose_center)

    let pose_size = get_pose_size(landmarks)
    landmarks = tf.div(landmarks, pose_size)
    return landmarks
  }

  function landmarks_to_embedding(landmarks) {
    // normalize landmarks 2D
    landmarks = normalize_pose_landmarks(tf.expandDims(landmarks, 0))
    let embedding = tf.reshape(landmarks, [1,34])
    return embedding
  }

  const runMovenet = async () => {
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};
    const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
    const poseClassifier = await tf.loadLayersModel('https://yogaposeestimation.blob.core.windows.net/demo2/model.json')
    const countAudio = new Audio(count)
    countAudio.loop = true
    interval = setInterval(() => { 
        detectPose(detector, poseClassifier, countAudio)
    }, 100)
  }

  const detectPose = async (detector, poseClassifier, countAudio) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      let notDetected = 0 
      const video = webcamRef.current.video
      const pose = await detector.estimatePoses(video)
      const ctx = canvasRef.current.getContext('2d')
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      try {
        const keypoints = pose[0].keypoints 
        let input = keypoints.map((keypoint) => {
          if(keypoint.score > 0.4) {
            if(!(keypoint.name === 'left_eye' || keypoint.name === 'right_eye')) {
              drawPoint(ctx, keypoint.x, keypoint.y, 8, 'rgb(255,255,255)')
              let connections = keypointConnections[keypoint.name]
              try {
                connections.forEach((connection) => {
                  let conName = connection.toUpperCase()
                  drawSegment(ctx, [keypoint.x, keypoint.y],
                      [keypoints[POINTS[conName]].x,
                       keypoints[POINTS[conName]].y]
                  , skeletonColor)
                })
              } catch(err) {

              }
              
            }
          } else {
            notDetected += 1
          } 
          return [keypoint.x, keypoint.y]
        }) 
        if(notDetected > 4) {
          skeletonColor = 'rgb(255,255,255)'
          return
        }
        const processedInput = landmarks_to_embedding(input)
        const classification = poseClassifier.predict(processedInput)

        classification.array().then((data) => {         
          const classNo = CLASS_NO[currentPose]
          console.log(data[0][classNo])
          if(data[0][classNo] > 0.97) {
            
            if(!flag) {
              countAudio.play()
              setStartingTime(new Date(Date()).getTime())
              flag = true
            }
            setCurrentTime(new Date(Date()).getTime()) 
            skeletonColor = 'rgb(0,255,0)'
          } else {
            flag = false
            skeletonColor = 'rgb(255,255,255)'
            countAudio.pause()
            countAudio.currentTime = 0
          }
        })
      } catch(err) {
        console.log(err)
      }
      
      
    }
  }

  function startYoga(){
    setIsStartPose(true) 
    runMovenet()
  } 

  function stopPose() {
    setIsStartPose(false)
    clearInterval(interval)
  }

    

  if(isStartPose) {

    return (
      <div className='cont'>
        <div className="yoga-container">
        <div className="performance-container">
            <div className="pose-performance">
              <h4>Pose Time: {poseTime} s</h4>
            </div>
            <div className="pose-performance">
              {/* <h4>Best: {bestPerform} s</h4> */}
              <h4>Best: {poseData && poseData[currentPose]} s</h4>
            </div>
          </div>
        <div>
          
          <Webcam 
          width='640px'
          height='480px'
          id="webcam"
          ref={webcamRef}
          style={{
            position: 'absolute',
            left: 120,
            top: 100,
            padding: '0px',
          }}
        />
          <canvas
            ref={canvasRef}
            id="my-canvas"
            width='640px'
            height='480px'
            style={{
              position: 'absolute',
              left: 120,
              top: 100,
              zIndex: 1
            }}
          >
          </canvas>
        <div>
            <img 
              src={poseImages[currentPose]}
              className="pose-img"
            />
          </div>
         
        </div>
        <button
          onClick={stopPose}
          className="srt-btn"    
        >Stop Pose</button>
      </div>
      </div>
    )
  }

    if (user.currentUser) {
      return (
        <div
          className="yoga-container"
        >
          <DropDown
            poseList={poseList}
            currentPose={currentPose}
            setCurrentPose={setCurrentPose}
          />
          <Instructions
              currentPose={currentPose}
            />
          <button
              onClick={startYoga}
              className="srt-btn"    
            >Start Pose</button>
        </div>
      )
    }
    else {
        window.alert("Please SignUP first")
        return <Signup />;
      }

}

export default Yoga