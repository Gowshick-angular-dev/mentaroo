import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Container, Media, Collapse } from "reactstrap";
import { Slider23 } from "../../../services/script";
import { Slider14 } from "../../../services/script";
import Slider from "react-slick";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import cn from 'classnames';
import { getMentorDetails, getMentorPac, getMentorPacDetails } from "../core/_request";
import moment from "moment";
import Rating from '@mui/material/Rating';
import { useAuth } from "../../Auth/core/Auth";
import Select from 'react-select';
import { Image } from 'primereact/image';
import Meta from "../../../services/Meta";




const MentorDetails = () => {
    // const [state, setState] = useState({ nav1: null, nav2: null });
    const slider1 = useRef();
    const slider2 = useRef();

    const { auth, currentUser } = useAuth();

    const shareRef = useRef(null);

    const handleClickOut = (event) => {
        if (shareRef.current && !shareRef.current.contains(event.target)) {
            setShowPopup(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOut)
        return () => {
            document.removeEventListener('mousedown', handleClickOut)
        }
    }, [])

    const { state } = useLocation();

    const { slug } = useParams();

    const router = useNavigate();

    const backClick = () => {
        document.getElementById("filter").style.left = "-365px";
    }

    const handleCopyClipBoard = (value) => {
        navigator.clipboard.writeText(`${value}`).then(() => {
            document.getElementById('copyClipboard')?.classList.remove('d-none')
            document.getElementById('copyClipboard')?.classList.add('d-block')

            setTimeout(() => {
                document.getElementById('copyClipboard')?.classList.remove('d-block')
                document.getElementById('copyClipboard')?.classList.add('d-none')
            }, 1500)
        }).catch(err => console.log("err", err.message))
    }

    const [isBrandOpen, setIsBrandOpen] = useState(true);
    const toggleBrand = () => setIsBrandOpen(!isBrandOpen);


    const [showPopup, setShowPopup] = useState(false);

    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    const [plansTab, setPlansTab] = useState(1)
    const [plansInfo, setPlansInfo] = useState({})
    const [isloading, setloading] = useState(true)
    const [mentors, setmentors] = useState({})
    const [details, setdetails] = useState({})
    const [experience, setExperience] = useState([])
    const [education, setEducation] = useState([])
    const [packages, setPackage] = useState([])
    const [packageDetail, setPackageDetail] = useState()
    const [related, setRelated] = useState([])
    const [features, setFeature] = useState([])
    const [review, setReview] = useState([])
    const [social, setSocial] = useState('')
    const [sortR, setsortR] = useState(3);
    const [Data, setData] = useState({})
    const [mentorPlans, setMentorPlans] = useState([]);
    const [SelectedProID, setSelectedProID] = useState();
    const [mentorId, setMentorId] = useState(state?.id ?? slug)

    // console.log('packagespackages', packages)


    const fetchmentorDetails = (id) => {
        setloading(true)
        getMentorDetails(id).then(res => {
            setData(res?.data)
            setmentors(res?.data?.users ?? {});
            res?.data?.experience && setExperience(res?.data?.experience)
            res?.data?.education && setEducation(res?.data?.education)
            res?.data?.related_mentors && setRelated(res?.data?.related_mentors)
            res?.data?.detail && setdetails(res?.data?.detail[0])
            // res?.data?.packages && setPackage(res?.data?.packages)
            // res?.data?.packages && fetchPaclageList(res?.data?.packages[0]?.program_id);
            // res?.data?.packages && setSelectedProID(res?.data?.packages[0]?.program_id)
            res?.data?.featured_stories && setFeature(res?.data?.featured_stories)
            res?.data?.reviews && setReview(res?.data?.reviews)
            // console.log('skdjhdsd',JSON.parse(res?.data?.users?.social_links ??  "")?.facebook)
            state?.id ? setSocial(window.location.href + '/' + mentorId) : setSocial(window.location.href);
            // setPlansInfo(res?.data?.packages[0]);
            setloading(false)
        }).catch(err => setloading(false))
    }

    const fetchmentorAginstPac = (id) => {
        getMentorPac(id).then(res => {
            setMentorPlans(res?.data);
            if (res?.data.length > 0) {
                fetchPaclageList(res?.data[0]?.program_id);
                setSelectedProID(res?.data[0]?.program_id)
            }
        }).catch(err => {

        })
    }


    function reviewUntillValue(unixTimestamp) {
        // Convert the Unix timestamp to milliseconds by multiplying by 1000
        const milliseconds = unixTimestamp * 1000;
        // Create a new Date object using the milliseconds
        const date = new Date(milliseconds);

        // Get the day, month, and year components from the date object
        // Concatenate the components to form the desired format
        const formattedDate = moment.utc(date).local().startOf('seconds').fromNow()
        return formattedDate;
    }




    const fetchPaclageList = (id) => {
        getMentorPacDetails(id, mentorId).then(res => {
            const data = res?.data?.packages ?? []
            // console.log("kkkk", res?.data)
            setPackage(data)
            setPlansInfo(data[0]);
            setPackageDetail(res?.data)
            setPlansTab(1)
        }).catch(err => {

        })
    }


    useEffect(() => {
        var id = mentorId;
        if (id) {
            fetchmentorDetails(id);
            fetchmentorAginstPac(id);
        } else {
            router('/mentor');
        }
    }, [mentorId])



    function formatUnixTimestamp(unixTimestamp) {
        // Convert the Unix timestamp to milliseconds by multiplying by 1000
        const milliseconds = unixTimestamp * 1000;
        // Create a new Date object using the milliseconds
        const date = new Date(milliseconds);
        // Get the day, month, and year components from the date object
        const day = date.getDate();
        // JavaScript months are zero-based, so we need to add 1
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        // Concatenate the components to form the desired format
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate;
    }



    return (<> 

         <Meta title={mentors?.first_name ?? "Mentor"}  />
        {
            isloading ?
                <div className='pageLoading'>
                    <span
                        className={cn(
                            'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                        )}
                    >
                        <span className={"loading"} />
                    </span>
                </div> : Object.keys(mentors).length > 0 ?
                    <section className="bg_detail text-start">
                        <div className="collection-wrapper">
                            <div className="breadgrams d-lg-block d-none ">
                                <Container className="d-flex align-items-center">
                                    <h5 className="cursor_pointer" onClick={() => router('/')}>Home </h5><i className="fa fa-angle-right " aria-hidden="true"></i>
                                    <h5 className="cursor_pointer" onClick={() => router('/mentor')}>Find Mentor </h5><i className="fa fa-angle-right" aria-hidden="true"></i>
                                    <h5 className="text-white">{mentors?.first_name ?? ''}</h5>
                                </Container>
                            </div>

                            <Container className="py-4">
                                <Row className="justify-content-center">
                                    <Col lg="8" sm="12" xs="12" className="animate fadeInLeft three">

                                        <div className="">
                                            <div className="d-flex justify-content-between detail_poject position-relative">
                                                <div className="">
                                                    <div className="d-flex mb-3  ">
                                                        <div className="position-relative me-3 h-125">
                                                            <img src={mentors?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd" />
                                                            {/* <Image preview src={mentors?.image ?? '/assets/images/homepg/noImg.jpg'}  alt="" width="135" height="135"  imageClassName="list_img_gd"  className="list_img_gd rounded " /> */}
                                                            {/* <img src={`/assets/images/__Badge.png`} alt="" className="list_img_gd_pos" /> */}
                                                        </div>

                                                        <div className="edsf">
                                                            <h3 className="one_line mb-2">{mentors?.first_name ?? ''}</h3>
                                                            <h6 className="mb-2 theme_color one_line">{details?.jobTitle?.name}</h6>
                                                            {
                                                                details?.state_name || details?.country_name || details?.time_zone ?
                                                                    <div className="d-flex align-items-center mb-2">
                                                                        <img src={`/assets/images/Icons/__location gray.png`} alt="" className="img-satrt_detaillzud me-2" />
                                                                        <p className="one_line mb-0">{details?.state_name}  {details?.country_name} {details?.time_zone ?? ` (${details?.time_zone})`}</p>
                                                                    </div> : ""
                                                            }
                                                            <div className=" d-md-flex d-none align-items-center  me-3">
                                                                <div className=" d-flex align-items-center me-3">
                                                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="img-congf me-2" />
                                                                    <p className="mb-0">{Data?.overallRating} ({review?.length ?? 0} reviews)</p>
                                                                </div>
                                                                <div className=" d-flex align-items-center me-3">
                                                                    <img src={`/assets/images/__mentees.png`} alt="" className="img-congf me-2" />
                                                                    <p className="mb-0">{Data?.total_mentees ?? ''} mentees</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className=" d-flex d-md-none justify-content-md-start justify-content-between align-items-center  mb-2">
                                                        <div className=" d-flex align-items-center me-3">
                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="img-congf me-2" />
                                                            <p className="mb-0">{Data?.overallRating} ({review?.length ?? 0} reviews)</p>
                                                        </div>
                                                        <div className=" d-flex align-items-center me-3">
                                                            <img src={`/assets/images/__mentees.png`} alt="" className="img-congf me-2" />
                                                            <p className="mb-0">{Data?.total_mentees ?? ''} mentees</p>
                                                        </div>
                                                    </div>

                                                    <div className="footer-social-detail d-md-none d-block">
                                                        <ul>
                                                            <li><a href={JSON.parse(mentors?.social_links ?? "")?.twitter ?? ''} target="_blank"><i className="fa fa-instagram" aria-hidden="true"></i></a></li>
                                                            <li><a href={JSON.parse(mentors?.social_links ?? "")?.linkedin ?? ''} target="_blank"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li>
                                                            <li><a href="#" target="_blank"><i className="fa fa-globe" aria-hidden="true"></i></a></li>
                                                        </ul>
                                                    </div>
                                                </div>

                                                <div className="d-flex flex-column justify-content-between mb-3">
                                                    <div>

                                                        <div onClick={togglePopup} className=" d-flex align-items-center design-share me-md-3">
                                                            <img src={`/assets/images/__Share.png`} alt="" className=" me-2" />
                                                            <h5 className="d-none d-md-flex">Share</h5>
                                                        </div>
                                                        {showPopup && (
                                                            <div className="popup" ref={shareRef} style={{ position: 'absolute', }}>
                                                                <div className="bg-contrent mb-3">
                                                                    <div className="d-flex align-items-center ps-2">
                                                                        <img src={`/assets/images/homepg/__link.png`} alt="" className="img-bhjd me-2" />
                                                                        <p className="mb-0">{social}.</p>
                                                                    </div>

                                                                    <div role="button" className="d-flex align-items-center bg-cp" onClick={() => {
                                                                        //   navigator.clipboard.writeText(social)
                                                                        handleCopyClipBoard(social)
                                                                    }}>
                                                                        <p className="mb-0 text-dark">Copy</p>
                                                                        <img src={`/assets/images/homepg/__Copy.png`} alt="" className="start me-1" />
                                                                    </div>
                                                                    <div id="copyClipboard" className="d-none bg-secondary user-select-none text-light px-3 py-1 rounded-3 position-absolute top-50 end-0">copied!</div>
                                                                </div>

                                                                <div className="row px-2" >
                                                                    <div className="col-4 px-1" role="button" onClick={() => {
                                                                        // setSocial(JSON.parse(mentors?.social_links ??  "")?.facebook)
                                                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')
                                                                    }} >
                                                                        <div className="btn_sgate face_book pe-none">
                                                                            <img src={`/assets/images/homepg/__Facebook-74.png`} alt="" className="img-bhjd me-1" />
                                                                            <p>Facebook</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-4 px-1" role="button" onClick={() => {
                                                                        // setSocial(JSON.parse(mentors?.social_links ??  "")?.twitter)
                                                                        window.open(`https://www.instagram.com/?url=${window.location.href}`, '_blank')
                                                                    }}>
                                                                        <div className="btn_sgate insta_gram pe-none">
                                                                            <img src={`/assets/images/homepg/__insta.png`} alt="" className="img-bhjd me-1" />
                                                                            <p>Instagram</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-4 px-1" role="button" onClick={() => {
                                                                        // setSocial(JSON.parse(mentors?.social_links ??  "")?.linkedin)
                                                                        window.open(`https://api.whatsapp.com/send?phone=&text=${window.location.href}`, '_blank')
                                                                    }}>
                                                                        <div className="btn_sgate whats_app pe-none">
                                                                            <img src={`/assets/images/homepg/__whatsapp.png`} alt="" className="img-bhjd me-1" />
                                                                            <p>Whatsapp</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="footer-social-detail d-md-flex d-none">
                                                        <ul>
                                                            {JSON.parse(mentors?.social_links ?? "")?.twitter ? <li><a href={JSON.parse(mentors?.social_links ?? "")?.twitter.startsWith('https') ? JSON.parse(mentors?.social_links ?? "")?.twitter : `https://${JSON.parse(mentors?.social_links ?? "")?.twitter}`} target="_blank"><i className="fa fa-instagram" aria-hidden="true"></i></a></li> : ''}
                                                            {JSON.parse(mentors?.social_links ?? "")?.linkedin ? <li><a href={JSON.parse(mentors?.social_links ?? "")?.linkedin.startsWith('https') ? JSON.parse(mentors?.social_links ?? "")?.linkedin : `https://${JSON.parse(mentors?.social_links ?? "")?.linkedin}`} target="_blank"><i className="fa fa-linkedin" aria-hidden="true"></i></a></li> : ''}
                                                            {
                                                                details?.personal_website ?
                                                                    <li><a href={details?.personal_website?.startsWith('https') ? details?.personal_website : "https://" + details?.personal_website} target="_blank"><i className="fa fa-globe" aria-hidden="true"></i></a></li> : ''
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {
                                              Data?.webinar ? 
                                                <div className="d-md-flex align-items-center justify-content-between jond_section mt-xl-4 mt-3">
                                                    <h5 className="">{Data?.webinar?.text} <span className="text-yellow">{moment(Data?.webinar?.date).format('MMM DD YYYY')}</span> <br></br>{Data?.webinar?.time}</h5>
                                                    <button type="button" onClick={()=> window.open(Data?.webinar?.url?.includes('https://') ? Data?.webinar?.url : `https://${Data?.webinar?.url}` , '_blank')} className="">Join Now</button>
                                                </div> : ''
                                            }

                                            {
                                                mentors?.biography &&
                                                <div className="detail_poject mt-3 mt-xl-4">
                                                    <h3 className="my-3">About</h3>
                                                    <p>{mentors?.biography}.</p>
                                                    {/* <p>I landed my machine learning job in 4 months without a degree or experience. I've helped 60+ career changers in landing their dream jobs with a lifestyle that seemed impossible in the beginning.</p> */}

                                                    {/* <a href="" className="theme_color fw-bold">Read More</a> */}
                                                </div>
                                            }

                                            <div className="detail_poject mt-3 mt-xl-4 d-md-flex justify-content-between align-items-center">
                                                <div className="d-md-flex align-items-center mb-md-0 mb-3">
                                                    <img src={`/assets/images/_-70.png`} alt="" className="trial-img mb-md-0 mb-3" />
                                                    <div className="mb-md-0 mb-3">
                                                        <h6 className="fw-bold text-dark">Introductory Call</h6>
                                                        <p>Mentorship requires significant investment from both parties, a quick 15-min chat will ensure compatibility between you and your mentor before taking a decision</p>
                                                    </div>
                                                </div>
                                                {
                                                    auth ?
                                                        <Link to={`/bookingConfirm`} state={{ id: mentorId, proId: SelectedProID }}>  <button className="btn_schedule ml-md-3 ">Schedule a Trial Session</button></Link> :
                                                        <Link to={`/login`}>  <button className="btn_schedule ml-md-3 ">Schedule a Trial Session</button></Link>
                                                }

                                            </div>

                                            {
                                                details?.skills_details?.length > 0 ?
                                                    <div className="detail_poject mt-3 mt-xl-4 ">
                                                        <h3 className="my-3">Skills</h3>
                                                        <div className="d-flex align-items-center flex-wrap">
                                                            {
                                                                details?.skills_details?.map((data, i) => (
                                                                    <div className="skil_bg" key={i}>{data?.name}</div>
                                                                ))
                                                            }
                                                        </div>
                                                    </div>
                                                    : ""
                                            }

                                            {
                                                experience?.length > 0 ?
                                                    <div className="detail_poject mt-3 mt-xl-4 ">
                                                        <h3 className="my-3">Experience</h3>
                                                        <div className="d-xxl-flex w-100">
                                                            <div className="border_right ms-4"></div>
                                                            <div className="height-95">
                                                                {
                                                                    experience.map((data, i) => (
                                                                        <div className="d-flex justify-content-between w-100 custome_botrder ms-xxl-5 position-relative mb-3" key={i}>
                                                                            <div className="custome_select">
                                                                                <div className="one">
                                                                                    <div className="two"></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="">
                                                                                <h3 >{data?.company_name}</h3>
                                                                                <h5>{data?.title}</h5>
                                                                                <div className="d-flex align-items-center">
                                                                                    <p className="mb-0">{data?.start_date} - {data?.end_date}</p>
                                                                                    {/* <span className="divider_hj mx-3"></span>
                                                                                    <a className="theme_color fw-bold">Meesho.com</a> */}
                                                                                </div>
                                                                                <p className="two_line">{data?.description}.</p>
                                                                            </div>
                                                                            <img src={``} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="brand_img_detail" />
                                                                        </div>
                                                                    ))
                                                                }

                                                            </div>
                                                        </div>
                                                    </div> : ""
                                            }

                                            {
                                                education?.length > 0 ?
                                                    <div className="detail_poject mt-3 mt-xl-4 ">
                                                        <h3 className="my-3">Education</h3>
                                                        <div className="d-flex w-100">
                                                            <div className="border_right ms-4"></div>
                                                            <div className="height-95">
                                                                {
                                                                    education?.map((v, i) => (
                                                                        <div key={i} className="d-flex justify-content-between w-100 custome_botrder ms-xxl-5 position-relative mb-3">
                                                                            <div className="custome_select">
                                                                                <div className="one">
                                                                                    <div className="two"></div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="">
                                                                                <h3>{v?.university ?? ''}</h3>
                                                                                <h5 className="two_line">{v?.education_description ?? ''}</h5>
                                                                                <p>{v?.start_year}-{v?.end_year}</p>
                                                                            </div>
                                                                            <img src={``} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="brand_img_detail" />
                                                                        </div>
                                                                    ))
                                                                }
                                                                {/* <div className="d-flex justify-content-between w-100 custome_botrder ms-xxl-5 position-relative mb-3">
                                                                    <div className="custome_select">
                                                                        <div className="one">
                                                                            <div className="two"></div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="">
                                                                        <h3 >Heriot-Watt University</h3>
                                                                        <h5>Master of Philosophy (MPhil), Computer ScienceMaster of Philosophy (MPhil), Computer Science</h5>
                                                                        <p>1998-2000</p>
                                                                    </div>
                                                                    <img src={`/assets/images/11.png`} alt="" className="brand_img_detail" />
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    </div> : ''
                                            }

                                            {
                                                review?.length > 0 ?
                                                    <div className="detail_poject mt-3 mt-xl-4 ">
                                                        <h3 className="my-3">Reviews & Testimonials</h3>
                                                        {
                                                            review?.slice(0, sortR).map((data, i) => (
                                                                <div className="" key={i}>
                                                                    <div className="d-flex align-items-start mt-4 mb-3">
                                                                        <img src={data?.user_image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="me-3 testimonial-user" />
                                                                        <div className="">
                                                                            <h5 className="fw-bold">{data?.user_name}</h5>
                                                                            <div className=" d-flex align-items-center me-3">
                                                                                {
                                                                                    data?.rating ?
                                                                                        <div className="d-flex align-items-center">
                                                                                            {/* <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="img-star me-1" />
                                                                            <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="img-star me-1" /> */}
                                                                                            <Rating name="read-only" value={parseInt(data?.rating ?? '')} readOnly />
                                                                                        </div> : ''
                                                                                }
                                                                                {
                                                                                    data?.date ?
                                                                                        <p className="ps-1 mb-0">{reviewUntillValue(data?.date)}</p>
                                                                                        : ''
                                                                                }
                                                                            </div>
                                                                            <p className="mb-0 d-md-block d-none">{data?.review}</p>
                                                                        </div>
                                                                    </div>

                                                                    <hr></hr>
                                                                </div>
                                                            ))
                                                        }
                                                        {
                                                            review.length > 3 && review.length > sortR ?
                                                                <div className="d-flex justify-content-center mt-3"><button onClick={() => setsortR(sortR + 3)} type="button" className="but_load_more">Load More Reviews</button></div>
                                                                : ''}
                                                    </div> : ""
                                            }

                                            {
                                                features?.length > 0 ?
                                                    <div className="detail_poject mt-3 mt-xl-4" >
                                                        <h3 className="my-3">Featured Stories</h3>
                                                        <Slider {...Slider23} className="slide-2 testimonial-slider no-arrow">
                                                            {
                                                                features?.map((data, i) => (
                                                                    <div className="slider-item" key={i} onClick={() => router('/stories_detail', { state: { id: data?.blog_id } })}>
                                                                        <div className="inner_stories">
                                                                            <h3 className="mb-3 two_line">{data?.title}</h3>
                                                                            <div className="d-flex align-items-center mb-3">
                                                                                <img src={data?.userImage} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="image_auth me-2" />
                                                                                <div className="">
                                                                                    <h6 className="mb-0 one_line">{data?.userName}</h6>
                                                                                    <p className="mb-0 one_line">{data?.job_title}</p>
                                                                                </div>
                                                                            </div>
                                                                            <img src={data?.banner} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="image_stories mb-3" />
                                                                            <div className="d-flex align-items-center">
                                                                                <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                                                                <p className="mb-0">{formatUnixTimestamp(data?.added_date)}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                            }

                                                            {/* <div className="slider-item">
                                                                    <div className="inner_stories">
                                                                        <h3 className="mb-3">How to Prepare for Exams: A Step-by-Step Guide by EXPRTO Mentors</h3>
                                                                        <div className="d-flex align-items-center mb-3">
                                                                            <img src={`/assets/images/homepg/testimonial/5.jpg`} alt="" className="image_auth me-2" />
                                                                            <div className="">
                                                                                <h6 className="mb-0">Nate Matherson</h6>
                                                                                <p className="mb-0">Co-founder & CEO at ContainIQ </p>
                                                                            </div>
                                                                        </div>
                                                                        <img src={`/assets/images/homepg/stories/story1.jpg`} alt="" className="image_stories mb-3" />
                                                                        <div className="d-flex align-items-center">
                                                                            <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                                                            <p className="mb-0">08 Nov 2023</p>
                                                                        </div>
                                                                    </div>
                                                                </div> */}
                                                        </Slider>
                                                    </div> : ''
                                            }

                                            {
                                                related?.length > 0 ?
                                                    <div className="detail_poject mt-3 mt-xl-4 mb-xxl-5 mb-3  position-relative detailk_consudy">
                                                        <h3 className="my-3">Similar Mentors</h3>
                                                        <Slider {...Slider14} className="slide-4 slide_commitcareer" >
                                                            {
                                                                related?.map((data, i) => (
                                                                    <Link to={'/mentorDetails'} state={{ id: data?.id }} key={i} >
                                                                        <div className="slider-item h-100" role="button"  onClick={() => {
                                                                            setMentorId(data?.id);
                                                                            //  fetchmentorDetails(data?.id); 
                                                                            window.scrollTo(0, 0)
                                                                        }}>
                                                                            <div className="bg_careermentor_1 h-100 d-flex">
                                                                                <img src={data?.image ?? ''} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="user_detajk me-3" />
                                                                                <div className="">
                                                                                    <h3 className="one_line mb-lg-2 mb-2 text-dark">{data?.first_name}</h3>
                                                                                    <p className="two_line mb-lg-2 mb-2  ">{data?.job_name}</p>
                                                                                    <h4 className=" mb-lg-2 mb-2  ">{data?.total_mentees ?? 0} mentees</h4>
                                                                                    <div className="bg_coussag_1 "> <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="start me-1" /><span>{data?.mentor_rating}</span> </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Link>
                                                                ))
                                                            }
                                                        </Slider>
                                                    </div> : ""
                                            }
                                        </div>
                                    </Col>

                                    {/* filter */}
                                    {
                                        packages.length > 0 ?
                                            <Col lg="4" className=" animate fadeInRight four" id="filter">
                                                <div className="collection-filter-block creative-card creative-inner p-3 p-xl-4 border-radius-30 ms-xl-2 me-xl-3">
                                                    <h5 className=' mb-3'>Mentorship Plans</h5>
                                                    <div className=' custome_side-detail'>
                                                        <div className="mb-3">
                                                            <div className="card" >
                                                                <div className="card-header">
                                                                    Select Program
                                                                </div>
                                                                <ul className="list-group list-group-flush">
                                                                    {
                                                                        mentorPlans?.map((p, i) => (
                                                                            <li role="button" className={`list-group-item ${SelectedProID == p?.program_id ? "active" : ''} `} onClick={() => { fetchPaclageList(p?.program_id); setSelectedProID(p?.program_id) }} key={i}>{p?.program_name}</li>
                                                                        ))
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>

                                                        <div className='member-plan'>
                                                            <div className='row'>
                                                                {
                                                                    packages?.slice(0,3).map((val, i) => (
                                                                        <div className='col' key={i}><div role='button' onClick={() => { setPlansTab(i + 1); setPlansInfo(val) }} className={`member_content ${plansTab == i + 1 && 'bg-color_yellow'} `}>{val?.package_name}</div></div>
                                                                    ))
                                                                }
                                                                {/* <div className='col '><div role='button' onClick={() => setPlansTab(2)} className={`member_content ${plansTab == 2 && 'bg-color_yellow'} `}>Regular</div></div>
                                                            <div className='col'><div role='button' onClick={() => setPlansTab(3)} className={`member_content ${plansTab == 3 && 'bg-color_yellow'} `}>Pro</div></div> */}
                                                            </div>
                                                        </div>
                                                        
                                                        {/* <h3 className='theme_color mt-3 mb-1'>₹ 899 <del >₹ 1500</del></h3> */}
                                                        <h3 className='theme_color mt-3 mb-1'>₹ {plansInfo?.price ?? 0}</h3>
                                                        <p className='text-dark'>({plansInfo?.sessions ?? 0} Sessions)</p>

                                                        <p className='text-dark pb-3 mb-2 '>{plansInfo?.description}</p>

                                                        <div className='d-flex align-items-center mb-3 '>
                                                            <img src={`/assets/images/homepg/1.png`} alt="" className="img-satrt_detaillzud me-2" />
                                                            <p className='mb-0'>{plansInfo?.sessions ?? 0} Session
                                                                ({packageDetail?.class_time})
                                                            </p>
                                                        </div>
                                                        {/* <div className='d-flex align-items-center mb-3'>
                                                            <img src={`/assets/images/homepg/2.png`} alt="" className="img-satrt_detaillzud me-2" />
                                                            <p className='mb-0'>Unlimited Q&A</p>
                                                        </div> */}
                                                           {
                                                                Data?.nearest_available_slot ? 
                                                                <div className="d-flex mb-3 align-items-center ">
                                                                     <img src={`/assets/images/Icons/__time.png`} alt="" className="img-satrt_detaillzud me-2" />
                                                                    <p className='text-dark mb-0'>Upcoming Available Slot : {Data?.nearest_available_slot ?? ''}</p>
                                                                </div> : ''
                                                            }
                                                        <div className='d-flex align-items-center mb-3 '>
                                                            <img src={`/assets/images/homepg/3.png`} alt="" className="img-satrt_detaillzud me-2" />
                                                            <p className='mb-0'>{packageDetail?.level ?? "normal"} level and language {packageDetail?.language ?? "English"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="collection-mobile-back" onClick={backClick}>
                                                        <span className="filter-back">
                                                            <i className="fa fa-angle-left" aria-hidden="true"></i>
                                                            Filters
                                                        </span>
                                                    </div>

                                                    {
                                                        plansInfo?.tags ?
                                                            <div className="collection-collapse-block border-0 open mt-4">
                                                                <h3 className="collapse-block-title mb-0" onClick={toggleBrand}>Programs offered</h3>
                                                                <Collapse isOpen={isBrandOpen}>
                                                                    <div className="collection-collapse-block-content">
                                                                        <div className="collection-brand-filter-lisy">
                                                                            <ul className="category-list">
                                                                                {
                                                                                    plansInfo?.tags.split(',').map((t, i) => (
                                                                                        <li key={i}>
                                                                                            <img src={`/assets/images/homepg/__checkactive.png`} alt="" className="img-satrt_detaillzud me-2" /> <a href={null}>{t}</a>
                                                                                        </li>
                                                                                    ))
                                                                                }
                                                                                {/* <li><img src={`/assets/images/homepg/__checkactive.png`} alt="" className="img-satrt_detaillzud me-2" /> <a href={null}>bags</a></li>
                                                                              */}
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </Collapse>
                                                            </div> : ''
                                                    }

                                                    {
                                                        auth  ?
                                                            // <Link  to={`/booking`}  state={{ id: mentorId, proId: SelectedProID }} >
                                                            <button type="button" className='btn_book mt-3' style={auth?.is_instructor == 1 && currentUser === 'mentor' ? { pointerEvents: "none", opacity: "0.4" } : {}}  onClick={()=> router('/booking', {state : { id: mentorId, proId: SelectedProID }})} >
                                                                <i className="fa fa-calendar pe-2" aria-hidden="true"></i>  Book Now
                                                            </button>
                                                            //  </Link> 
                                                             :
                                                            <Link to={`/login`}><button className='btn_book mt-3' >
                                                                <i className="fa fa-calendar pe-2" aria-hidden="true"></i>  Book Now
                                                            </button></Link>
                                                    }
                                                </div>
                                            </Col>
                                            : ""
                                    }

                                </Row>
                            </Container>

                        </div>
                    </section> :
                    <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                        <img src='/assets/nodata.png' className='w-50' />
                    </div>
        }
    </>)
}

export default MentorDetails;