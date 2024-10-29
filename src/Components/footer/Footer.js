import React, { useState, useEffect } from "react";
import {
    Container,
    Row,
    Col,
    Collapse,
} from "reactstrap";
import { Link, json } from "react-router-dom";
import { AdminDetails, getSocialMedia } from "./request";


const Footer = ({ layoutClass, CopyRightFluid, belowContainerFluid, admin }) => {

    const [isOpen, setIsOpen] = useState();
    const [collapse, setCollapse] = useState(0);
    const width = window.innerWidth <= 767;

    useEffect(() => {
        const changeCollapse = () => {
            if (window.innerWidth <= 767) {
                setCollapse(0);
                setIsOpen(false);
            } else setIsOpen(true);
        };
        window.addEventListener("resize", changeCollapse);
        return () => {
            window.removeEventListener("resize", changeCollapse);
        };
    }, []);

    const [social, setSocial] = useState([]);

    // const [admin,setAdmin] = useState([]);
    // const fetchAdmin = async (id) => {
    //     AdminDetails().then(res => {
    //         setAdmin(res?.data);
    //         localStorage.setItem("admin",JSON.stringify(res?.data));
    //     }).catch(e => {
    //       console.log(e)
    //     })
    //   }

    const fetchSocial = async (id) => {
        getSocialMedia().then(res => {
            setSocial(res?.data)
        }).catch(e => {
            console.log(e)
        })
    }


    useEffect(() => {
        // fetchAdmin();
        fetchSocial()
    }, [])



    return (<>
        <footer className="footer-light">
            <section className="footer_inner text-start" >
                <Container fluid={belowContainerFluid ? belowContainerFluid : ""} className="pt-xl-4">
                    <Row className="footer-theme partition-f pt-5">
                        <Col xl="3 " className="mb-xl-0 mb-3 ">
                            <div className="footer-contant">
                                <div className="footer-logo">
                                    <img src={admin?.find(r => r?.key == 'light_logo')?.value ?? ''} onError={(e) => e.currentTarget.src = `/assets/images/homepg/logo.png`} alt="logo" className="img-fluid logo" />
                                </div>
                                <p className="three_line">
                                    {admin?.find(r => r?.key == 'website_description')?.value ?? ''}
                                </p>
                                <div className="footer-social mb-3">
                                    <ul className="mt-0 mb-4">
                                        {
                                            social?.slice(0, 4).map((data, i) => (
                                                <a href={data?.value.startsWith('https://') ? data?.value : 'https://' + data?.value ?? ''} key={i} target="_blank">
                                                    <li >
                                                        <i
                                                            className={`fa fa-${data?.key}`}
                                                            aria-hidden="true"></i>
                                                    </li>
                                                </a>
                                            ))
                                        }
                                        
                                        {/* <li>
                                            <a href="https://www.instagram.com" target="_blank">
                                                <i
                                                    className="fa fa-instagram"
                                                    aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://twitter.com" target="_blank">
                                                <i className="fa fa-linkedin" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="https://rss.com" target="_blank">
                                                <i className="fa fa-youtube-play" aria-hidden="true"></i>
                                            </a>
                                        </li> */}
                                    </ul>
                                </div>
                            </div>
                            {/* </Collapse> */}
                        </Col>

                        <Col xl="2" md="4" className="mb-xl-0 mb-3">
                            <div className="d-xxl-flex justify-content-center">
                                <div className="sub-title">
                                    <div
                                        className={`footer-title ${isOpen && collapse == 2 ? "active" : ""
                                            } `}>
                                        <h4
                                            onClick={() => {
                                                if (width) {
                                                    setIsOpen(!isOpen);
                                                    setCollapse(2);
                                                } else setIsOpen(true);
                                            }}>
                                            COMPANY
                                            <span className="according-menu"></span>
                                        </h4>
                                    </div>
                                    <Collapse
                                        isOpen={width ? (collapse === 2 ? isOpen : false) : true}>
                                        <div className="footer-contant">
                                            <ul>
                                                <li>
                                                    <Link to={`/`}>
                                                        {/* <a> */}
                                                        <span className="pr-2">-</span> Home
                                                        {/* </a> */}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/about-us`}>
                                                        {/* <a>  */}
                                                        <span className="pr-2">-</span> About Us
                                                        {/* </a> */}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/stories`}>
                                                        {/* <a> */}
                                                        <span className="pr-2">-</span> Stories
                                                        {/* </a> */}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/exploreprogram`}>
                                                        {/* <a> */}
                                                        <span className="pr-2">-</span> Explore Programs
                                                        {/* </a> */}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/faq`}>
                                                        {/* <a> */}
                                                        <span className="pr-2">-</span> FAQ
                                                        {/* </a> */}
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`/contact-us`}>
                                                        {/* <a> */}
                                                        <span className="pr-2">-</span> Contact Us
                                                        {/* </a> */}
                                                    </Link>
                                                </li>
                                            </ul>
                                        </div>
                                    </Collapse>
                                </div>
                            </div>
                        </Col>
                        <Col xl="2" md="4" className="mb-xl-0 mb-3">
                            <div className="sub-title">
                                <div
                                    className={`footer-title ${isOpen && collapse == 3 ? "active" : ""
                                        } `}>
                                    <h4
                                        onClick={() => {
                                            if (width) {
                                                setIsOpen(!isOpen);
                                                setCollapse(3);
                                            } else setIsOpen(true);
                                        }}>
                                        SUPPORT
                                        <span className="according-menu"></span>
                                    </h4>
                                </div>
                                <Collapse
                                    isOpen={width ? (collapse === 3 ? isOpen : false) : true}>
                                    <div className="footer-contant">
                                        <ul>
                                            <li>
                                                <Link to={`/termsService`}><span className="pr-2">-</span>  Terms of Service</Link>
                                            </li>
                                            <li>
                                                <Link to={`/privacyPolicy`}><span className="pr-2">-</span> Privacy Policy</Link>
                                            </li>
                                            <li>
                                                <Link to="/cookiePolicy"><span className="pr-2">-</span> Cookie Policy</Link>
                                            </li>
                                            <li>
                                                <Link to={`/refundPolicy`}><span className="pr-2">-</span> Refund Policy</Link>
                                            </li>
                                            <li>
                                                <Link to={`/disclaimer`}><span className="pr-2">-</span> Disclaimer</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Collapse>
                            </div>
                        </Col>
                        <Col xl="2" md="4" className="mb-xl-0 mb-3">
                            <div className="sub-title">
                                <div
                                    className={`footer-title ${isOpen && collapse == 5 ? "active" : ""
                                        } `}>
                                    <h4
                                        onClick={() => {
                                            if (width) {
                                                setIsOpen(!isOpen);
                                                setCollapse(5);
                                            } else setIsOpen(true);
                                        }}>
                                        PLATFORM
                                        <span className="according-menu"></span>
                                    </h4>
                                </div>
                                <Collapse
                                    isOpen={width ? (collapse === 5 ? isOpen : false) : true}>
                                    <div className="footer-contant">
                                        <ul>
                                            <li>
                                                <Link to={`/mentor`}><span className="pr-2">-</span> Find My Mentor</Link>
                                            </li>
                                            <li>
                                                <Link to={`/becomeMentor`}><span className="pr-2">-</span> Become a Mentor</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </Collapse>
                            </div>
                        </Col>
                        <Col xl="3" className="mb-xl-0 mb-3">
                            <div className="sub-title">
                                <div
                                    className={`footer-title ${isOpen && collapse == 4 ? "active" : ""
                                        } `}>
                                    <h4
                                        onClick={() => {
                                            if (width) {
                                                setIsOpen(!isOpen);
                                                setCollapse(4);
                                            } else setIsOpen(true);
                                        }}>
                                        Contact Us
                                        <span className="according-menu"></span>
                                    </h4>
                                </div>
                                <Collapse
                                    isOpen={width ? (collapse === 4 ? isOpen : false) : true}>
                                    <div className="footer-contant">
                                        <ul className="contact-list">
                                            {
                                                admin?.map((data, i) => (
                                                    <li className="d-flex align-items-center" key={i}>
                                                        {
                                                            data?.key == "address" ?
                                                                <img src={`/assets/images/homepg/icons/__Location.png`} alt="" className="me-3 logo_footer" />
                                                                : data?.key == "phone" ?
                                                                    <img src={`/assets/images/homepg/icons/__Call.png`} alt="" className="me-3 logo_footer" />
                                                                    : data?.key == "system_email" ?
                                                                        <img src={`/assets/images/homepg/icons/__mail.png`} alt="" className="me-3 logo_footer" />
                                                                        : ''
                                                        }
                                                        {/* 25, Bharathiyar 2nd Street, Pazhavanthangal, Chennai, Tamil Nadu, India 600114 */}
                                                        {
                                                            data?.key == "address" ?
                                                                <span className="two_line">{data?.value}</span>
                                                                : data?.key == "phone" ?
                                                                    <a href={`tel:${data?.value}`} ><span className="two_line">{data?.value}</span></a>
                                                                    : data?.key == "system_email" ?
                                                                        <a href={`mailto:${data?.value}`} ><span className="two_line">{data?.value}</span></a> : ''
                                                        }
                                                    </li>
                                                ))
                                            }
                                            {/* <li className="d-flex align-items-center">
                                                <img src={`/assets/images/homepg/icons/__Call.png`} alt="" className="me-3 logo_footer" />
                                                044 2226 5551
                                            </li>
                                            <li className="d-flex align-items-center">
                                                <img src={`/assets/images/homepg/icons/__mail.png`} alt="" className="me-3 logo_footer" />
                                                <a href="#">hello@mentaroo.com</a>
                                            </li> */}
                                        </ul>
                                    </div>
                                </Collapse>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <div className={`sub-footer ${layoutClass}`}>
                <Container fluid={CopyRightFluid ? CopyRightFluid : ""}>
                    <Row className='justify-contet-center'>
                        <div className="footer-end d-flex justify-content-center align-items-center">
                            <p className='d-flex justify-content-center align-items-center'>Copyright <i className="fa fa-copyright px-1" aria-hidden="true"></i> 2023 mentaroo.com</p>
                        </div>
                    </Row>
                </Container>
            </div>
        </footer>
    </>)
}

export default Footer;