import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { Navbar, Nav, Container, Modal, Tab } from 'react-bootstrap';
import AuthForm from './AuthForm';
import { useStore } from '../store';
import { LOGOUT_USER } from '../graphql/mutations';

const AppNavbar = () => {
  // set modal display state
  const [showModal, setShowModal] = useState(false);
  const {state, setState} = useStore()!;
  const navigate = useNavigate();
  const [logoutUser] = useMutation(LOGOUT_USER);

  const handleLogout = async () => {
    await logoutUser();


    setState((oldState) => ({
      ...oldState,
      user: null
    }));

    navigate('/');
  }

  return (
    <>
      <Navbar bg='dark' variant='dark' expand='lg'>
        <Container fluid>
          <Navbar.Brand as={NavLink} to='/' className='text-light'>
            Google Books Search
          </Navbar.Brand>
          {!state.loading && (
            <Nav className='ml-auto d-flex'>
                <Nav.Link as={NavLink} to='/'>
                  Search For Books
                </Nav.Link>
                {/* if user is logged in show saved books and logout */}
                {state.user ? (
                  <>
                    <Nav.Link as={NavLink} to='/saved'>
                      See Your Books
                    </Nav.Link>
                  <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ) : (
                  <Nav.Link onClick={() => setShowModal(true)}>Login/Sign Up</Nav.Link>
                )}
              </Nav>
          )}
        </Container>
      </Navbar>
      {/* set modal data up */}
      <Modal
        size='lg'
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby='signup-modal'>
        {/* tab container to do either signup or login component */}
        <Tab.Container defaultActiveKey='login'>
          <Modal.Header closeButton>
            <Modal.Title id='signup-modal'>
              <Nav variant='pills'>
                <Nav.Item>
                  <Nav.Link eventKey='login'>Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey='signup'>Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey='login'>
                <AuthForm isLogin={true} handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
              <Tab.Pane eventKey='signup'>
                <AuthForm isLogin={false} handleModalClose={() => setShowModal(false)} />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
};

export default AppNavbar;
