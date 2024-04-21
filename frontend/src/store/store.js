import { configureStore } from '@reduxjs/toolkit';
import usesReducer from './usersSlice';

export default configureStore({
  reducer: {
    users: usesReducer
  }
})