import React from 'react'
import NavComp from './NavComp'
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
} from 'mdb-react-ui-kit';


const Landing = () => {

  const [centredModal, setCentredModal] = React.useState(false);
  const toggleShow = () => setCentredModal(!centredModal);


  return (
    <>
        <div className='outer-container'>
            <NavComp />
            <div className='home'>
              <p>Welcome to</p>
              <p>VIDCALL</p>
              <p>Connect with anyone, anywhere, anytime.</p>
              <p>Video conferencing made easy. Connect with anyone, anywhere, anytime with our secure and reliable platform. Our video conferencing software is easy to use and affordable, making it the perfect solution for businesses of all sizes.</p>
              <div className='start-meet'>
                  <button className='button' onClick={toggleShow}>Start a Meet</button>
                  <button className='button'>Join a Meet</button>
              </div>
            </div>
        </div>
      <MDBModal tabIndex='-1' show={centredModal} setShow={setCentredModal}>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Start the Meet</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleShow}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
                <p className='instant-meet' onClick={() => window.location.replace('/meet')}>Start a Instant Meet</p>
                <div className='line'></div>
                <p className='instant-meet mt-3'>Schedule a Meet</p>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  )
}

export default Landing