import {createSlice} from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

export const usersSlice = createSlice({
    name: 'users',
    initialState:{
        currentUser: null
    },
    reducers:{
        setUser: (users, action) => {
            users.currentUser = action.payload;
        }
    }
})

export const {setUser} = usersSlice.actions;

export const selectUsers = state => state.users;

export default usersSlice.reducer;


export const selectCurrentUser = createSelector(
    [selectUsers],
    (users) => users.currentUser // Only include the `currentUser` object in the selector output
  );