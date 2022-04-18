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
    <div>
      <div className="position-fixed top-0 start-50 translate-middle-x">
        <img className="brandLogo" src={`/logo192.png`} />
      </div>
      <Navbar fixed="top" variant="dark">
        <Container fluid>
          <Nav >
            <Link to="/about">
            <Nav.Link className="navlink_font" >Home</Nav.Link>
            </Link>
            <Link to="/about">
            <Nav.Link className="navlink_font" >Blog</Nav.Link>
            </Link>
          </Nav>

          <Nav>
            <Nav.Link className="navlink_fontright">Gallery</Nav.Link>
            <Nav.Link className="navlink_fontright">Work</Nav.Link>
            <Nav.Link className="navlink_fontright">Contact me</Nav.Link>
            <Nav.Link className="navlink_fontright">about me</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>


  )
}

export default NavigationBar