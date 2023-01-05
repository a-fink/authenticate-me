import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logInUser, selectUser, restoreUser } from '../../app/sessionSlice';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './login-form-page.css';

function LoginFormPage(){
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


    // states specific to this component, user entered data, both start as empty string
    const [credential, setCredential] = useState('');
    const [password, setPassword] = useState('');

    // state to hold status of login process - idle | pending
    const [logInStatus, setLogInStatus] = useState('idle');

    // submission handler for the form, prevent default form behavior so we can control what happens
    // button will only be active if both fields have data, so only need to check for login status of idle (so we don't try again if already in progress)
    const formSubmitHandler = async (event) => {
        event.preventDefault();

        // provided both have input, we only want to attempt a login if our current status is idle (don't want to try again when already running)
        if(logInStatus === 'idle'){
            // construct the user object we will send to the async login thunk
            const userData = {};
            userData.credential = credential;
            userData.password = password;

            console.log(`before submitting, userData is `, userData);

            try{
                // set status to pending
                setLogInStatus('pending');
                // dispatch login action
                // unwrap provided by Redux Toolkit & allows us to see fulfilled/rejected status, will throw error on rejected
                await dispatch(logInUser(userData)).unwrap();
                // TEMP alert user that login succeeded
                alert('login successful')
            }
            catch(err){
                // alert the user that the login attempt failed
                alert('Credentials unable to be verified, please try again');
                // TEMP - while in dev log the error
                console.error(err);
            }
            finally{
                // in either case set state of fields back to default empty string & login status back to idle
                setCredential('');
                setPassword('');
                setLogInStatus('idle');
            }
        }
    }

    // change handler for credential input field
    const credentialChangeHandler = (event) => {
        setCredential(event.target.value);
    }

    // change handler for password field
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    // if a user already exists redirect them to the home page otherwise render the login component
    return (user !== null) ? <Navigate to='/' /> : (
        <Container id='login-container' className='d-grid h-100'>
            <Form className='w-50' onSubmit={formSubmitHandler}>
                <h1 className='text-center mb-5'>Please sign in</h1>
                <Form.Group controlId='formCredential' className='mb-3 fs-5'>
                    <Form.Label className='label'>Email or Username</Form.Label>
                    <Form.Control
                        type='text'
                        value={credential}
                        name='credential'
                        placeholder='Email or Username'
                        onChange={credentialChangeHandler}
                    />
                </Form.Group>
                <Form.Group controlId='formPassword' className='fs-5'>
                    <Form.Label className='label'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        name='password'
                        placeholder='Password'
                        onChange={passwordChangeHandler}
                    />
                </Form.Group>
                {/* render button as disabled if either field is empty */}
                {(credential === '' || password === '') ? <Button className='w-100 mt-5' variant='primary' type='submit' disabled>Submit</Button> : <Button className='w-100 mt-5' variant='primary' type='submit'>Submit</Button>}
            </Form>
        </Container>
    );
}

export default LoginFormPage;
