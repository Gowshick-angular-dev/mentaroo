import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/core/Auth";


const Navbar = ({ togglePopup }) => {

    const [currentUser, setCurrentUser] = useState(localStorage.getItem('token'));
    const [navClose, setNavClose] = useState({ right: "100%" });
    const { pathname } = useLocation()

    const { auth } = useAuth()

    useEffect(() => {
        setCurrentUser(localStorage.getItem('token'))
    }, [localStorage.getItem('token')])


    // console.log("pathname", pathname)

    // useEffect(() => {
    //     if (window.innerWidth < 750) {
    //         setNavClose({ right: "100%" });
    //     }
    //     if (window.innerWidth < 1199) {
    //         setNavClose({ right: "100%" });
    //     }
    // }, []); 
                                                            
    useEffect(() => {
        closeNav();
    }, [pathname])

    const openNav = () => {
        setNavClose({ right: "0px" });
        if (window.location.pathname == "/layouts/Gym")
            document.querySelector("#topHeader").classList.add("zindex-class");
    };

    const closeNav = () => {
        setNavClose({ right: "100%" });
        if (window.location.pathname == "/layouts/Gym")
            document.querySelector("#topHeader").classList.remove("zindex-class");
    };

    useEffect(() => {
        const storedActiveItem = localStorage.getItem('activeItem');
        if (storedActiveItem) {
            setActiveItem(storedActiveItem);
        }
    }, []);


    const [activeItem, setActiveItem] = useState('');
   

    return (<div>
        <div className="d-flex align-items-center">
            <div className="main-navbar">
                <div id="mainnav">
                    <div className="toggle-nav" onClick={openNav.bind(this)}>
                        <img src="/assets/images/__Menu.png" alt="" className="menu_icon m-0" />
                    </div>
                    <ul className="nav-menu d-flex align-items-center" style={navClose}>
                        <li className="back-btn" onClick={closeNav.bind(this)}>
                            <div className="mobile-back text-end">
                                <a  ><img src={`/assets/images/homepg/menu/7.png`} alt="" className="icon_cancel" /></a>
                            </div>
                        </li>
                        <li><Link to="/" className={`d-flex align-items-center ${pathname === '/' ? 'active' : ''}`}

                        >
                            <img src={`/assets/images/home-side.png`} alt="" className="icon_cancel d-xl-none d-block me-2" />Home</Link>
                        </li>

                        <li>
                            <Link to={`/mentor`} className={`d-flex align-items-center ${pathname === '/mentor' ? 'active' : ''}`} >
                                <img src={`/assets/images/home-side-3.png`} alt="" className="icon_cancel d-xl-none d-block me-2" />Find Your Mentor
                            </Link>
                        </li>
                        <li>
                            <Link to={`/becomeMentor`} className={`d-flex align-items-center ${pathname === '/becomeMentor' ? 'active' : ''}`}>
                                <img src={`/assets/images/home-side-4.png`} alt="" className="icon_cancel d-xl-none d-block me-2" />Become a Mentor
                            </Link>
                        </li>
                        <li>
                            <Link to={`/stories`} className={`d-flex align-items-center ${pathname === '/stories' ? 'active' : ''}`}>
                                <img src={`/assets/images/home-side-5.png`} alt="" className="icon_cancel d-xl-none d-block me-2" />Stories
                            </Link></li>
                        {auth ?
                            <li>
                                <div className="login_btn1 d-xl-flex align-items-center  d-none " onClick={togglePopup} >
                                    <img src={`/assets/images/UserProfile.png`} alt="" className="img-bhjd me-2" />
                                    <a className="me-3"> Me </a> <i className="fa fa-angle-down text-white" aria-hidden="true"></i>
                                </div> 
                                <div className="d-xl-none">
                                   <Link to={`/dashboard`} className={`d-flex align-items-center ${pathname === '/dashboard' ? 'active' : ''}`}> <img src={`/assets/images/__Dashboard-fff.png`} alt="" className="icon_cancel d-xl-none d-block me-2" /> Dashboard</Link>
                                </div>
                            </li>
                            :
                            <li>
                                <Link to={`/login`}>
                                    <div className="login_btn align-items-center"><img src={`/assets/images/home-side-6.png`} alt="" className="icon_cancel d-xl-none d-block me-2" />  Login</div>
                                </Link>
                            </li>}
                    </ul>
                </div>
            </div>
        </div>
    </div>)

}

export default Navbar;