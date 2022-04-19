import React, { lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import Navbar from "./components/common/Navbar/Navbar"
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CenteredContainer from './components/utils/Containers/CenteredContainer';

//lazy loading all the required components
const Home = lazy(() => import("./components/pages/Home/Home"));
const About = lazy(() => import("./components/pages/About/About"));


//loader to handle fallback of UI
const Loader = () => {
    return <CenteredContainer>
        <Spinner animation="border" >
            <span className="visually-hidden">Loading...</span>
        </Spinner>
    </CenteredContainer>

}

//lazyLoaded component needed fallback UI either can't displayed by react-route-dom
const lazyLoaded = (component) => {
    return <Suspense fallback={<Loader />} >
        {component}
    </Suspense>
}

const Router = () => {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" exact element={lazyLoaded(<Home />)} />
                <Route path="/about" exact element={lazyLoaded(<About />)} />
            </Routes>
        </BrowserRouter>
    )
}

export default Router