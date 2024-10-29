import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { getknowMentee, myBookingList } from './request';
import { useAuth } from '../../Auth/core/Auth';
import cn from 'classnames';
import Meta from '../../../services/Meta';


const MyBooking = (...args) => {
    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const [loading, setLoading] = useState(false);

    const { auth } = useAuth();

    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const [showPopup, setShowPopup] = useState(false);

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
            setCurrentActiveTab(tab);
        }
        if (tab === '1') {
            setShowPopup(true);
        } else {
            setShowPopup(false);
        }
    };
    
    
    
    
    const [bookingList, setbookingList] = useState([]);
    const [bookingPast, setBookingPast] = useState([]);
    const [menteeinfo, setMenteeinfo] = useState([]);
    
    const handleAboutMentee = (userId, bookId) => {
        getknowMentee(userId,bookId).then(res => {
            setMenteeinfo(res?.data); 
            if(res?.data?.length > 0) {
                togglePopup(); 
            }
        }).catch(err => {
            console.log('err',err.message);
        })
    }


    const fetchBookingList = () => {
        setLoading(true)
        const id = auth?.user_id;
        myBookingList(id).then(res => {
            setbookingList(res?.data?.filter(e => e?.past == 'no'));
            setBookingPast(res?.data?.filter(e => e?.past != 'no'))
            setLoading(false)
        }).catch(err => {
            setLoading(false)
            console.log('err');
        })
    }

    useEffect(() => {
        fetchBookingList();
    }, [])


    const togglePopup1 = () => {
        setModal1(!modal1);
        setShowPopup1(false);
    };

    const togglePopup = () => {
        setModal(!modal);
        setShowPopup(false);
    };



    return (<>
    <Meta title={'My Booking'}  />

        <section className="section-b-space h-100vh">
            {/* <DashboardNavbar /> */}
            <Row className='h-100 custome_heifht'>
                <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
                    <div className='col-xl-9 d-flex justify-content-center'>
                        <SideBar></SideBar>
                    </div>
                </Col>

                <Col lg="9" className='px-xl-4 py-4 scrol_right h-100'>
                    <Col xl="11" className='h-100'>
                        <div className='h-100'>
                            <h2 className='mb-4'>My Bookings</h2>

                            <div className='tab_my_program'>
                                <Nav tabs className="mt-xl-5 mt-lg-4 mt-3 ">
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '1'
                                            })}
                                            onClick={() => { toggle('1'); }}
                                        >
                                            Current
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '2'
                                            })}
                                            onClick={() => { toggle('2'); }}
                                        >
                                            Past
                                        </NavLink>
                                    </NavItem>



                                </Nav>
                                <Modal className='cutome_popup ' isOpen={modal} toggle={togglePopup} centered={true}  {...args}>
                                    <ModalBody className=''>
                                        <div className=' position-relative'>
                                            <div className='d-flex justify-content-between align-items-center px-3 pt-3'>
                                                <h3 className='one_line my-0 fw-bold'>Know Your Mentee</h3>
                                                <img onClick={togglePopup} src={`/assets/images/cancel.png`} alt="" className="icon_size" />

                                            </div>
                                            <hr></hr>
                                            <div className='px-md-4 px-0 pb-4'>
                                                <div className=''>
                                                    <div className='bf_gsik mb-3 d-flex align-items-start'>
                                                        <img src={menteeinfo?.length > 0  ? menteeinfo[0]?.menteeImage : ''} onError={(e) => e.currentTarget.src = "/assets/images/UserProfile.png"} alt="" className="list_img_gd me-3" />
                                                        <div className=''>
                                                            <div className='d-sm-flex align-items-center '>
                                                                <h3 className='mb-sm-0 me-3 '>{ menteeinfo?.length > 0 ? menteeinfo[0]?.menteeName  : ''}</h3>
                                                                {/* <button className='btn_yellow py-2 one_line'>{menteeinfo[0]?.career_goal ?? ''}</button> */}
                                                            </div>
                                                           <p className='fw-bold theme_color one_line mb-2'>{menteeinfo?.length > 0 ? menteeinfo[0]?.career_goal : ''}</p>
                                                            {/*  <div className='d-flex align-items-center'> <img src="/assets/images/Icons/__location gray.png" alt="" className="img-satrt_detaillzud me-1" /><p className='mb-0 '>Chennai, India (+05:30 UTC)</p></div> */}
                                                        </div>
                                                    </div>
                                                </div> 

                                                {
                                                    menteeinfo?.map((data,index) => (
                                                        <div className='' key={index}>
                                                            <h5 className='fw-600'>{data?.questions ?? ''}</h5>
                                                            <p>{data?.answer ?? ''}</p>
                                                            {menteeinfo?.length == index+1 ? '' :
                                                            <hr></hr>
                                                            }
                                                        </div>
                                                    ))
                                                }

                                                {/* <div className=''>
                                                    <h5 className='fw-600'>Do you have a specific timeframe or deadline for achieving your mentorship goals?</h5>
                                                    <p>A mentor mentee mentoring relationship goes through four stages over the period of nine to twelve months: Initiation. Negotiation, Growth</p>
                                                    <hr></hr>
                                                </div> */}
                                            </div>
                                        </div>

                                    </ModalBody>

                                </Modal>




                                <TabContent activeTab={currentActiveTab}>
                                    <TabPane tabId="1">
                                        {
                                            loading ?
                                                <div className='pageLoading'>
                                                    <span
                                                        className={cn(
                                                            'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                                                        )}
                                                    >
                                                        <span className={"loading"} />
                                                    </span>
                                                </div> : bookingList.length > 0 ?
                                                    <Row className='my-4 '>
                                                        {
                                                            bookingList.map((data, i) => (
                                                                <Col xxl="4" md="6" className='mb-3' key={i}>
                                                                    <div className='box_empty'>
                                                                        <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                            <button type='button' className='ongoing'>Ongoing</button>
                                                                            <h5 className='text-gray fw-bold mb-0'>{data?.valid_until}</h5>
                                                                        </div>
                                                                        <div className='d-flex align-items-center mb-3'>
                                                                            <img src={data?.mentee_details?.image} onError={(e) => e.currentTarget.src = "/assets/images/UserProfile.png"}
                                                                                alt="" className="list_img_gd_11 me-2" />
                                                                            <p className='mb-0'>{data?.mentee_details?.first_name}</p>
                                                                        </div>
                                                                        <h5 className='text-dark fw-bold'>{data?.title}</h5>
                                                                        <div className='d-flex'>
                                                                            {/* <button type='button' className='btn_learn_goal one_line text-truncate px-1 py-2 w-50 me-2' onClick={() => { togglePopup(); setMenteeinfo(data?.mentee_details) }}>Know Your Mentee</button> */}
                                                                            <button type='button' className='btn_learn_goal one_line text-truncate px-1 py-2 w-50 me-2' onClick={() => {handleAboutMentee(data?.user_id, data?.id) }}>Know Your Mentee</button>
                                                                            <Link to={'/pending_approval'} state={{ id: data?.id, program: data?.title }} className='w-50'><button type='button' className='btn_theme px-1 py-2 w-100'>View Session</button></Link></div>
                                                                    </div>
                                                                </Col>
                                                            ))
                                                        }

                                                        {/* <Col xxl="4" md="6" className='mb-3'>
                                                    <div className='box_empty'>
                                                        <div className='d-flex justify-content-between align-items-center mb-2'>
                                                            <button type='button' className='ongoing'>Ongoing</button> <h5 className='text-gray fw-bold mb-0'>Valid until 14 Dec</h5>
                                                        </div>
                                                        <div className='d-flex align-items-center mb-3'>
                                                            <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                            <p className='mb-0'>Vignesh Anbazhagan</p>
                                                        </div>
                                                        <h5 className='text-dark fw-bold'>Introductory Call</h5>

                                                        <div className='d-flex'> <button type='button' className='btn_learn_goal one_line text-truncate px-1 py-2 w-50 me-2' onClick={togglePopup}>Know Your Mentee</button> <Link to={'/pending_approval'} className='w-50'><button type='button' className='btn_theme px-1 py-2 w-100'>View Session</button></Link></div>

                                                    </div>
                                                            </Col>

                                                            <Col xxl="4" md="6" className='mb-3'>
                                                                <div className='box_empty'>
                                                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                        <button className='extended'>Extended</button> <h5 className='text-gray fw-bold mb-0'>Valid until 3 Mar</h5>
                                                                    </div>
                                                                    <div className='d-flex align-items-center mb-3'>
                                                                        <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                        <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                    </div>
                                                                    <h5 className='text-dark fw-bold'>Admission Strategy</h5>

                                                                    <div className='d-flex'> <button className='btn_learn_goal  text-truncate px-1 py-2 w-50 me-2' onClick={togglePopup}>Know Your Mentee</button> <Link to={'/pending_approval'} className='w-50'><button className='btn_theme px-1 py-2 w-100'>View Session</button></Link></div>
                                                                </div>
                                                            </Col>

                                                            <Col xxl="4" md="6" className='mb-3'>
                                                                <div className='box_empty'>
                                                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                        <button className='under_review  text-truncate'>Under Review</button> <h5 className='text-gray  text-truncate fw-bold mb-0'>Valid until 20 Dec</h5>
                                                                    </div>
                                                                    <div className='d-flex align-items-center mb-3'>
                                                                        <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                        <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                    </div>
                                                                    <h5 className='text-dark fw-bold'>Career Guidance</h5>

                                                                    <div className='d-flex'> <button className='btn_learn_goal  text-truncate px-1 py-2 w-50 me-2' onClick={togglePopup}>Know Your Mentee</button> <Link to={'/pending_approval'} className='w-50'><button className='btn_theme px-1 py-2 w-100'>View Session</button></Link></div>

                                                                </div>
                                                            </Col> */}

                                                    </Row> :
                                                    <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                                        <img src='/assets/nodata.png' className='w-50' />
                                                    </div>
                                        }



                                    </TabPane>

                                    <TabPane tabId="2">
                                        {
                                            bookingPast?.length > 0 ?
                                                <Row className='my-4 '>
                                                    {
                                                        bookingPast.map((data, i) => (
                                                            <Col xxl="4" md="6" className='mb-3' key={i}>
                                                                <div className='box_empty'>
                                                                    <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                        <button className='Completed text-truncate'>Completed</button>
                                                                        <h5 className='text-gray fw-bold text-truncate mb-0'>{data?.valid_until}</h5>
                                                                    </div>
                                                                    <div className='d-flex align-items-center mb-3'>
                                                                        <img src={data?.mentee_details?.image} onError={(e) => e.currentTarget.src = "/assets/images/UserProfile.png"}
                                                                            alt="" className="list_img_gd_11 me-2" />
                                                                        <p className='mb-0'>{data?.mentee_details?.first_name}</p>
                                                                    </div>
                                                                    <h5 className='text-dark fw-bold'>{data?.title}</h5>
                                                                    <div className='d-flex'>
                                                                        {/* <button type='button' className='btn_learn_goal one_line text-truncate px-1 py-2 w-50 me-2' onClick={() => { togglePopup(); setMenteeinfo(data?.mentee_details) }}>Know Your Mentee</button> */}
                                                                        {/* <Link to={'/pending_approval'} className='w-50'><button type='button' className='btn_theme px-1 py-2 w-100'>View Session</button></Link> */}
                                                                        {/* <div className='d-flex justify-content-end'><button className='btn_theme px-3 py-2 ' onClick={togglePopup1}>Review your mentor</button></div> */}
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        ))
                                                    }

                                                    {/* <Col xxl="4" md="6" className='mb-3'>
                                                            <div className='box_empty'>
                                                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                    <button className='Completed'>Completed</button> <h5 className='text-gray fw-bold mb-0'>Valid until 20 Dec</h5>
                                                                </div>
                                                                <div className='d-flex align-items-center mb-3'>
                                                                    <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                    <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                </div>
                                                                <h5 className='text-dark fw-bold'>Admission Strategy</h5>
                                                            </div>
                                                        </Col>

                                                        <Col xxl="4" md="6" className='mb-3'>
                                                            <div className='box_empty'>
                                                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                    <button className='under_review'>Refunded</button> <h5 className='text-gray fw-bold mb-0'>Valid until 20 Dec</h5>
                                                                </div>
                                                                <div className='d-flex align-items-center mb-3'>
                                                                    <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                    <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                </div>
                                                                <h5 className='text-dark fw-bold'>Career Guidance</h5>
                                                            </div>
                                                        </Col> */}

                                                    <Modal className='cutome_popup ' isOpen={modal1} toggle={togglePopup1} centered={true}  {...args}>
                                                        <ModalBody className='p-4 '>
                                                            <div className='px-2 position-relative'>
                                                                <h2 className='text-center mt-3 fw-bold'>Review your mentor</h2>

                                                                <div className='pt-3'>
                                                                    <div className="form-group">
                                                                        <Label className="form-label fw-600" htmlFor='MNAMWE333'>Mentor Name</Label>
                                                                        <div className="input-container"><Input type="text" className="form-control" id="MNAMWE333" placeholder="Vignesh Anbazhagan" required="" /></div>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <Label className="form-label fw-600">  Select the star rating  </Label>
                                                                        <div className='d-flex align-items-center mb-3 mb-xl-4'>
                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" />
                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" />
                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" />
                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" />
                                                                            <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 me-lg-3 start-icon-big" />
                                                                        </div>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <Label className="form-label fw-600" htmlFor='revI12'>Write a review</Label>
                                                                        <div className="input-container">
                                                                            <textarea 
                                                                                id='revI12'
                                                                                className="form-control"
                                                                                placeholder="Type here.."
                                                                                rows={8} // Adjust the number of columns as needed
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='d-flex justify-content-center'><button className='btn_theme py-3 px-5 mb-lg-4 mb-3 mt-3 '>Submit</button></div>
                                                                <div className="model_close_icon" onClick={togglePopup1}> <img src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /> </div>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>
                                                </Row> :
                                                <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                                    <img src='/assets/nodata.png' className='w-50' />
                                                </div>
                                        }
                                    </TabPane>
                                </TabContent>
                            </div>
                        </div>
                    </Col>
                </Col>
            </Row>
        </section>
    </>
    )
}

export default MyBooking