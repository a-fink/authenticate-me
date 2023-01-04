import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { csrfFetch } from './csrf';

// our session will hold the user information for the current session - initial state when no user is logged in is a null user
const initialState = {
    user: null
}

// when we have a logged in user state will look like this instead
// {
//     user: {
//         id,
//         email,
//         username,
//         createdAt,
//         updatedAt
//     }
// }

// async thunk for logging in
// logging in only happens in one component so error handling and loading status will be handled there
export const logInUser = createAsyncThunk('session/login', async userData => {
    // userData will be an object that is the body we need to send to login, will have a credential and a password
    // need to use csrfFetch we built to make post request with right csrf token - need to give it a url and an options object
    // it will set the headers for us, so we can just give options a method of POST and the json of the user data for body
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(userData);

    console.log('in logInUser thunk');
    console.log(options);

    // send the post request, parse the json response received, and return it (will be user object for user that was logged in)
    const response = await csrfFetch('/api/session', options);
    const user = await response.json();
    return user;
})

// async thunk for restoring a user that's already logged in
// will be used from the main application component, error handling and loading status will be handled there
export const restoreUser = createAsyncThunk('session/restore', async () => {
    // send a get request, parse the json response received, and return it (will be user object for user that was logged in, or undefined if none logged in)
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    return data.user;
})


// create the slice with the initial state & then build reducers
export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        logOutUser: state => {state.user = null}
    },
    // error handling / loading will be handled by the login & app components, so only listening for success action from async thunks here
    extraReducers(builder){
        builder.addCase(logInUser.fulfilled, (state, action) => {
            // will have the logged in user in the action.payload, set that user on state
            console.log(`login user extra reducer case hit`);
            console.log(state);
            console.log(action)
            state.user = action.payload;
        })
        .addCase(restoreUser.fulfilled, (state, action) => {
            // if user token existed, action payload will have the user data, otherwise it will have undefined
            // provided user data is there, set the user state to hold the user data
            console.log('restore user extra reducer case hit');
            console.log(state);
            console.log(action);
            if(action.payload !== undefined) state.user = action.payload;
        });
    }
})

// make and export a getter - will be used to get the user information so components do not need to know shape of state / slice, helpful if shape ever changes
// when called will return the user object that is stored in the state - outside reducers state means all of state, so need state.sliceName to get this slice, then can get thing we want
export const selectUser = (state) => state.session.user;

// export our reducer actions
export const { logOutUser } = sessionSlice.actions;

// export the full reducer itself for use by the store
export default sessionSlice.reducer;
