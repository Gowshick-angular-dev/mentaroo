import React, { useState, useEffect, useRef } from "react";
import { Media, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import NavBar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/core/Auth";

const Header = ({ admin, headerClass, ...args }) => {
  const { logout, auth } = useAuth()
  const router = useNavigate();
  const handleLogout = () => {
    router('/login')
    logout()
  }

  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);
    
    if (window.location.pathname !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);
    
    return () => {
       window.removeEventListener("scroll", handleScroll);
     };
   }, []);


  const handleScroll = () => {
    let number =
      window.pageXOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    if (number >= 300) {
      if (window.innerWidth < 581)
        document.getElementById("sticky").classList.remove("fixed");
      else document.getElementById("sticky").classList.add("fixed");
    }
    else document.getElementById("sticky").classList.remove("fixed");
  };

  const targetRef = useRef(null);

  const handleClickOutside = (event) => {
    if (targetRef.current && !targetRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };


  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  }

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);


  return (
    <div>
      <header id="sticky" className={`sticky ${headerClass}`}>
        <div className="mobile-fix-option"></div>
        <Container className="py-3">
          <Row>
            <Col>
              <div className="main-menu">
                <div className="menu-left">
                  <div className="brand-logo">
                    <Link to="/"><img src={admin?.find(r => r?.key == 'light_logo')?.value ?? ''} onError={(e) => e.currentTarget.src = `/assets/images/homepg/logo.png`} alt="logo" className="img-fluid logo" /></Link>
                  </div>
                </div>
                <div className="menu-right pull-right">
                  <NavBar togglePopup={togglePopup} />
                  <div>
                    {showPopup && (
                      <div className="popup desing_popop" ref={targetRef} style={{ position: 'absolute', }}>
                        <Link to={`/dashboard`}><div className="d-flex align-items-center" >  <img src={`/assets/images/__Dashboard-93.png`} alt="" className="img-bhjd me-3" /> <p className="mb-0">Dashboard</p></div></Link>
                        <hr></hr>
                        <div role="button" className="d-flex align-items-center" onClick={toggle} >  <img src={`/assets/images/__Logout.png`} alt="" className="img-bhjd me-3" /> <p className="mb-0">Logout</p></div>
                      </div>
                    )}
                    <Modal className='cutome_popup' isOpen={modal} toggle={toggle} centered={true}  {...args}>
                      <ModalBody className='p-4 '>
                        <div className='px-4 position-relative'>
                          <h1 className='text-center mt-3 fw-bold'>Thank You! <br></br> {auth?.first_name}</h1>
                          <div className='d-flex justify-content-center mb-3'>
                            <img src={`/assets/images/logout.png`} alt="" className="img_popuphgsd" />
                          </div>
                          <p className='text-center'>Feel free to come back anytime! If you're ready to leave, click 'Logout'</p>
                          <div className='d-flex justify-content-center'><button onClick={() => handleLogout()} type="button" className='btn_theme py-3 px-5 mb-lg-4 mb-3 mt-3 '>Logout</button></div>
                          <div className="model_close_icon" onClick={toggle}> <img src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /> </div>
                        </div>
                      </ModalBody>
                    </Modal>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </header>
    </div>
  )
}


export default Header;