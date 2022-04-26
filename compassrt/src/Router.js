import React, { lazy, Suspense, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import Navbar from "./components/common/Navbar/Navbar"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CenteredContainer from './components/utils/Containers/CenteredContainer';
import { useReducer } from 'react';
import { authenticate } from './redux/slices/authReducer';
import { useDispatch, useSelector } from 'react-redux';
import { getData } from './api';
import Loader from './components/utils/Loader';

//lazy loading all the required components
const Home = lazy(() => import("./components/pages/Home/Home"));
const About = lazy(() => import("./components/pages/About/About"));
const Login = lazy(() => import("./components/pages/Login/Login"));

//lazyLoaded component needed fallback UI either can't displayed by react-route-dom

const Router = () => 
{
    const auth = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => { if (auth.token) { checkToken(); } }, []);
    useEffect(() => { console.log(auth); }, [auth]);

    const checkToken = async () => 
    {
        try 
        {
            // const res = await getData();
            dispatch(authenticate(auth.token));
        }
        catch (e) { }
    }
    const lazyLoaded = (component, isPrivate) => 
    {
        return isPrivate
            ? <PrivateRoute isAuthenticated={auth.isAuthenticated}>
                <Suspense fallback={<Loader />} >
                    {component}
                </Suspense>
            </PrivateRoute>
            : <Suspense fallback={<Loader />} >{component} </Suspense>
    }

    const PrivateRoute = ({ isAuthenticated, children }) => 
    {
        return isAuthenticated ? children : <Navigate to="/" />;
    };

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" exact element={lazyLoaded(<Login />)} />
                {/* <Route path="/" exact element={lazyLoaded(<About />)} /> */}
                <Route path="/dashboard" exact element={lazyLoaded(<Home />, true)} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router