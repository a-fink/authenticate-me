import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// our session will hold the user information for the current session - initial state when no user is logged in is a null user
// will also have status & error because we're pulling this from an external source (our backend) want to know status of promise & if anything went wrong
const initialState = {
    user: null,
    status: 'idle', // can be -> idle | loading | succeeded | failed
    error: null
}

// async thunk for logging in



// create the slice with the initial state & then build reducers
export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {

    }
})

// make and export a getter - will be used to get the user information so components do not need to know shape of state / slice, helpful if shape ever changes
// when called will return the user object that is stored in the state - CONFIRM THIS, MIGHT NEED TO BE state.user.user
export const selectUser = (state) => state.user;

// export our reducer actions
export const {/* REDUCER NAMES HERE*/} = sessionSlice.actions;

// export the full reducer itself for use by the store
export default sessionSlice.reducer;
