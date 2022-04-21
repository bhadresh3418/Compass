import React from 'react'
import "./navbar.scss";
import {
  Navbar,
  Container,
  Nav,
  Image
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/slices/authReducer';

const NavigationBar = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  }
  return (
    <div className="navbarContainer">
      <div className="position-fixed top-0 start-50 translate-middle-x">
        <img className="brandLogo" src={`/logo192.png`} />

      </div>
      <Navbar fixed="top" variant="dark">
        <Container fluid>
          <Nav>
            <Nav.Link className="navlink_font" >
              <Link to="/">Home </Link>
            </Nav.Link>
            <Nav.Link className="navlink_font" >
              <Link to="/">Blog</Link>
            </Nav.Link>
          </Nav>

          <Nav>
            <Nav.Link className="navlink_fontright">
              <Link to="/">Gallery </Link>
            </Nav.Link>
            <Nav.Link className="navlink_fontright">
              <Link to="/">Work</Link>
            </Nav.Link>
            <Nav.Link className="navlink_fontright">
              <Link to="/">Contact</Link>
            </Nav.Link>
            <Nav.Link className="navlink_fontright">
              {
                auth.isAuthenticated ? <div onClick={handleLogout}>logout</div> : <Link to="/login">login</Link>
              }
            </Nav.Link>
          </Nav>

        </Container>
      </Navbar>
    </div>


  )
}

export default NavigationBar