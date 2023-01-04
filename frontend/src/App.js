import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser, selectUser } from './app/sessionSlice';
import { Navigate } from 'react-router-dom';

function App() {
  // set up the ability to dispatch actions
  const dispatch = useDispatch();

  // use the useEffect hook to have this run on first load of this component
  // give useEffect dependency on dispatch to prevent react warnings
  useEffect(() => {
    // try to dispatch the restoreUser action, if an error occurs log it to the console
    try{
      // unwrap provided by Redux Toolkit & allows us to see fulfilled/rejected status, will throw error on rejected
      dispatch(restoreUser()).unwrap();
    }
    catch(err){
      console.error(err);
    }
  }, [dispatch]);

  // get the user that was loaded into the store
  // will be user data if a user was found, or null if no user found or an error occured
  const user = useSelector(selectUser);

  // if user was restored successfully (not null), display the hello message, otherwise redirect them to the login page
  return (user !== null) ? <h1>Hello from App</h1> : <Navigate to='/login' />
}

export default App;
