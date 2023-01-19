import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, restoreUser, addNewUser } from "../../app/sessionSlice";
import { Navigate, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './signup-form-page.css';

function SignupFormPage(){
    // attempt to get the user from the store (if not logged in, or page has been refreshed it will be null)
    const user = useSelector(selectUser);

    // set up the ability to dispatch actions
    const dispatch = useDispatch();

    // useEffect hook to run on first load of this component - if no user in store attempt to load the user from the cookies
    useEffect(() => {
        if(user === null){
          // try to dispatch the restoreUser action, if an error occurs do nothing
          try{
            // unwrap provided by Redux Toolkit & allows us to see fulfilled/rejected status, will throw error on rejected
            dispatch(restoreUser()).unwrap();
          }
          catch(err){
            // do nothing
          }
        }
      }, [dispatch, user]);

    // states specific to this component, user entered data, all start as empty string
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // state to hold status of errors on each field, all start as false
    const [emailError, setEmailError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

    // state to hold status of creating user process - idle | pending
    const [addUserStatus, setAddUserStatus] = useState('idle');

    // calculate a boolean to use for whether the submit button can be active - disabled if any are empty or have errors
    let hasEmptyField = (email === '') || (userName === '') || (password === '') || (confirmPassword === '');
    let hasErrors = emailError || userNameError || passwordError || confirmPasswordError;
    let canSubmit = !hasEmptyField && !hasErrors;

    // change handler for email input field - update value & error state
    const emailChangeHandler = (event) => {
        setEmail(event.target.value);

        let regEx = /\w+@\w+\.\w+/;
        setEmailError(event.target.value !== '' && !regEx.test(event.target.value));
    }

    // change handler for username input field - update value & error state
    const userNameChangeHandler = (event) => {
        setUserName(event.target.value);
        setUserNameError(event.target.value !== '' && (event.target.value.length < 4 || event.target.value.indexOf('@') !== -1));
    }

    // change handler for password input field - update value & error state
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
        setPasswordError(event.target.value !== '' && event.target.value.length < 6);
    }

    // change handler for confirm password input field - update value & error state
    const confirmPasswordChangeHandler = (event) => {
        setConfirmPassword(event.target.value);
        setConfirmPasswordError(event.target.value !== '' && event.target.value !== password);
    }

    // submission handler for the form, pevent default behavior so we can control what happens
    // button will only be active if all fields have data and the data is valid, so only need to check for status to be idle (don't send request when one already going)
    const formSubmitHandler = async (event) => {
        event.preventDefault();

        // if status is idle, we can try to submit the new user data
        if(addUserStatus === 'idle'){
            // construct the user object we will send to the async addNewUser thunk
            const userData = {};
            userData.email = email;
            userData.username = userName;
            userData.password = password;

            try{
                setAddUserStatus('pending');
                // unwrap provided by Redux Toolkit & allows us to see fulfilled/rejected status, will throw error on rejected
                await dispatch(addNewUser(userData)).unwrap();
            }
            catch(err){
                alert('Something went wrong, please try again');
            }
            finally{
                // in either case set the state of all input fields back to default empty string & status back to idle
                setEmail('');
                setUserName('');
                setPassword('');
                setConfirmPassword('');
                setAddUserStatus('idle');
            }
        }
    }

    // if a user exists (restored or created) redirect them to the home page, otherwise render the signup component
    return (user !== null) ? <Navigate to='/' /> : (
        <Container id='signup-container' className='d-grid h-100'>
            <Form className='w-50' onSubmit={formSubmitHandler}>
                <h1 className='text-center mb-5'>Create an account:</h1>
                <Form.Group controlId='formEmail' className='mb-1 fs-5'>
                    <Form.Label className='label'>Email</Form.Label>
                    <Form.Control
                        type='email'
                        value={email}
                        name='email'
                        placeholder='Email'
                        onChange={emailChangeHandler}
                    />
                </Form.Group>
                {emailError ? <div className="mb-2 fs-6 fw-light text-danger">Please enter a valid email</div> : <div className="mb-2 fs-6 fw-light invisible">Warning placeholder</div>}
                <Form.Group controlId='formUsername' className='mb-1 fs-5'>
                    <Form.Label className='label'>Username</Form.Label>
                    <Form.Control
                        type='text'
                        value={userName}
                        name='userName'
                        placeholder='Username'
                        onChange={userNameChangeHandler}
                    />
                </Form.Group>
                {userNameError ? <div className="mb-2 fw-light text-danger">Username must contain at least 4 characters and cannot be an email</div> : <div className="mb-2 fs-6 fw-light invisible">Warning placeholder</div>}
                <Form.Group controlId='formPassword' className='mb-1 fs-5'>
                    <Form.Label className='label'>Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={password}
                        name='password'
                        placeholder='Password'
                        onChange={passwordChangeHandler}
                    />
                </Form.Group>
                {passwordError ? <div className="mb-2 fw-light text-danger">Password must contain at least 6 characters</div> : <div className="mb-2 fs-6 fw-light invisible">Warning placeholder</div>}
                <Form.Group controlId='formConfirmPassword' className='mb-1 fs-5'>
                    <Form.Label className='label'>Confirm Password</Form.Label>
                    <Form.Control
                        type='password'
                        value={confirmPassword}
                        name='confirmPassword'
                        placeholder='Password'
                        onChange={confirmPasswordChangeHandler}
                    />
                </Form.Group>
                {confirmPasswordError ? <div className="mb-2 fw-light text-danger">Passwords must match</div> : <div className="mb-2 fs-6 fw-light invisible">Warning placeholder</div>}
                {/* render button as disabled if any field is empty */}
                {canSubmit ? <Button className='w-100 mt-4' variant='primary' type='submit'>Submit</Button> : <Button className='w-100 mt-4' variant='primary' type='submit' disabled>Submit</Button>}
                <div className="fs-6 text-center mt-4">Already have an account? <Link to={'/login'}>Log In</Link></div>
            </Form>
        </Container>
    );
}

export default SignupFormPage;
