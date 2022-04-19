import React from 'react'
import "./navbar.scss";
import {
  Navbar,
  Container,
  Nav,
  Image
} from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavigationBar = () => {
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
              <Link to="/about">about</Link>
            </Nav.Link>
          </Nav>

        </Container>
      </Navbar>
    </div>
  

  )
}

export default NavigationBar