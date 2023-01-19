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
    // need to use csrfFetch we built to make post request with right csrf token - need to give it a url and an options object, it will set headers for us
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(userData);

    // send the post request, parse the json response received, and return it
    // (data will be an object with a user property that holds the object of user info for user that was logged in)
    const response = await csrfFetch('/api/session', options);
    const data = await response.json();
    return data.user;
})

// async thunk for restoring a user that's already logged in
// will be used from the main application component, error handling and loading status will be handled there
export const restoreUser = createAsyncThunk('session/restore', async () => {
    // send a get request, parse the json response received, and return it (will be user object for user that was logged in, or undefined if none logged in)
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    return data.user;
})

// async thunk for creating a new user
// will be used from the signup page, error handling and loading status will be handled there
export const addNewUser = createAsyncThunk('session/addUser', async userData => {
    // userData will be an object that is the body we need to send to create the user, will have a username, email, and password
    // need to use csrfFetch we built to make post request with right csrf token - need to give it a url and an options object, it will set headers for us
    let options = {};
    options.method = 'POST';
    options.body = JSON.stringify(userData);

    // send the post request, parse the json response received, and return it (will be an object with a user property that contains the user object for user that was created)
    const response = await csrfFetch('/api/users', options);
    const data = await response.json();
    return data.user;
})

// async thunk for logging out a user
// will be used from the navigation bar button, error handling and loading status will be handled there
export const logout = createAsyncThunk('session/logout', async (_, thunkAPI) => {
    // need to use csrfFetch we built to make delete request with right csrf token - need to give it a url and an options object, it will set headers for us
    let options = {method: 'DELETE'};

    // send the delete request to clear user from backend, parse the json response received, and return it (will be an object with a success message)
    const response = await csrfFetch('/api/session', options);
    const data = await response.json();

    // dispatch the normal logout action to clear user from store
    thunkAPI.dispatch(logOutUser());
    return data;
});

// create the slice with the initial state & then build reducers
export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        logOutUser: state => {state.user = null}
    },
    // error handling / loading will be handled by the react components, so only listening for success action from async thunks here
    // the logout thunk will not get an extra reducer because the component will call the regular logout action provided no error occurs
    extraReducers(builder){
        builder.addCase(logInUser.fulfilled, (state, action) => {
            // will have the logged in user in the action.payload, set that user on state
            state.user = action.payload;
        })
        .addCase(restoreUser.fulfilled, (state, action) => {
            // if user token existed, action payload will have the user data, set that user on state
            if(action.payload !== undefined) state.user = action.payload;
        })
        .addCase(addNewUser.fulfilled, (state, action) => {
            // will have the newly created & logged in user in the action.payload, set that user on state
            state.user = action.payload;
        })
    }
})

// make and export a getter - will be used to get the user information so components do not need to know shape of state / slice, helpful if shape ever changes
// when called will return the user object that is stored in the state - outside reducers state means all of state, so need state.sliceName to get this slice, then can get thing we want
export const selectUser = (state) => state.session.user;

// export our reducer actions
export const { logOutUser } = sessionSlice.actions;

// export the full reducer itself for use by the store
export default sessionSlice.reducer;
