import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { login, signUp } from '../../../api';
import "./Login.scss";
import { authenticate } from '../../../redux/slices/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => 
{
  const [input, setInput] = useState({ firstname: "", lastname: "", email: "", password: "", confirm_password: "" });
  const [loginActive, setLoginActive] = useState(true)
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const auth = useSelector(state => state.auth);

  useEffect(() => { if (auth.token && auth.isAuthenticated) { navigate("/dashboard"); } }, []);

  const handleLogin = async (e) => 
  {
    e.preventDefault();
    if (!input.email || !input.password) 
    {
      setError("All fields are required!")
      return;
    }
    const res = await login(input);
    if (res.success) 
    {
      const token = res.data.token; // this is jwt token
      dispatch(authenticate(token));
      setError(null);
      navigate("/dashboard");
    } 
    else 
    {
      setError(res.message);
    }
  }

  const handleChange = (e) => 
  {
    console.log(e.target);
    setInput({...input, [e.target.name]: e.target.value });
    console.log(input) // why is input state at this point one step behind? Ex: if I type "John", input state is "Joh"
  }

  const toogleTab = (e) => 
  {
    e.preventDefault();
    setInput({firstname: "", lastname: "", email: "", password: "", confirm_password: "" });
    setError(null);
    setLoginActive(!loginActive);
    console.log(loginActive);
  }

  const handleSignUp = async (e) => 
  {
    e.preventDefault();
    if (Object.values(input).find((value) => !value)) 
    {
      setError("All fields are required!")
      return;
    }
    const res = await signUp(input);
    if (res.success) 
    {
      const token = res.data.token;
      dispatch(authenticate(token));
      setError(null);
      navigate("/dashboard");
    } 
    else 
    {
      setError(res.message);
    }
  }

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100" >
      <Container className="m-2 m-md-5 " style={{ maxWidth: '50%' }}>
        <Row className="d-flex justify-content-center shadow-lg bg-dark" style={{ borderRadius: '20px' }}>
          <Col md={6} className={`bg-primary d-flex text-center justify-content-center align-items-center animate__animated ${loginActive ? "animate__slideInRight" : "animate__slideInLeft"}`} style={{ zIndex: 1, borderRadius: '20px' }}>
            <div style={{ color: 'white' }}>
              <img src={'images/login_logo.png'} />
              <h1 style={{ fontWeight: 800 }}>COMPASS</h1>
              <p>Advance, fast and optimized application that can handle millions of users at a same time.</p>
            </div>
          </Col>

          <Col xs={12} md={{ span: '6', order: 'last' }} className={`p-2 p-md-5 d-flex align-items-center ${loginActive ? "d-block" : "d-none"}`} style={{ minHeight: "560px" }}>

            <Form className="w-100">
              <div>
                <h1 className='text-white text-center' style={{ fontWeight: 700 }}>LOG IN</h1>
              </div>
              <Form.Group >
                <Form.Label className="text-light mt-1">
                  Email
                </Form.Label>
                <Form.Control type="email" name="email" value={input.email} onChange={handleChange} />
                <Form.Label className="text-light mt-1">
                  Password
                </Form.Label>
                <Form.Control type="password" name="password" value={input.password} onChange={handleChange} />
                <Form.Text>
                  <p>
                    Don't have account ? <span className="link-primary" onClick={toogleTab}>Sign up</span>
                  </p>
                </Form.Text>
                <div className="text-danger small text-center">
                  {error}
                </div>
                <Button variant="primary" onClick={handleLogin} className="my-2 w-100" >
                  Sign in
                </Button>
              </Form.Group>
            </Form>
          </Col>

          <Col xs={12} md={{ span: '6', order: 'first' }} className={`p-2 p-md-5 ${loginActive ? "d-none" : "d-block"}`} style={{ minHeight: "560px" }}>
            <Form className="m-1 m-md-auto">
              <div className="text-center">
                <h2 className='text-white' style={{ fontWeight: 700 }}>SIGN UP</h2>
              </div>
              <Form.Group >
                <Form.Label className="text-light mt-1">
                  Email
                </Form.Label>
                <Form.Control type="email" name="email" placeholder="example@gmail.com" value={input.email} onChange={handleChange} />
                <Form.Label className="text-light mt-1">
                  First name
                </Form.Label>
                <Form.Control type="text" name="firstname" placeholder="John" value={input.firstname} onChange={handleChange} />
                <Form.Label className="text-light mt-1">
                  Last name
                </Form.Label>.
                <Form.Control type="text" name="lastname" placeholder="Doe" value={input.lastname} onChange={handleChange} />
                <Form.Label className="text-light mt-1">
                  Password
                </Form.Label>
                <Form.Control type="password" name="password" placeholder="set Password" value={input.password} onChange={handleChange} />
                <Form.Label className="text-light mt-1">
                  Confirm Password
                </Form.Label>
                <Form.Control type="password" name="confirm_password" value={input.confirm_password} onChange={handleChange} />
                <Form.Text>
                  <p>
                    Already have an account ? <span className="link-primary" onClick={toogleTab}>Login</span>
                  </p>
                </Form.Text>
                <div className="text-danger small text-center">
                  {error}
                </div>
                <Button variant="primary" onClick={handleSignUp} className="w-100" >
                  Sign up
                </Button>
              </Form.Group>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default Login;
