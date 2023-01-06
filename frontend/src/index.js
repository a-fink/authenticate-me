import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import LoginFormPage from './components/LoginFormPage';
import SignupFormPage from './components/SignupFormPage';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { restoreCSRF, csrfFetch } from './app/csrf';
import { logInUser, logOutUser, restoreUser, addNewUser } from './app/sessionSlice';

// in DEVELOPMENT only -> used for testing everything is correctly connected
if(process.env.NODE_ENV !== 'production'){
  // run the restoreCSRF function to get the cookies set properly
  restoreCSRF();

  // expose the redux store & the csrfFetch & sessionActions method on the window
  window.store = store;
  window.csrfFetch = csrfFetch;
  window.logInUser = logInUser;
  window.logOutUser = logOutUser;
  window.restoreUser = restoreUser;
  window.addNewUser = addNewUser;
}



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
          <Route path='/login' element={<LoginFormPage />} />
          <Route path='/signup' element={<SignupFormPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
