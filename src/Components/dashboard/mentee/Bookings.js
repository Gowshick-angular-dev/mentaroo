import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Form, Label, Button, Input, Col, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { getBookingslots } from '../../pages/core/_request';
import { getSchedule } from '../mentor/request';
import Meta from '../../../services/Meta';

const SlotBooking = ({ setOpenSlots, getSlotData, mentors, Sprograms, plans, setSlotData, isloading, handleCheckout, direction, ...args }) => {

    const router = useNavigate();

    const handleGoBack = () => {
        // router(-1); 
        setOpenSlots(false)
    };

    const [modal, setModal] = useState(false);

    const [showPopup, setShowPopup] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);


    const [selectDates, setselectDates] = useState(dayjs().format('DD MMMM YYYY'))
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const [currentActiveTab1, setCurrentActiveTab1] = useState('1');
    const [weekday, setWeekdays] = useState([])
    const [dayCount, setDaycount] = useState(30)
    const [slotTime, setslotTime] = useState([])
    // const [currentDate, setcurrentDate] = useState(dayjs().format('DD MMMM YYYY')) 
    const [currentDate, setcurrentDate] = useState(dayjs().format('ddd'))


    const [slotsList, setSlotsList] = useState([])

    const scrollRef = useRef(null);

    const toggle1 = (tab) => {
        if (currentActiveTab1 !== tab) {
            setCurrentActiveTab1(tab);
        }

        if (tab === '1') {
            setShowPopup(true);
            setShowPopup1(true);
        } else {
            setShowPopup(false);
            setShowPopup1(false);
        }
    };

    function scrollContent(amount) {
        // var container = document.querySelector('.scroll-container');
        // container.scrollLeft += amount;
        var container = document.getElementById('setScroller')
        container.scrollBy({
            behavior: 'smooth',
            left: amount
        })
    }

    const fetcSlotsList = (id) => {
        getSchedule(id).then(res => {
            setSlotsList(res.data);
            getUpcomingDays(parseInt(res.data[0]?.duration ?? dayCount) ?? dayCount)
        }).catch(err => {
            console.log("err", err.message);
            getUpcomingDays(dayCount)
        });
    }

    useEffect(() => {
        const id = mentors?.users?.id;
        if (id) {
            fetcSlotsList(id);
        }
    }, [mentors])

    function getUpcomingDays(count) {
        const today = dayjs(); // get current date

        // Array to store upcoming dates
        const upcomingDays = [];
        upcomingDays.push({ date: today.format('MMM D'), day: today.format('ddd') })
        // Loop to get the next n days
        if (count > 0) {
            for (let i = 1; i <= count; i++) {
                const nextDay = today.add(i, 'day');
                upcomingDays.push({ date: nextDay.format('MMM D'), day: nextDay.format('ddd') });
            }
        } else {
            let newcount = count * -1
            for (let i = 1; i <= newcount; i++) {
                const nextDay = today.subtract(i, 'day');
                upcomingDays.push({ date: nextDay.format('MMM D'), day: nextDay.format('ddd') });
            }
        }

        setWeekdays(upcomingDays);
    }

    // useEffect(() => {
    //     getUpcomingDays(dayCount)
    // }, [])
    // }, [dayCount])

    const togglePopup = () => {
        setModal(!modal);
        setShowPopup(false);
    };



    return (
        <div className=''> 
    <Meta title={'Booking'}  />

            <div className='inner_header'>
                <Container className='d-xl-flex d-none justify-content-between align-items-center py-2'>
                    <img onClick={handleGoBack} src={`/assets/images/homepg/left-white.png`} alt="" className="img-fluid arrow-back" />
                    <div className="brand-logo ">
                        <Link href="/"><img src={`/assets/images/homepg/logo.png`} alt="" className=" logo_booking" /></Link>
                    </div>
                    <div ></div>
                </Container>
                <Container className='d-flex d-xl-none justify-content-between align-items-center py-2'>
                    <div className="brand-logo ">
                        <Link href="/"><img src={`/assets/images/homepg/logo.png`} alt="" className=" logo_booking" /></Link>
                    </div>
                    <img src="/assets/images/__Menu.png" alt="" className="menu_icon m-0" />
                </Container>
            </div>

            <Row className='h-100vh'>
                <Col xl="6" className='d-xl-flex justify-content-end'>
                    <Modal className='cutome_popup popvn' isOpen={modal} toggle={togglePopup} centered={true}  {...args}>
                        <ModalBody className='p-4 '>
                            <div className='px-2 position-relative'>
                                <h2 className='text-center mt-3 fw-bold'>Level Up Your Growth: Let's Navigate Success Together!</h2>


                                <div className='d-flex justify-content-center my-3 '>
                                    <img src={`/assets/images/__Subscribe.png`} alt="" className="" />
                                </div>

                                <p className='text-center'>Unlock personalized mentorship, industry insights, and exclusive perks. Propel your career to new heights</p>

                                <div className='d-sm-flex justify-content-center'>
                                    <div className='subsracibe mt-3 col-xl-9'>
                                        <input type='text' className='w-100 text-truncate' placeholder='Enter your email address' /><button className='ms-2 text-nowrap btn_theme px-4 py-2'>Subscribe now</button>
                                    </div>
                                </div>

                                <div className="model_close_icon" onClick={togglePopup}> <img src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /> </div>
                            </div>
                        </ModalBody>

                    </Modal>
                    <div className='col-xxl-9 col-xl-10  py-4'>
                        <div className='left_side_booking pe-xxl-4 px-3'>
                            <h2 className='mb-xl-4 mb-3'>Book a Slot</h2>

                            <p className='fw-bold text-dark mb-1'>Dates & Spots </p>
                            <p>In your local time (Asia/Calcutta).</p>

                            <div className='tab_my_program slot_booking '>
                                {/* <div className='d-flex align-items-center mt-xl-5 mt-lg-4 mt-3 '>
                                        <i className="fa fa-angle-left" aria-hidden="true" onClick={handleLeftClick}></i>
                                        <Nav tabs className="custome_scrolll d-flex align-items-center flex-nowrap" ref={scrollRef}>
                                            
                                            <NavItem>
                                                <NavLink className={classnames({
                                                    active:
                                                        currentActiveTab === '1'
                                                })}
                                                    onClick={() => { toggle('1'); }}
                                                >
                                                    <p className='mb-1'>THU</p>
                                                    Nov 16
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <i className="fa fa-angle-right" aria-hidden="true" onClick={handleRightClick}></i>
                                    </div> */}
                                <div className='d-flex align-items-center mt-xl-5 mt-lg-4 mt-3 '>
                                    <i className="fa fa-angle-left me-2" aria-hidden="true" onClick={() => scrollContent(-500)}></i>
                                    <Nav tabs id='setScroller' className="custome_scrolll scroll-container d-flex align-items-center flex-nowrap" >
                                        {
                                            weekday?.map((data, index) => (
                                                <NavItem key={index}>
                                                    <NavLink className={classnames({
                                                        active:
                                                            currentActiveTab1 === `${index + 1}`
                                                    })}
                                                        // onClick={() => { toggle1(`${index + 1}`); setcurrentDate(dayjs(data.date).format('DD MMMM 2024')) }}
                                                        onClick={() => {
                                                            toggle1(`${index + 1}`); setcurrentDate(data?.day);
                                                            setselectDates(dayjs(data.date).format('DD MMMM 2024'))
                                                        }}
                                                    >
                                                        <p className='mb-1 text-uppercase'>{data?.day}</p>
                                                        <span className='text-uppercase'>{data?.date}</span>
                                                    </NavLink>
                                                </NavItem>
                                            ))
                                        }
                                    </Nav>
                                    <i className="fa fa-angle-right ms-2" aria-hidden="true" onClick={() => {
                                        scrollContent(500); setDaycount((p) => p + 5)
                                    }}></i>
                                </div>

                                <TabContent activeTab={currentActiveTab1}>
                                    <TabPane tabId={currentActiveTab1}>
                                        <div className='d-flex flex-wrap mt-3'>

                                            {
                                                !slotsList.some(e => e.day.toLowerCase() == currentDate.toLowerCase()) ?
                                                    <div className='text-center w-100'>Not Available</div> : ''
                                            }

                                            {
                                                slotsList.map((data, index) => (
                                                    currentDate.toLowerCase().includes(data?.day.toLowerCase()) ?
                                                        <div role='button' key={index} onClick={() => {
                                                            if (getSlotData.length < parseInt(plans?.sessions ?? 0)) {
                                                                getSlotData.some(e => e.id === data?.id) ? setSlotData(getSlotData.filter(r => r.id != data.id)) :
                                                                    setSlotData((p) => [...p, { ...data, date: selectDates }])
                                                            } else {
                                                                setSlotData(getSlotData.filter(r => r.id != data.id))
                                                            }

                                                        }} className={`slot_time text-nowrap text-center ${getSlotData.some(e => e.id === data?.id) && 'active'}`}>{data?.start_time + '-' + data?.end_time}</div> : ''
                                                ))
                                            }
                                            {/* <div role='button' onClick={() => setslotTime('10:00 AM')} className={`slot_time text-nowrap text-center ${slotTime === '10:00 AM' && 'active'}`}>10:00 AM</div>
                                                <div role='button' onClick={() => setslotTime('11:00 AM')} className={`slot_time text-nowrap text-center ${slotTime === '11:00 AM' && 'active'}`}>11:00 AM</div>
                                            */}
                                        </div>
                                    </TabPane>
                                </TabContent>
                            </div>

                        </div>
                    </div>
                </Col>
                <Col xl="6" className='bg_bookinb '>
                    <div className='col-xxl-7 col-xl-9  ps-xxl-5 ps-3'>
                        <div className='bg_boogisg_card my-4'>
                            <div className='d-flex align-items-center py-3'>
                                <img src={mentors?.users?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="img_author_booking me-3" />
                                <div className=''>
                                    <h3>{mentors?.users?.first_name ?? ''} </h3>
                                    <p className='theme_color fw-bold'>{mentors?.mentor_job_name ?? ''}</p>
                                </div>
                            </div>

                            <hr></hr>

                            <div className='py-3'>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>Program</h5>
                                    <h5>{Sprograms?.title ?? '-'}</h5>
                                </div>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>No of sessions</h5>
                                    <h5>{plans?.sessions ?? '-'}</h5>
                                </div>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>Duration</h5>
                                    <h5>{Sprograms?.class_time ?? '-'}</h5>
                                </div>
                            </div>

                            <hr></hr>

                            {/* <button className='btn_book mt-3' onClick={togglePopup}> */}
                            <button className='btn_book mt-3' type='button' onClick={() => !isloading && handleCheckout()}>
                                {
                                    isloading ? <>
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            aria-hidden="true"
                                        ></span>
                                        <span role="status">Loading...</span>
                                    </> : 'Book a slot'
                                }
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

        </div>

    )
}

export default SlotBooking;