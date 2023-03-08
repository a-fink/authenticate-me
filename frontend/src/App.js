import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restoreUser, selectUser, logout } from './app/sessionSlice';
import { Navigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Carousel from 'react-bootstrap/Carousel';

function App() {
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

  // event handler for the logout choice in the dropdown menu
  const handleLogoutClick = () => {
    dispatch(logout());
  }

  // if there is no user (null) redirect to the login page, otherwise render react components
  return (user === null) ? <Navigate to='/login' /> : (
    <>
      <Nav className='justify-content-end py-2 px-5 fs-5'>
        <NavDropdown title={
            <span className='pt-1 d-inline-flex align-items-center justify-content-evenly text-decoration-underline'>
              <ion-icon name="person" className='mt-1'></ion-icon>{user.username}
            </span>}>
          <NavDropdown.Item onClick={handleLogoutClick}>Log Out</NavDropdown.Item>
        </NavDropdown>
      </Nav>
      <Container id='homepage-container' className='d-grid'>
        <h1 className='my-5 col-10'>{`Welcome back ${user.username}`}</h1>
        <Carousel className='col-10'>
          <Carousel.Item interval={3000}>
            <img
              className='d-block w-100'
              src='https://images.unsplash.com/photo-1667508426434-73e0a68faa79?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
              alt='mountain river & forest' />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img
              className='d-block w-100'
              src='https://images.unsplash.com/photo-1491557345352-5929e343eb89?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
              alt='belgian village' />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img
              className='d-block w-100'
              src='https://images.unsplash.com/photo-1504579264001-833438f93df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80'
              alt='parrot' />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img
              className='d-block w-100'
              src='https://images.unsplash.com/photo-1500353391678-d7b57979d6d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
              alt='coffee & succulents' />
          </Carousel.Item>
          <Carousel.Item interval={3000}>
            <img
              className='d-block w-100'
              src='https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80'
              alt='colorful salad' />
          </Carousel.Item>
        </Carousel>
      </Container>
    </>

  );
}

export default App;
