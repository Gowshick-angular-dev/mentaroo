import React, { useState, useEffect, useRef } from "react";
import SideBar from './Sidebar';
import { Media, Container, Row, Col, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import { Link , useNavigate} from "react-router-dom";
import { useAuth } from "../Auth/core/Auth";
import { AdminDetails } from "../footer/request";

const DashboardNavbar = (
  logoName,
  headerClass,
  topClass,
  noTopBar,
  direction,
  ...args
) => {

  /*=====================
     Pre loader
     ==========================*/
  const { logout, auth } = useAuth(); 
  const router = useNavigate(); 

  useEffect(() => {
    setTimeout(function () {
      document.querySelectorAll(".loader-wrapper").style = "display:none";
    }, 2000);



    if (window.location.asPath !== "/layouts/Christmas")
      window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


  const [admin, setAdmin] = useState([]);

  const fetchAdmin = async (id) => {
    AdminDetails().then(res => {
      setAdmin(res?.data);
      localStorage.setItem("admin", JSON.stringify(res?.data));
    }).catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    fetchAdmin();
  }, [])


  const targetRef = useRef(null);

  const handleClickOutside = (event) => {
    if (targetRef.current && !targetRef.current.contains(event.target)) {
      setShowPopup(false);
    }
  };


  // const adminData = JSON?.parse(localStorage.getItem('admin')) ?? []
  // const adminData = admin ?? []


  useEffect(() => {
    // Add event listener when component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Remove event listener when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        document.getElementById("sticky")?.classList.remove("fixed");
      else document.getElementById("sticky")?.classList.add("fixed");
    }
    else document.getElementById("sticky")?.classList.remove("fixed");
  };

  const openNav = () => {
    var openmyslide = document.getElementById("mySidenav");
    if (openmyslide) {
      openmyslide.classList.add("open-side");
    }
  };
  const openSearch = () => {
    document.getElementById("search-overlay").style.display = "block";
  };

  // eslint-disable-next-line
  const [isloading, setIsLoading] = useState(false);

  const load = () => {
    setIsLoading(true);
    fetch().then(() => {
      // deal with data fetched
      setIsLoading(false);
    });
  };
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [showPopup1, setShowPopup1] = useState(false);

  const togglePopup1 = () => {
    setShowPopup1(!showPopup1);
  };
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const [accountInfo, setAccountInfo] = useState(false)


  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };


  return (
    <header id="sticky" className={`sticky  ${headerClass} cumdgciaaef`}>
      <div className="mobile-fix-option"></div>
      <Container className="py-lg-3">
        <Row>
          <Col>
            <div className="main-menu ">
              <div className="menu-left">
                <button type="button" onClick={()=> router('/faq')} className="btn_help btn btn-secondary cursor_pointer d-lg-none d-block positiob_help"> <img src="/assets/images/menteedashBoard/__need help.png" alt="" className="img-sidebar_icon me-1" /> Need help?</button>
                <div className="mb-3 mt-3 ms-3">
                  <img onClick={toggleMenu} src={`/assets/images/__Menu.png`} alt="" className="menu_icon me-3  d-lg-none d-block " />
                </div>
                <div className={`offcanvas-menu ${isOpen ? 'open' : ''}`}>
                  <img onClick={closeMenu} src={`/assets/images/__Back arrow_green.png`} alt="" className="menu_icon ms-3 mt-2" />
                  <SideBar closeMenu={closeMenu} />
                </div>
                <div className="brand-logo">
                  <Link to="/"><img src={admin?.find(r => r?.key == 'light_logo')?.value ?? ''} onError={(e) => e.currentTarget.src = `/assets/images/homepg/logo.png`} alt="logo" className="img-fluid logo" /></Link>
                </div>
              </div>
              <div className="menu-right pull-right align-items-center">
                <div className="me-3 me-xl-4 position-relative d-none" onClick={togglePopup1}>
                  <img src={`/assets/images/menteedashBoard/_Notification.png`} alt="" className="img_cont" />
                  <div className="notification-white"></div>
                </div>
                {showPopup1 && (
                  <div className="popup_notification custome_bhjvSfc col-xxl-4 col-lg-5 col-md-7" >
                    <div className="d-flex justify-content-between px-3 pt-3" ><h3 className="mb-0 fw-bold">Notifications</h3><img onClick={togglePopup1} src="/assets/images/cancel.png" alt="" className="img_popuphgsd" /></div>
                    <hr></hr>
                    <div className="p-3 text-center">
                      <div className="d-flex justify-content-center mb-3"> <img src={`/assets/images/__no notifications.png`} alt="" className="image-wefy" /></div>

                      <h3>Stay in the loop with updates!</h3>
                      <div className="d-flex justify-content-center"><p className="col-xl-8">Keep an eye on this feed for updates about your learning journey on Mentaroo.</p>
                      </div> </div>
                  </div>
                )}
                <Link to={'/my-message'}>  <div className="me-3 position-relative" >
                  {window.location.pathname === '/my-message' ? (
                    <img src={`/assets/images/menteedashBoard/_Messages Active.png`} alt="" className="img_cont" />
                  ) : (
                    <img src={`/assets/images/menteedashBoard/_Messages.png`} alt="" className="img_cont" />
                  )}
                  <div className={`notification-white  ${window.location.pathname === '/my-message' ? 'message-white' : ''}`} ></div>
                </div>
                </Link>

                <div>
                  <div className="login_btn1 d-xl-flex align-items-center  d-none " onClick={togglePopup} >
                    <img src={`/assets/images/UserProfile.png`} alt="" className="img-bhjd me-2" />
                    <a className="me-3"> Me </a> <i className="fa fa-angle-down text-white" aria-hidden="true"></i>
                  </div>
                  {showPopup && (
                    <div className="popup desing_popop" ref={targetRef} role="button" style={{ position: 'absolute', }}>
                      <Link to={`/dashboard`} onClick={togglePopup}><div className="d-flex align-items-center" >  <img src={`/assets/images/__Dashboard-93.png`} alt="" className="img-bhjd me-3" /> <p className="mb-0">Dashboard</p></div></Link>
                      <hr></hr>
                      <div className="d-flex align-items-center" onClick={toggle} >  <img src={`/assets/images/__Logout.png`} alt="" className="img-bhjd me-3" /> <p className="mb-0">Logout</p></div>
                    </div>
                  )}

                  <Modal className='cutome_popup' isOpen={modal} toggle={toggle} centered={true}  {...args}>
                    <ModalBody className='p-4 '>
                      <div className='px-4 position-relative'>
                        <h1 className='text-center mt-3 fw-bold'>Goodbye for now <br></br> {auth?.first_name}</h1>
                        <div className='d-flex justify-content-center mb-3'>
                          <img src={`/assets/images/logout.png`} alt="" className="img_popuphgsd" />
                        </div>
                        <p className='text-center'>Feel free to come back anytime! If you're ready to leave, click 'Logout'</p>
                        <div onClick={() => logout()} className='d-flex justify-content-center'><button on type="button" className='btn_theme py-3 px-5 mb-lg-4 mb-3 mt-3 '>Logout</button></div>
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
  )
}

export default DashboardNavbar