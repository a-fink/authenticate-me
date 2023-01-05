import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser, selectUser } from './app/sessionSlice';
import { Navigate } from 'react-router-dom';

function App() {
  // attempt to get the user from the store (if not logged in, or page has been refreshed it will be null)
  const user = useSelector(selectUser);

  // set up the ability to dispatch actions
  const dispatch = useDispatch();

  // use the useEffect hook to have this run on first load of this component
  // give useEffect dependency of dispatch to prevent react warnings
  // if no user in store attempt to load the user from the cookies
  useEffect(() => {
    if(user === null){
      // try to dispatch the restoreUser action, if an error occurs log it to the console
      try{
        // unwrap provided by Redux Toolkit & allows us to see fulfilled/rejected status, will throw error on rejected
        dispatch(restoreUser()).unwrap();
      }
      catch(err){
        console.error(err);
      }
    }
  }, [dispatch, user]);

  // if user was restored successfully (not null), display the hello message, otherwise redirect them to the login page
  return (user !== null) ? <h1>Hello from App</h1> : <Navigate to='/login' />
}

export default App;
