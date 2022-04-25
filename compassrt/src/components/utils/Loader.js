import React from 'react'
import { Spinner } from 'react-bootstrap';
import CenteredContainer from './Containers/CenteredContainer';

const Loader = () => {
  return (
    <CenteredContainer>
      <Spinner animation="border" >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </CenteredContainer>
  )
}

export default Loader