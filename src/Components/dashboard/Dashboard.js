import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, button, Modal, ModalBody, Label } from 'reactstrap';
import SideBar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import { useAuth } from '../Auth/core/Auth';
import { getOnboardingPdfDown, getPdfDown } from './mentor/request';
import { TopMatchSection, VerifyCationApi, genarteOtp, getMyMentorsList, getSuggession, shareExpMentaroo, wallofGrattitute } from './requests';
import { Link, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { Rating } from '@mui/material';
import Meta from '../../services/Meta';
import toast from 'react-hot-toast';


const Dashboard = ({ ...args }) => {
    const [accountInfo, setAccountInfo] = useState(false)
    const [selectedOption, setSelectedOption] = useState(
        localStorage.getItem('selectedOption') || 'mentee'
    );

    const [rating, setRating] = useState(1);
    const [reviewValue, setReviewValue] = useState('')
    const [suggesion, setsuggesion] = useState([])

    const router = useNavigate();
    const { currentUser, auth } = useAuth();
    const [pdf, setPdf] = useState();
    const [Mentors, setMentors] = useState();
    const [Mymentors, setMymentors] = useState();
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [Otpsend, sended] = useState(false);

    const handlePostreview = (e) => {
        e.preventDefault()
        if (!reviewValue) {
            return toast.error('Select Message!')
        }
        var formData = new FormData();
        formData.append('user_id', auth?.user_id)
        formData.append('exp', reviewValue?.id)
        formData.append('rating', rating)

        shareExpMentaroo(formData).then(res => {
            toast.success(res?.message ?? "Posted!");
            setReviewValue('')
            setRating(1);
        }).catch(err => {
            console.log("err", err.message)
        })
    }

    const handleGenerateOtp = () => {
        var formData = new FormData();
        formData.append('phone', auth?.phone)
        genarteOtp(formData).then(res => {
            if (res.status == 200) {
                toast.success("OTP SENDED!")
                toggle();
            } else {
                toast.error(res?.message);
            }
        }).catch((err) => {
            console.log("err", err.message);
            toast.error(err?.message);
        })
    }

    const ReSendeOtp = () => {
        var formData = new FormData();
        formData.append('phone', auth?.phone)
        genarteOtp(formData).then(res => {
            if (res.status == 200) {
                toast.success("OTP SENDED!")
            } else {
                toast.error(res?.message)
            }
        }).catch((err) => {
            toast.error(err?.message);
        })
    }

    const handleVerifyCation = () => {
        const phone = auth?.phone;
        const otp = otpValues.join('');
        VerifyCationApi(phone, otp).then(res => {
            if (res.status == 200) {
                toast.success("Verified Mobile Number!");
                toggle();
                setOtpValues(["", "", "", "",  "",  ""]);
            } else {
                toast.error(res?.message)
            }
        }).catch((err) => {
            console.log("err", err.message);
        })
    }


    const handleDownloadPdf = () => {
        const id = auth?.user_id;
        getOnboardingPdfDown(id).then(res => {
            setPdf(res?.data);
            let fileName = 'Kit.pdf';
            fetch(res.data)
                .then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                })
                .catch(error => {
                    console.error('Error fetching PDF: ', error);
                    window.open(res.data, "_blank");
                });
        }).catch(err => {
            console.log('err', err?.message);
            // Handle error
        });
    }

    const handleDownloadPdf2 = () => {
        const id = auth?.user_id;
        getPdfDown().then(res => {
            let fileName = 'Terms_Conditions.pdf';
            // setPdf(res?.data)
            fetch(res.data).then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName)
                    document.body.appendChild(link);
                    link.click();
                    link.remove()
                }).catch(error => {
                    console.error('Error fetching PDF: ', error);
                    window.open(res.data, "_blank");
                })
        }).catch(err => {
            console.log('err', err?.message);
        })
    }

    useEffect(() => {
        if (currentUser === 'mentee') {
            const id = auth?.user_id;
            setLoading(true)
            getMyMentorsList(id).then((res) => {
                if (res?.data.length > 0) {
                    setMymentors(res?.data);
                } else {
                }
                setLoading(false)
            }).catch(err => {
                console.log("err", err?.message);
                setLoading(false)
            })

            TopMatchSection(id).then((res) => {
                setMentors(res?.data);
                setLoading(false)
            }).catch(err => {
                console.log("err", err?.message);
                setLoading(false)
            })
        } else if (currentUser === 'mentor') {
            setLoading(true)
            const id = auth?.user_id;
            wallofGrattitute(id).then((res) => {
                setMentors(res?.data);
                setLoading(false)
            }).catch(err => {
                console.log("err", err?.message);
                setLoading(false)
            })

            getSuggession().then(res => {
                setsuggesion(res?.data ?? []);
                setLoading(false)
            }).catch(err => {
                console.log('err', err.message);
                setLoading(false)
            })
        }
    }, []);

    useEffect(() => {
        const storedSelectedOption = localStorage.getItem('selectedOption');
        const currentUser = localStorage.getItem('token');
        if (storedSelectedOption) {
            setSelectedOption(storedSelectedOption);
        }
    }, []);

    const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleFocus = (index) => {
        setActiveIndex(index);
    };

    const inputRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null),
    ];

    const handleChange = (index, e) => {
        const value = e.target.value.replace(/[^0-9]/g, "");

        if (value.length === 1 && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }
        if (value.length === 0 && index > 0) {
            inputRefs[index - 1].current.focus();
        }

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
    };

    const handleBackspace = (index, e) => {
        if (e.key === "Backspace" && index >= 0) {
            if (otpValues[index] === "") {
                inputRefs[index - 1]?.current.focus();
            } else {
                const newOtpValues = [...otpValues];
                newOtpValues[index] = "";
                setOtpValues(newOtpValues);
            }
        }
    };




    return (<>
        <Meta title={'Dashboard'} />
        <section className="section-b-space h-100vh">
            {/* <DashboardNavbar /> */}
            <Row className='h-100 custome_heifht'>
                <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
                    <div className='col-xl-9 d-flex justify-content-center'>
                        <SideBar></SideBar>
                    </div>
                </Col>

                <Col lg="9" className='px-xl-4 py-4 scrol_right'>
                    <Col xl="11">
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
                                </div> : currentUser === 'mentee' ?
                                  (
                                      <div className=''>
                                            <h2>Welcome to your Dashboard, {auth?.first_name ?? ''}!</h2>
                                            <p>Complete your profile to get full access to Mentaroo features.</p>
                                            <Row>
                                                <Col md="6" xl="4" className='mb-3' >
                                                    <div className='h-100 dashboard_bg'>
                                                        <h5 className='fw-500 text_grey two_line'>Confirm Your Email Address And Phone Number</h5>
                                                        <p className='two_line'>Complete your profile to get full access to Mentaroo features</p>
                                                        <button type='button' className='btn_dashboard_1 text-light'> <img src={`/assets/images/menteedashBoard/__Completed.png`} alt="" className=" me-2" />Completed</button>
                                                    </div>
                                                </Col>

                                                <Col md="6" xl="4" className='mb-3'>
                                                    <div className={`h-100 ${Mentors?.mentee_kit_download == 1 ? 'dashboard_bg' : 'dashboard_bg_yello'}`}>
                                                        <h5 className='fw-500 text_grey two_line'>Familiarize Yourself With Our Mentee Toolkit</h5>
                                                        <p className='two_line'>Our mentee onboarding kit can be a great resource for your to kick start your journey with Mentaroo</p>
                                                        {/* <button type='button' onClick={()=>handleDownloadPdf2()} className='btn_dashboard_2 text-light'> <img src={`/assets/images/menteedashBoard/__Pdf.png`} alt="" className=" me-2" />Download PDF</button> */}
                                                        <button type='button' onClick={() => handleDownloadPdf2()} className={Mentors?.mentee_kit_download == 1 ? 'btn_dashboard_1 text-light' :'btn_dashboard_2'}> <i className="fa fa-file-pdf-o me-2" aria-hidden="true"></i> Download PDF</button>
                                                    </div>
                                                </Col>

                                                <Col md="6" xl="4" className='mb-3'>
                                                    <div className={`h-100  ${Mentors?.firstMentor == 1 ? 'dashboard_bg' : 'dashboard_bg_yello'} position-relative`}>
                                                        <h5 className='fw-500 text_grey two_line'>Find Your {Mentors?.firstMentor == 1 ? "Next" : "First"} Mentor!</h5>
                                                        <p className='two_line'>No booked sessions yet? Mentors you've talked to will appear here for easy access.</p>
                                                        <button type='button' onClick={() => router('/mentor')} className={ Mentors?.firstMentor == 1 ? 'btn_dashboard_1 text-light' :' btn_dashboard_2 '}> {Mentors?.firstMentor == 1 ? 'Find a Next mentor' : 'Find a mentor'}</button>
                                                        <img src={ Mentors?.firstMentor == 1 ?  '/assets/images/__find_men.png' :  `/assets/images/menteedashBoard/__find Mentor Bg icon.png`} alt="" className={"position-absolute right-0 bottom-0 me-2 img_dashboard_content"} />
                                                    </div>
                                                </Col>

                                                <Col md="6" xl="4" className='mb-3 d-xl-none d-block'>
                                                    <div className='dashboard_bg_lgren position-relative'>
                                                        <h5 className='fw-500 text_grey one_line pt-3'>Your Goal Is To Become A...</h5>
                                                        <p className='text-uppercase four_line'>{auth?.career_goal?.name ?? ""}</p>
                                                        <img src={`/assets/images/menteedashBoard/__your Goal bg icon.png`} alt="" className="position-absolute right-0 bottom-0 me-2 img_dashboard_content" />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row className='mb-4'>
                                                <Col xl="8">
                                                    {
                                                        Mentors?.up_coming_sessions?.length > 0 ?
                                                            <div>
                                                                <h3 className='mb-3 mt-4'>Upcoming Sessions</h3>
                                                                <Row className='mb-4'>
                                                                    {
                                                                        Mentors?.up_coming_sessions?.map((data, index) => (
                                                                            <Col xxl="6" lg="12" md="6" className='mb-3' key={index}>
                                                                                <div className='box_empty'>
                                                                                    <div className='d-flex align-items-center mb-3'>
                                                                                        <img src={data?.tutorName?.image} onError={(e) => e.currentTarget.src = "/assets/images/UserProfile.png"} alt="" className="list_img_gd_11 me-2" />
                                                                                        <p className='mb-0'>{data?.tutorName?.first_name}</p>
                                                                                    </div>
                                                                                    <h5 className='text-dark fw-bold'>Session {index + 1}</h5>
                                                                                    <div className='d-flex align-items-center mb-3'>
                                                                                        <img src="/assets/images/__time.png" alt="" className="time-img me-1" />
                                                                                        <p className='mb-0'>{data?.date ?? ""} {data?.start_time ?? "00:00"} - {data?.end_time ?? "00:00"}</p>
                                                                                    </div>
                                                                                    <div className='d-flex justify-content-end'> <button className='btn_theme px-5 py-2'>Join Now</button></div>
                                                                                </div>
                                                                            </Col>
                                                                        ))
                                                                    }
                                                                </Row>
                                                            </div>
                                                            :
                                                            <div className='text-center my-3 box_empty' >
                                                                <h3 className='mb-3 text-center pt-4'>You haven't booked any sessions.</h3>
                                                                <p className='mb-3 text-center'>Ready to make the most of your experience? Start now by booking your first session and unlocking the full potential of our platform!yet</p>
                                                                <button type='button' onMouseOver={() => document.getElementById('imagehoverChange').src = "/assets/images/menteedashBoard/__gray search.png"} onMouseOut={() => document.getElementById('imagehoverChange').src = "/assets/images/menteedashBoard/__white Search.png"} onClick={() => router('/mentor')} className='btn_theme px-3 py-2 mb-4'>  <img id='imagehoverChange' src={`/assets/images/menteedashBoard/__white Search.png`} alt="" className="search_img me-2" />Find a mentor and send a session request</button>
                                                            </div>
                                                    }

                                                    {
                                                        Mymentors?.length > 0 ?
                                                            <h3 className='mb-3 mt-4'>My Mentors</h3> :
                                                            Mentors?.top_matches?.length > 0 ?
                                                                <h3 className='mb-3 mt-4'>Top Matches</h3> : ''
                                                    }

                                                    {
                                                        Mymentors?.length > 0 ?
                                                            <Row>
                                                                {
                                                                    Mymentors?.map((data, index) => (
                                                                        <Col xxl="6" lg="12" className="mb-3" key={index}>
                                                                            <Link to="/mentorDetails" state={{ id: data.id }}>
                                                                                <div className="listing-card h-100">
                                                                                    <div className="d-flex mb-3">
                                                                                        <div className=" me-3">
                                                                                            <img src={data?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd" />
                                                                                        </div>
                                                                                        <div className="edsf">
                                                                                            <h5 className="one_line mb-1">{data?.first_name ?? ''}</h5>
                                                                                            <p className="mb-1 theme_color one_line fw-bold">{data?.job_title}</p>
                                                                                            <p className="one_line mb-0">{parseInt(data?.year_of_experience) ?? '0'} yrs of Exp. </p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div className="d-flex align-items-center justify-content-between  mb-3">
                                                                                        <div className="custonePdhg d-flex align-items-center me-3">
                                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="img-satrt me-2" />
                                                                                            <h5>{data?.rating_count ?? 0}</h5>
                                                                                        </div>
                                                                                        <p className="mb-0 sm-font-p">{data?.total_mentees ?? 0} mentees</p>
                                                                                    </div>

                                                                                    <p className="three_line">{data?.biography ?? ''}</p>
                                                                                </div>
                                                                            </Link>
                                                                        </Col>
                                                                    ))
                                                                }
                                                            </Row> :
                                                            Mentors?.top_matches?.length > 0 ?
                                                                <Row>
                                                                    {
                                                                        Mentors?.top_matches?.map((data, index) => (
                                                                            <Col xxl="6" lg="12" className="mb-3" key={index}>
                                                                                <Link to="/mentorDetails" state={{ id: data.id }}>
                                                                                    <div className="listing-card h-100">
                                                                                        <div className="d-flex mb-3">
                                                                                            <div className=" me-3">
                                                                                                <img src={data?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd" />
                                                                                            </div>
                                                                                            <div className="edsf">
                                                                                                <h5 className="one_line mb-1">{data?.first_name ?? ''}</h5>
                                                                                                <p className="mb-1 theme_color one_line fw-bold">{data?.mentor_details?.job_title}</p>
                                                                                                <p className="one_line mb-0">{data?.mentorDetail?.yrs_of_exp ? parseInt(data?.mentorDetail?.yrs_of_exp) + "  yrs of Exp." : ''}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="d-flex align-items-center justify-content-between  mb-3">
                                                                                            <div className="custonePdhg d-flex align-items-center me-3">
                                                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="img-satrt me-2" />
                                                                                                <h5>{data?.overall_rating ?? 0}</h5>
                                                                                            </div>
                                                                                            <p className="mb-0 sm-font-p">{data?.total_mentees ?? 0} mentees</p>
                                                                                        </div>
                                                                                        <p className="three_line">{data?.biography ?? ''}</p>
                                                                                    </div>
                                                                                </Link>
                                                                            </Col>
                                                                        ))
                                                                    }
                                                                </Row> :
                                                                ''
                                                    }

                                                    {
                                                        Mentors?.reviews_to_other_mentors?.length > 0 ?
                                                            <h3 className='mb-3 mt-4'>Reviews to other Mentors</h3> : ''
                                                    }

                                                    {
                                                        Mentors?.reviews_to_other_mentors?.length > 0 ?
                                                            <Row>
                                                                {
                                                                    Mentors?.reviews_to_other_mentors?.map((data, index) => (
                                                                        <Col xxl="6" lg="12" className="mb-3" key={index}>
                                                                            <div className="listing-card_dashbord h-100">
                                                                                <div className="d-flex mb-3">
                                                                                    <div className=" me-3">
                                                                                        <img src={data?.user_detail?.image ?? ""} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd_1" />
                                                                                    </div>

                                                                                    <div className="edsf">
                                                                                        <p className="one_line mb-1 text-dark fw-bold">{data?.user_detail?.first_name ?? ''}</p>
                                                                                        <p className="one_line mb-0">{data?.user_detail?.job_title ?? ''}</p>
                                                                                    </div>
                                                                                </div>

                                                                                <p className="three_line">{data?.review ?? ''}</p>

                                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                                    <div className='d-flex align-items-center'> <img src={''} onError={(e) => e.currentTarget.src = `/assets/images/UserProfile.png`} alt="" className="list_img_gd_11 me-1" /><p className='mb-0'>{auth?.first_name ?? ''}</p></div>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        {
                                                                                            data?.rating > 0 &&
                                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        }
                                                                                        {
                                                                                            data?.rating > 1 &&
                                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        }
                                                                                        {
                                                                                            data?.rating > 2 &&
                                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        }
                                                                                        {
                                                                                            data?.rating > 3 &&
                                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        }
                                                                                        {
                                                                                            data?.rating > 4 &&
                                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Col>
                                                                    ))
                                                                }

                                                                {/* <Col xxl="6" lg="12" className="mb-3">
                                                                        <div className="listing-card_dashbord h-100">
                                                                            <div className="d-flex mb-3">
                                                                                <div className=" me-3">
                                                                                    <img src={`/assets/images/mentor6.png`} alt="" className="list_img_gd_1" />
                                                                                </div>
                                                                                <div className="edsf">
                                                                                    <p className="one_line mb-1 text-dark fw-bold">Raghu Datta</p>
                                                                                    <p className="one_line mb-0">Engineering Manager, Japanese Organisation</p>
                                                                                </div>
                                                                            </div>
                                                                            <p className="three_line">It was nice session. Gives me road map to full stack development for the interviews.</p>
                                                                            <div className='d-flex justify-content-between align-items-center'>
                                                                                <div className='d-flex align-items-center'> <img src={`/assets/images/UserProfile.png`} alt="" className="list_img_gd_11 me-1" /><p className='mb-0'>Dharma</p></div>
                                                                                <div className='d-flex align-items-center'>
                                                                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Col> */}
                                                            </Row> : ''
                                                    }
                                                </Col>

                                                <Col xl="4" className='d-xl-block d-none'>
                                                    <div className='dashboard_bg_lgren position-relative'>
                                                        <h5 className='fw-500 text_grey one_line pt-3'>Your Goal Is To Become A...</h5>
                                                        <p className='text-uppercase four_line'>{auth?.career_goal?.name ?? ''}</p>
                                                        <img src={`/assets/images/menteedashBoard/__your Goal bg icon.png`} alt="" className="position-absolute right-0 bottom-0 me-2 img_dashboard_content" />
                                                    </div>
                                                </Col>
                                            </Row>
                                      </div>
                                  ) : currentUser === 'mentor' ? (
                                      <div>
                                            <Row>
                                                <Col xxl="8" >
                                                    <h2> Welcome to your Dashboard, {auth?.first_name ?? ''}!</h2>
                                                    <p>Complete your profile to get full access to Mentaroo features.</p>
                                                    {
                                                        Mentors?.up_coming_sessions?.length > 0 ?
                                                            <div>
                                                                <h3 className='mb-3 mt-4'>Upcoming Sessions</h3>
                                                                <Row className='mb-4'>
                                                                    {
                                                                        Mentors?.up_coming_sessions?.map((data, index) => (
                                                                            <Col xxl="6" lg="12" md="6" className='mb-3' key={index}>
                                                                                <div className='box_empty'>
                                                                                    <div className='d-flex align-items-center mb-3'>
                                                                                        <img src={data?.image ?? ''} onError={(e) => e.currentTarget.src = '/assets/images/UserProfile.png'} alt="" className="list_img_gd_11 me-2" />
                                                                                        <p className='mb-0'>{data?.userName?.first_name ?? ""}</p>
                                                                                    </div>
                                                                                    <h5 className='text-dark fw-bold'>Session {index + 1}</h5>
                                                                                    <div className='d-flex align-items-center mb-3'>
                                                                                        <img src="/assets/images/__time.png" alt="" className="time-img me-1" />
                                                                                        <p className='mb-0'>{data?.date ?? ''} {data?.start_time ?? '00:00'} to {data?.end_time ?? "00:00"}</p>
                                                                                    </div>
                                                                                    <div className='d-flex justify-content-end'> <button className='btn_theme px-5 py-2'>Join</button></div>
                                                                                </div>
                                                                            </Col>
                                                                        ))
                                                                    }

                                                                    {/* <Col xxl="6" lg="12" md="6" className='mb-3'>
                                                                            <div className='box_empty'>
                                                                                <div className='d-flex align-items-center mb-3'>
                                                                                    <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2"/>
                                                                                    <p className='mb-0'>Kane Abel</p>
                                                                                </div>
                                                                                <h5 className='text-dark fw-bold'>Admission Strategy: Session 2</h5>
                                                                                <div className='d-flex align-items-center mb-3'>
                                                                                <img src="/assets/images/__time.png" alt="" className="time-img me-1"/>
                                                                                    <p className='mb-0'>18 November 2023 03:00 PM to 04:00 PM</p>
                                                                                </div>
                                                                                <div className='d-flex justify-content-end'> <button className='btn_theme px-5 py-2'>Join</button></div>
                                                                            
                                                                            </div>
                                                                        </Col> */}
                                                                </Row>
                                                            </div> : ''
                                                    }

                                                    {
                                                        Mentors?.wall_of_gratitude?.length > 0 ?
                                                            <div>
                                                                <h3 className='mb-3'>Wall Of Gratitude</h3>
                                                                <Row>
                                                                    {
                                                                        Mentors?.wall_of_gratitude?.map((data, index) => (
                                                                            <Col xxl="6" lg="12" className="mb-3" key={index}>
                                                                                <div className="listing-card_dashbord dashboard_shadow_mentor h-100">
                                                                                    <div className="d-flex mb-3">
                                                                                        <div className=" me-3">
                                                                                            <img src={data?.user_image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd_1" />
                                                                                        </div>
                                                                                        <div className="edsf">
                                                                                            <p className="one_line mb-1 text-dark fw-bold">{data?.user_name}</p>
                                                                                            <p className="one_line mb-0">{data?.current_situation ?? ''}</p>
                                                                                        </div>
                                                                                    </div>

                                                                                    <p className="three_line">{data?.review ?? ''}</p>
                                                                                    <div className='d-flex justify-content-between align-items-center'>
                                                                                        <div className='d-flex align-items-center'> <img src={`/assets/images/UserProfile.png`} alt="" className="list_img_gd_11 me-1" /><p className='mb-0'>{data?.tutor_name}</p></div>
                                                                                        <div className='d-flex align-items-center'>
                                                                                            <Rating name="read-only" value={parseInt(data?.rating ?? '')} readOnly />
                                                                                            {/* <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" /> */}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        ))
                                                                    }
                                                                    {/* <Col xxl="6" lg="12" className="mb-3">
                                                                            <div className="listing-card_dashbord dashboard_shadow_mentor h-100">
                                                                                <div className="d-flex mb-3">
                                                                                    <div className=" me-3">
                                                                                        <img src={`/assets/images/mentor1.png`} alt="" className="list_img_gd_1" />
                                                                                    </div>
                                                                                    <div className="edsf">
                                                                                        <p className="one_line mb-1 text-dark fw-bold">Raghu Datta</p>
                                                                                        <p className="one_line mb-0">Engineering Manager, Japanese Organisation</p>
                                                                                    </div>
                                                                                </div>
                                                                                <p className="three_line">It was nice session. Gives me road map to full stack development for the interviews.</p>
                                                                                <div className='d-flex justify-content-between align-items-center'>
                                                                                    <div className='d-flex align-items-center'> <img src={`/assets/images/UserProfile.png`} alt="" className="list_img_gd_11 me-1" /><p className='mb-0'>RS Ratnadipa Shingare</p></div>
                                                                                    <div className='d-flex align-items-center'>
                                                                                        <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                        <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </Col> */}
                                                                </Row>
                                                            </div>
                                                            : ''
                                                    }

                                                    {
                                                        Mentors?.up_coming_sessions?.length == 0 && Mentors?.wall_of_gratitude?.length == 0 ?
                                                            <div className="text-center d-flex  justify-content-center  ">
                                                                <img src='/assets/nodata.png' className='w-50' />
                                                            </div> : ''
                                                    }
                                                </Col>

                                                <Col xxl="4">
                                                    <div className='features_dashbord mb-3'>
                                                        <h2>{Mentors?.overall_percentage ?? '0'}%</h2>
                                                        <p>Complete your profile to get full access to Mentaroo features.</p>
                                                        <hr></hr>
                                                        <div className=''>
                                                            <Link to={''} >
                                                                <div className='d-flex gap-2 align-items-center justify-content-start  mb-3'>
                                                                    {/* <h5 className='mb-0 text-dark'>Email Verified</h5> {Mentors?.email_verified == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />} */}
                                                                    <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" /> <h5 className='mb-0 text-Dash'>Email Verified</h5>  
                                                                </div>
                                                            </Link> 
                                                            <Link to={''} onClick={() => Mentors?.phone_verified == 0 ? handleGenerateOtp() : {}}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                 <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                   {Mentors?.phone_verified == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                   <h5 className={`mb-0 text-Dash`}>Phone Number Verified</h5>
                                                                 </div> 
                                                                 <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                            <Link to={Mentors?.mentor_profile_verified == 0 ? '/profile' : ''}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                  {Mentors?.mentor_profile_verified == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                  <h5 className='mb-0 text-Dash'>Mentor Profile Verified</h5> 
                                                                </div>
                                                                 <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                            <Link to={Mentors?.update_public_profile == 0 ? '/profile' : ''}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                   {Mentors?.update_public_profile == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                  <h5 className='mb-0 text-Dash'>Update Public Profile</h5> 
                                                                </div>
                                                                <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                            <Link to={''}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                    {Mentors?.onboard_kit == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                    <h5 className='mb-0 text-Dash'>Mentor Onboarding Kit</h5> 
                                                                    </div> 
                                                                <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                            <Link to={Mentors?.setup_time_slot == 0 ? '/calender-page' : ''}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                 <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                     {Mentors?.setup_time_slot == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                     <h5 className='mb-0 text-Dash'>Setup Your Timeslot</h5>
                                                                 </div>
                                                                 <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                            <Link to={Mentors?.document_verification == 0 ? '/account-settings' : ''}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                    {Mentors?.document_verification == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                    <h5 className='mb-0 text-Dash'>Document Verification</h5> 
                                                                </div>
                                                                <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                            <Link to={Mentors?.payout == 0 ? '/payout' : ''}>
                                                                <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                 <div className='d-flex align-items-center justify-content-start gap-2'>
                                                                    {Mentors?.payout == 0 ? <img src={`/assets/images/Icons/8.png`} alt="" className="img-rd" /> : <img src={`/assets/images/Icons/__tick.png`} alt="" className="img-rd" />}
                                                                    <h5 className='mb-0 text-Dash'>Payout Settings</h5> 
                                                                 </div>
                                                                <img src={`/assets/images/Mentee flow assets/Become a Mentor/Testimonial/__long right arrow.png`} alt="" className="img-rd" />
                                                                </div>
                                                            </Link> 
                                                        </div>
                                                    </div>

                                                    <Modal className='cutome_popup' isOpen={modal} toggle={toggle} centered={true}  {...args}>
                                                        <ModalBody className='p-4'>
                                                            <div className='px-4 position-relative'>
                                                                <h4 className='text-center mt-3 fw-bold'>Verify Mobile Number <br></br></h4>
                                                                <div className='d-flex gap-2 align-items-center justify-content-center mb-3'>
                                                                    <h5 className='mb-0 text-dark'>{'+'}{auth?.phone ?? ''}</h5>
                                                                    <Link to={'/profile'}>
                                                                        <img src={`/assets/images/__Subject.png`} alt="" className="img-rd" />
                                                                    </Link>
                                                                </div>
                                                                <div className='d-flex justify-content-center align-items-center mt-4'>
                                                                    <div>
                                                                        <div className="d-flex align-items-center justify-content-between mt-3">
                                                                           <Label className="theme_color mb-2" for="otps">
                                                                             Enter OTP
                                                                           </Label>
                                                                        </div>

                                                                        <div className="otp-container mb-1">
                                                                            {inputRefs.map((inputRef, index) => (
                                                                                <input
                                                                                    key={index}
                                                                                    ref={inputRef}
                                                                                    type="text"
                                                                                    id={`otps${index}`}
                                                                                    maxLength="1"
                                                                                    className={`otp-input ${activeIndex === index || otpValues[index] !== ""
                                                                                        ? "active"
                                                                                        : ""
                                                                                        }`}
                                                                                    value={otpValues[index]}
                                                                                    onFocus={() => handleFocus(index)}
                                                                                    onChange={(e) => handleChange(index, e)}
                                                                                    onKeyDown={(e) => handleBackspace(index, e)}
                                                                                />
                                                                            ))}
                                                                        </div> 

                                                                        <div className="d-flex align-items-center justify-content-end mb-3">
                                                                           <Link href="#" className="theme_color fw-bold" onClick={() => ReSendeOtp()}>
                                                                                {" "}
                                                                                {
                                                                                 "Resend OTP"
                                                                                }
                                                                           </Link>
                                                                        </div> 
                                                                    </div>
                                                                </div>
                                                                <div className='d-flex justify-content-center'><button onClick={() => handleVerifyCation()} type="button" className='btn_theme py-3 px-5 mb-lg-4 mb-3 mt-3'>Submit</button></div>
                                                                <div className="model_close_icon" onClick={toggle}> <img src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /> </div>
                                                            </div>
                                                        </ModalBody>
                                                    </Modal>

                                                    <div className='share_yor_experience mb-3'>
                                                        <h5 className='fw-600'>Share Your Experience</h5>
                                                        <p className='text-dark'>We'd love to hear about your experience mentoring on our platform. Your feedback can help us improve and inspire others to join our community.</p>
                                                        <form onSubmit={handlePostreview}>
                                                            <div className='star_select mb-3'>
                                                                <h5 className='fw-600'>Select the star rating</h5>
                                                                <div className='d-flex align-items-center mb-3'>
                                                                    <img src={`${rating >= 1 ? '/assets/images/homepg/icons/__star.png' : '/assets/images/homepg/icons/graystar.png'}`} onClick={() => setRating(1)} alt="" className="me-2 start-icon_rating" />
                                                                    <img src={`${rating >= 2 ? '/assets/images/homepg/icons/__star.png' : '/assets/images/homepg/icons/graystar.png'}`} onClick={() => setRating(2)} alt="" className="me-2 start-icon_rating" />
                                                                    <img src={`${rating >= 3 ? '/assets/images/homepg/icons/__star.png' : '/assets/images/homepg/icons/graystar.png'}`} onClick={() => setRating(3)} alt="" className="me-2 start-icon_rating" />
                                                                    <img src={`${rating >= 4 ? '/assets/images/homepg/icons/__star.png' : '/assets/images/homepg/icons/graystar.png'}`} onClick={() => setRating(4)} alt="" className="me-2 start-icon_rating" />
                                                                    <img src={`${rating >= 5 ? '/assets/images/homepg/icons/__star.png' : '/assets/images/homepg/icons/graystar.png'}`} onClick={() => setRating(5)} alt="" className="me-2 start-icon_rating" />
                                                                </div>
                                                                <label htmlFor='msgRatting'><h5 className='fw-600'>Message</h5></label>
                                                                {/* <div className='star_select_border mb-3 d-none'>
                                                                        <div className='custome_message'>Your favorite mentoring moments.</div>
                                                                        <div className='custome_message'>Any challenges you overcame.</div>
                                                                        <div className='custome_message'>How mentoring has enriched your skills.</div>
                                                                        <div className='custome_message'>Suggestions for improvement.</div>
                                                                    </div> */}
                                                                <div className='position-relative h-100 w-100'>
                                                                    <textarea readOnly={true} className='form-control mb-3 ' value={reviewValue?.name ?? ''} onChange={(e) => setReviewValue((p) => ({ ...p, name: e.target.value }))} id='msgRatting' rows={11} cols="33">
                                                                    </textarea>
                                                                    {
                                                                        !reviewValue &&
                                                                        <div className='position-absolute bottom-0 px-3 text-xl-start text-center  w-100'>
                                                                            {
                                                                                suggesion?.slice(0, 5)?.map((data, index) => (
                                                                                    <div role='button' key={index} onClick={() => setReviewValue(data)} className='custome_message text_hover text-truncate'>{data?.name}</div>
                                                                                ))
                                                                            }
                                                                            {/* <div role='button' onClick={() => setReviewValue('Any challenges you overcame.')} className='custome_message text_hover text-truncate'>Any challenges you overcame.</div>
                                                                                <div role='button' onClick={() => setReviewValue('How mentoring has enriched your skills.')} className='custome_message text_hover text-truncate'>How mentoring has enriched your skills.</div>
                                                                                <div role='button' onClick={() => setReviewValue('Suggestions for improvement.')} className='custome_message text_hover text-truncate'>Suggestions for improvement.</div> */}
                                                                        </div>
                                                                    }
                                                                </div>
                                                                <button type='submit' className='btn_theme px-4 py-2'>Submit</button>
                                                            </div>
                                                        </form>
                                                    </div>

                                                    <div className='share_yor_experience'>
                                                        <h5 className='fw-600'>Complete Mentor Onboarding Kit.</h5>
                                                        <p className='text-dark'>Our mentor onboarding kit can be a great resource for your to kick start your journey with Mentaroo. Feel free to explore the content listed below,</p>
                                                        {/* <a href={pdf} target='_blank' download> */}
                                                        <button type='button' onClick={() => handleDownloadPdf()} className='border-0 text-light btn_pdf'> <img src={`/assets/images/Icons/__Pdf.png`} alt="" className="img-rd me-2" />Download PDF</button>
                                                        {/* </a> */}
                                                    </div>
                                                </Col>
                                            </Row>
                                      </div>
                                  ) :
                                     <div className="text-center d-flex align-items-center justify-content-center h-100 ">
                                            <img src='/assets/nodata.png' className='w-50' />
                                     </div>
                        }
                    </Col>
                </Col>
            </Row>
        </section>
    </>

    )
}

export default Dashboard