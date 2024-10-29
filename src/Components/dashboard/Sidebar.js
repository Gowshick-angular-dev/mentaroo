import React, { useState, useEffect, } from 'react';
import {Modal, ModalBody} from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/core/Auth';

const SideBar = ({ closeMenu }, ...args) => {

    const { currentUser } = useAuth();
    const [accountInfo, setAccountInfo] = useState(false);
    const [selectedOption, setSelectedOption] = useState(
        localStorage.getItem('selectedOption') || 'mentee'
    ); 
    const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

    const router = useNavigate(); 

    const { logout, auth } = useAuth()

    useEffect(() => {
        const storedSelectedOption = localStorage.getItem('selectedOption');
        if (storedSelectedOption) {
            setSelectedOption(storedSelectedOption);
        }
    }, []);

    return (
        <div className='sidebar py-4 '>
            {currentUser === 'mentee' ? (
                <div className=''>
                    <Link onClick={closeMenu} to={'/dashboard'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/dashboard' ? 'active' : ''}`} >
                            {window.location.pathname === '/dashboard' ? (
                                <img src={`/assets/images/__Dashboard Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/__Dashboard-93.png`} alt="" className="img-sidebar_icon me-3" />
                            )}
                            <p className="mb-0">Dashboard</p>
                        </div></Link>
                    <Link onClick={closeMenu} to={'/my-purchase'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/my-purchase' ? 'active' : ''}`} >
                            {window.location.pathname === '/my-purchase' ? (
                                <img src={`/assets/images/menteedashBoard/__My Purchases Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__My Purchases.png`} alt="" className="img-sidebar_icon me-3" />
                            )}

                            <p className="mb-0">My Purchases</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/my-program'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/my-program' ? 'active' : ''}`} >

                            {window.location.pathname === '/my-program' ? (
                                <img src={`/assets/images/menteedashBoard/__My Programs Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__My Programs.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0">My Programs</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/profile'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/profile' ? 'active' : ''}`}  >

                            {window.location.pathname === '/profile' ? (
                                <img src={`/assets/images/menteedashBoard/__Edit My Profile Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__Edit My Profile.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0">Edit My Profile</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/my-message'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/my-message' ? 'active' : ''}`} >

                            {window.location.pathname === '/my-message' ? (
                                <img src={`/assets/images/menteedashBoard/__My Messages Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__My Messages.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0">My Messages</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/settings'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/settings' ? 'active' : ''}`} >
                            {window.location.pathname === '/settings' ? (
                                <img src={`/assets/images/menteedashBoard/__Settings Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__Settings.png`} alt="" className="img-sidebar_icon me-3" />
                            )}

                            <p className="mb-0">Settings</p>
                        </div>
                    </Link>
                    {/* <Link onClick={closeMenu} to={'/login'}> */}
                    {/* <div role='button' className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/login' ? 'active' : ''}`} onClick={() => logout()} >
                        <img src={`/assets/images/menteedashBoard/__Logout.png`} alt="" className="img-sidebar_icon me-3" />
                        <p className="mb-0">Logout</p>
                    </div> */}
                    <div role='button' className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/login' ? 'active' : ''}`} onClick={toggle}>
                        <img src={`/assets/images/menteedashBoard/__Logout.png`} alt="" className="img-sidebar_icon me-3" />
                        <p className="mb-0">Logout</p>
                    </div>
                    {/* </Link> */}
                </div>) : (

                <div className=''>
                    <Link onClick={closeMenu} to={'/dashboard'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/dashboard' ? 'active' : ''}`} >
                            {window.location.pathname === '/dashboard' ? (
                                <img src={`/assets/images/__Dashboard Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/__Dashboard-93.png`} alt="" className="img-sidebar_icon me-3" />
                            )}
                            <p className="mb-0">Dashboard</p>
                        </div></Link>
                    <Link onClick={closeMenu} to={'/profile'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/profile' ? 'active' : ''}`} >
                            {window.location.pathname === '/profile' ? (
                                <img src={`/assets/images/menteedashBoard/__Edit My Profile Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__Edit My Profile.png`} alt="" className="img-sidebar_icon me-3" />
                            )}
                            <p className="mb-0">Edit My Profile</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/my-bookings'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/my-bookings' ? 'active' : ''}`} >
                            {window.location.pathname === '/my-bookings' ? (
                                <img src={`/assets/images/menteedashBoard/__My Programs Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__My Programs.png`} alt="" className="img-sidebar_icon me-3" />
                            )}
                            <p className="mb-0">My Bookings</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/calender-page'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/calender-page' ? 'active' : ''}`} >
                            {window.location.pathname === '/calender-page' ? (
                                <img src={`/assets/images/menteedashBoard/__My Purchases Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__My Purchases.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0">Calender</p>
                        </div>
                    </Link>


                    <Link onClick={closeMenu} to={'/my-message'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/my-message' ? 'active' : ''}`} >

                            {window.location.pathname === '/my-message' ? (
                                <img src={`/assets/images/menteedashBoard/__My Messages Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__My Messages.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0"> Messages</p>
                        </div>
                    </Link>

                    <Link onClick={closeMenu} to={'/my-stories'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/my-stories' ? 'active' : ''}`} >

                            {window.location.pathname === '/my-stories' ? (
                                <img src={`/assets/images/Icons/2.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/Icons/1.png`} alt="" className="img-sidebar_icon me-3" />
                            )}

                            <p className="mb-0"> My Stories</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/account-settings'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/account-settings' ? 'active' : ''}`} >


                            {window.location.pathname === '/account-settings' ? (
                                <img src={`/assets/images/Icons/4.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/Icons/3.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0"> Account Settings</p>
                        </div>
                    </Link>
                    <Link onClick={closeMenu} to={'/payout'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/payout' ? 'active' : ''}`} >


                            {window.location.pathname === '/payout' ? (
                                <img src={`/assets/images/Icons/6.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/Icons/5.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0">Payouts</p>
                        </div>
                    </Link>

                    <Link onClick={closeMenu} to={'/settings'}>
                        <div className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/settings' ? 'active' : ''}`} >

                            {window.location.pathname === '/settings' ? (
                                <img src={`/assets/images/menteedashBoard/__Settings Active.png`} alt="" className="img-sidebar_icon me-3" />
                            ) : (
                                <img src={`/assets/images/menteedashBoard/__Settings.png`} alt="" className="img-sidebar_icon me-3" />
                            )}


                            <p className="mb-0">Settings</p>
                        </div>
                    </Link>
                    {/* <Link onClick={closeMenu} to={'/login'}> */}
                    <div role='button' className={`d-flex align-items-center sidebar_dsign ${window.location.pathname === '/login' ? 'active' : ''}`} onClick={toggle}>
                        <img src={`/assets/images/menteedashBoard/__Logout.png`} alt="" className="img-sidebar_icon me-3" />
                        <p className="mb-0">Logout</p>
                    </div>
                    {/* </Link> */}
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

            <div className='' onClick={()=> router('/faq')} >
                <button type='button' className='btn_help ms-2 cursor_pointer'> <img src={`/assets/images/menteedashBoard/__need help.png`} alt="" className="img-sidebar_icon me-3" /> Need help?</button>
            </div>
        </div>
    )
}

export default SideBar;