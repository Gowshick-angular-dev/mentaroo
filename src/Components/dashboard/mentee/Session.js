import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { PostSchedule, getMySession, getSchedule } from '../mentor/request';
import { useAuth } from '../../Auth/core/Auth';
import cn from 'classnames';
import moment from 'moment/moment';
import Meta from '../../../services/Meta';
import TeamsComponent from '../../Teams/teamsMain';

const Sessions = (...args) => {
    const router = useNavigate();
    const handleGoBack = () => {
        router(-1);
    };

    const { state } = useLocation()
    const [modal, setModal] = useState(false);
    const { auth } = useAuth();
    const [modal1, setModal1] = useState(false);
    const [showPopup1, setShowPopup1] = useState(false);
    const [weekday, setWeekdays] = useState([])
    const [dayCount, setDaycount] = useState(30)
    const [slotTime, setslotTime] = useState('9:00 AM')
    const [currentDate, setcurrentDate] = useState(dayjs().format('ddd'))
    const [getSlotData, setSlotData] = useState([])
    const [selectDates, setselectDates] = useState(dayjs().format('DD MMMM YYYY'))
    const [loading, setLoading] = useState(false);
    const [scheduleLoading, setScheduleLoading] = useState(false);
    const [sessionList, setsessionList] = useState([]);
    const [sessionStaus, SetSessionStatus] = useState('pending')

    const [teamsMeetingLink, setTeamsMeetingLink] = useState('');

    const handleSchedule = async () => {
        try {
            setScheduleLoading(true);
            const [start_time, start_modifier] = getSlotData[0]?.start_time.split(' ');
            let [start_hours, start_minutes] = start_time.split(':');
            if (start_modifier === 'PM' && start_hours !== '12') {
                start_hours = parseInt(start_hours, 10) + 12;
            } else if (start_modifier === 'AM' && start_hours === '12') {
                start_hours = '00';
            }

            const formattedStartDateTime = `${getSlotData[0]?.date} ${start_hours}:${start_minutes}`;
            const startDateObject = new Date(formattedStartDateTime);

            const [end_time, end_modifier] = getSlotData[0]?.end_time.split(' ');
            let [end_hours, end_minutes] = end_time.split(':');
            if (end_modifier === 'PM' && end_hours !== '12') {
                end_hours = parseInt(end_hours, 10) + 12;
            } else if (end_modifier === 'AM' && end_hours === '12') {
                end_hours = '00';
            }

            const formattedEndDateTime = `${getSlotData[0]?.date} ${end_hours}:${end_minutes}`;
            const endDateObject = new Date(formattedEndDateTime);

            const resTeams = await fetch(process.env.REACT_APP_TEAMS_MEETING_FUNCTION + '?start=' + startDateObject.toISOString() + '&end=' + endDateObject.toISOString() + '&title=Schedule');
            const link = await resTeams.text();
            const meet = JSON.parse(link);
            // setTeamsMeetingLink(resTeams?.meetingLink);
            console.log('tttttttttttttttttttttttttttttttttttt: ', JSON.parse(link));
            

            var formData = new FormData();
            formData.append('id', scheduleIndex?.id ?? '')
            formData.append('booking_id', state?.id ?? '')
            formData.append('user_id', auth?.user_id ?? scheduleIndex?.menteeDetails?.id ?? '')
            formData.append('tutor_id', state?.mentor ?? scheduleIndex?.mentorDetails?.id ?? '')
            getSlotData.map(async (v, i) => {
                console.log('daterrrrrrrrrrrrrrrrrr:', startDateObject.toISOString(), endDateObject.toISOString());
                formData.append(`mentor_slot_id[${i}]`, v?.id ?? '');
                formData.append(`day[${i}]`, v?.day ?? '');
                formData.append(`date[${i}]`, v?.date ?? "");
                formData.append(`start_time[${i}]`, v?.start_time ?? '');
                formData.append(`end_time[${i}]`, v?.end_time ?? '');
                formData.append(`valid_till[${i}]`, '');
                formData.append(`meeting_link[${i}]`, meet?.meetingLink);
            })
            console.log("formData,",formData)
            const response = await PostSchedule(formData)
            toast.success('Selected');
            fecthSession();
            setScheduleLoading(false);
            togglePopup();
        } catch(error) {
            setScheduleLoading(false);
            console.error(error);            
            console.log(error);            
            toast.success(error.message);
        }
    }

    const fecthSession = (schId, status) => {
        setLoading(true)
        getMySession(state?.id, schId, status).then(res => {
            setLoading(false)
            setsessionList(res?.data)
            // fetcSlotsList(res?.data[0]?.mentorDetails?.id);
        }).catch(err => {
            console.log('err', err.message);
            setLoading(false)
        })
    }

    useEffect(() => {
        if (state?.id) {
            fecthSession();
        } else {
            router('/my-bookings')
        }
    }, [])

    const [slotsList, setSlotsList] = useState([])

    const fetcSlotsList = (id) => {
        getSchedule(id).then(res => {
            setSlotsList(res.data);
            getUpcomingDays(parseInt(res.data[0]?.duration ?? dayCount) ?? dayCount);
        }).catch(err => {
            console.log("err", err.message);
            getUpcomingDays(dayCount)
        });
    }

    useEffect(() => {
        const id = state?.mentor;
        if (id) {
            fetcSlotsList(id);
        }
    }, [])

    const [scheduleIndex, setScheduleIndex] = useState({})
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const [currentActiveTab1, setCurrentActiveTab1] = useState('1');
    const [showPopup, setShowPopup] = useState(false);

    function scrollContent(amount) {
        // var container = document.querySelector('.scroll-container');
        // container.scrollLeft += amount;
        var container = document.getElementById('setScroller')
        container.scrollBy({
            behavior: 'smooth',
            left: amount
        })
    }

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
            setCurrentActiveTab(tab);
        }

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


    const togglePopup = () => {
        setModal(!modal);
        setShowPopup(false);
    };

    const [scrollPosition, setScrollPosition] = useState(0);
    const scrollRef = useRef(null);

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
    // }, [dayCount])


    return (<>
        <Meta title={'Session'} />
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
                            <h2 className='mb-4'>My Programs</h2>
                            <div className='d-flex align-items-center'>
                                <img onClick={handleGoBack} src={`/assets/images/__black left arrow.png`} alt="" className="me-3 me-xl-4 arrow_back" />
                                <h5 className='fw-bold'>Current/<span className='theme_color'>{state?.program ?? ''}</span></h5>
                            </div>

                            <div className='tab_my_program'>
                                <Nav tabs className="mt-xl-5 mt-lg-4 mt-3 custome_screy ">
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '1'
                                            })}
                                            onClick={() => { toggle('1'); SetSessionStatus('pending') }}
                                        >
                                            Pending for Approval
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '2'
                                            })}
                                            onClick={() => { toggle('2'); SetSessionStatus('confirmed') }}
                                        >
                                            Confirmed
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '3'
                                            })}
                                            onClick={() => { toggle('3'); SetSessionStatus('live') }}
                                        >
                                            Live
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '4'
                                            })}
                                            onClick={() => { toggle('4'); SetSessionStatus('past') }}
                                        >
                                            Past
                                        </NavLink>
                                    </NavItem>

                                    <NavItem>
                                        <NavLink
                                            className={classnames({
                                                active:
                                                    currentActiveTab === '5'
                                            })}
                                            onClick={() => { toggle('5'); SetSessionStatus('refunded') }}
                                        >
                                            Refunded
                                        </NavLink>
                                    </NavItem>
                                </Nav>

                                <Modal className='cutome_popup ' isOpen={modal} toggle={togglePopup} centered={true}  {...args}>
                                    <ModalBody className=''>
                                        <div className=' position-relative'>
                                            <div className='d-flex justify-content-between align-items-center px-3 pt-3'>
                                                <h3 className=' my-0 fw-bold'>Schedule a Program</h3>
                                                <img onClick={togglePopup} src={`/assets/images/cancel.png`} alt="" className="icon_size" />
                                            </div>
                                            <hr></hr>
                                            <div className='px-md-4 px-3 pb-4'>
                                                <p className='fw-bold text-dark mb-1'>Dates & Spots </p>
                                                <p>In your local time (Asia/Calcutta).</p>
                                                <div className='tab_my_program slot_booking'>
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
                                                        <i className="fa fa-angle-right ms-2" aria-hidden="true" onClick={() => { scrollContent(500); setDaycount((p) => p + 5) }}></i>
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
                                                                                // if(getSlotData.length < 1) {
                                                                                //     getSlotData.some(e => e.id === data?.id) ? setSlotData(getSlotData.filter(r => r.id != data.id )) :
                                                                                //     setSlotData((p)=> [...p,{...data,date:selectDates}]) 
                                                                                // }else {
                                                                                //     setSlotData(getSlotData.filter(r => r.id != data.id ))
                                                                                // } 
                                                                                if (moment(selectDates, 'DD MMMM YYYY').isSame(moment(data?.schedule_booked_date, 'DD MMMM YYYY'))) {
                                                                                    return null
                                                                                } else {
                                                                                    setSlotData((p) => [{ ...data, date: selectDates }])
                                                                                }
                                                                            }} className={`slot_time text-nowrap ${moment(selectDates, 'DD MMMM YYYY').isSame(moment(data?.schedule_booked_date, 'DD MMMM YYYY')) && 'bg-light bg-gradient'} text-center ${getSlotData.some(e => e.id === data?.id) && 'active'}`}>{data?.start_time + '-' + data?.end_time}</div> : ''
                                                                    ))
                                                                }
                                                                {/* <div role='button' onClick={() => setslotTime('9:00 AM')} className={`slot_time text-nowrap text-center ${slotTime === '9:00 AM' && 'active'}`}>9:00 AM</div> */}
                                                            </div>
                                                        </TabPane>
                                                    </TabContent>

                                                    <div className='mt-4 d-flex align-items-center justify-content-between'>
                                                        <h4 className='mb-0'>{getSlotData[0]?.start_time ?? '00:00'} - {getSlotData[0]?.end_time ?? "00:00"}</h4>
                                                        {/* <button type='button' className='btn_theme py-3 px-4' onClick={() => {
                                                                    togglePopup(); stSessionStatus((p) => { p[scheduleIndex].slots = `${currentDate} - ${slotTime}`; return p }); toast.success('Selected.');
                                                                }}>Reschedule</button> */}
                                                        {!scheduleLoading &&
                                                        <button type='button' className='btn_theme py-3 px-4' onClick={() => handleSchedule()}>Schedule</button>}
                                                        {scheduleLoading &&
                                                        <div className='pageLoading'>
                                                            <span
                                                                className={cn(
                                                                    'd-flex h-25vh w-100 flex-column align-items-center justify-content-center'
                                                                )}
                                                            >
                                                                <span className={"loading"} />
                                                            </span>
                                                        </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </ModalBody>
                                </Modal>

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
                                        </div> :
                                        <TabContent activeTab={currentActiveTab}>
                                            <TabPane tabId={currentActiveTab}>
                                                <Row className='mb-4 mt-3'>
                                                    <Col xxl="4" md="6" className='mb-3 d-none'>
                                                        <div className='box_empty h-100 d-flex flex-column justify-content-between'>
                                                            <div className=''>
                                                                <div className='d-flex align-items-center mb-3'>
                                                                    <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                    <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                </div>
                                                                <h5 className='text-dark fw-bold'>Introductory Call: Session 1</h5>
                                                                <div className='d-flex align-items-center mb-3'>
                                                                    <img src="/assets/images/__time.png" alt="" className="time-img me-1" />
                                                                    {/* <p className='mb-0 theme_color fw-bold'>18 November 2023 . 12:00 PM</p> */}
                                                                    <p className='mb-0 theme_color fw-bold'>{currentDate} {slotTime}</p>
                                                                </div>
                                                            </div>
                                                            <div className='d-flex  flex-wrap align-items-center'>
                                                                <button type='button' className='btn_theme mb-2 px-md-4 px-2 py-2  me-2 d-flex align-items-center' onClick={togglePopup}>
                                                                    <i className="fa fa-calendar me-2" aria-hidden="true"></i>
                                                                    Schedule</button>
                                                                <button type='button' className='Completed px-md-4 mb-2 px-lg-3 px-2 py-2 me-2 ' >Approve</button>
                                                                <button type='button' className='extended px-md-4 mb-2 px-lg-3 px-2 py-2 me-2 ' >Reject</button>
                                                            </div>
                                                        </div>
                                                    </Col>

                                                    {sessionList?.filter(e => sessionStaus == 'confirmed' ? (e.case == sessionStaus || e.case == 'live') : e.case == sessionStaus).length > 0 ?
                                                        sessionList?.filter(e => sessionStaus == 'confirmed' ? (e.case == sessionStaus || e.case == 'live') : e.case == sessionStaus).map((data, index) => (
                                                            <Col xxl="4" md="6" className='mb-3' key={index}>
                                                                <div className='box_empty h-100  d-flex flex-column justify-content-between'>
                                                                    <div className=''>
                                                                        <div className='d-flex align-items-center mb-3'>
                                                                            <img src={data?.image ?? ''} onError={(e) => e.currentTarget.src = '/assets/images/UserProfile.png'} alt="" className="list_img_gd_11 me-2" />
                                                                            <p className='mb-0'>{data?.mentorDetails?.first_name}</p>
                                                                        </div>
                                                                        <h5 className='text-dark fw-bold'>{'Session' + ' ' + (index + 1)}</h5>
                                                                        <div className='d-flex align-items-center mb-3'>
                                                                            <img src="/assets/images/__time.png" alt="" className="time-img me-1" />
                                                                            {/* <p className='mb-0 theme_color fw-bold'>18 November 2023 . 12:00 PM</p> */}
                                                                            <p className='mb-0 theme_color fw-bold'>{data?.date ?? ''} {data?.start_time ?? "00:00"} -  {data?.end_time ?? "00:00"}</p>
                                                                        </div>
                                                                    </div>
                                                                    {
                                                                        sessionStaus == 'pending' ?
                                                                                <div className='d-flex flex-wrap align-items-center'>
                                                                                {
                                                                                    data?.date && data?.start_time && data?.end_time ? "" :
                                                                                        <button type='button' className='btn_theme px-md-4 px-2 mb-2 py-2 me-2  d-flex align-items-center' onClick={() => {
                                                                                            setScheduleIndex(data)
                                                                                            const TabInd = weekday.findIndex(e => dayjs(e.date).format('DD MMMM 2024') === dayjs(data.date).format('DD MMMM 2024')) ?? 0;
                                                                                            if (TabInd >= 0) {
                                                                                                setCurrentActiveTab1(`${TabInd + 1}`);
                                                                                                setcurrentDate(data?.selected_days ?? dayjs().format('ddd'));
                                                                                                setselectDates(dayjs(data.date).format('DD MMMM 2024') ?? dayjs().format('DD MMMM 2024'))
                                                                                                setSlotData((p) => [{ id: data?.mentor_slot_id, start_time: data?.start_time, end_time: data?.end_time, day: data?.selected_days, date: dayjs(data.date).format('DD MMMM 2024') }])
                                                                                            } else {
                                                                                                setCurrentActiveTab1(`${1}`);
                                                                                                setcurrentDate(dayjs().format('ddd'));
                                                                                                setselectDates(dayjs().format('DD MMMM YYYY'))
                                                                                                setSlotData([])
                                                                                            }
                                                                                            togglePopup();  
                                                                                        }}
                                                                                        >
                                                                                            <i className="fa fa-calendar me-2" aria-hidden="true"></i>
                                                                                            Book a Slot</button>
                                                                                }
                                                                            </div> : 
                                                                            sessionStaus == 'confirmed' || sessionStaus == 'live' ?
                                                                                <div className='d-flex justify-content-end'> 
                                                                                    <Link type='button' className='btn_theme px-4 py-2' to={"/meeting?url=" + data?.meeting_link}>
                                                                                        Join Now
                                                                                    </Link>
                                                                                    {/* <button type='button' className='btn_theme px-4 py-2'>Join Now</button> */}
                                                                                </div>
                                                                                : ''
                                                                    }
                                                                </div>
                                                            </Col>
                                                        )) :
                                                        <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                                            <img src='/assets/nodata.png' className='w-50' />
                                                        </div>
                                                    }
                                                </Row>
                                            </TabPane>
                                            {/* <TabPane tabId='3'>
                                                    <TeamsComponent/>
                                            </TabPane> */}

                                        </TabContent>
                                }
                            </div>
                        </div>
                    </Col>
                </Col>
            </Row>
        </section>
    </>
    )
}

export default Sessions