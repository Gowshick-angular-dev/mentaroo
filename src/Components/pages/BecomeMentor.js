import React, { useEffect, useRef, useState } from 'react';
import { Col, Row, Container, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionHeader, AccordionBody } from 'reactstrap';
import Slider from "react-slick";
import { Slider7 } from '../../services/script';
import { Slider2 } from '../../services/script';
import { Link } from 'react-router-dom';
import { getCompanies, getCounterUpList, getEmpowerlist, getFaq, getMakeDiff, getSkillList, getSupport, getTestimonials, getTitleHome, getTopBanner } from './core/_request';
import Rating from '@mui/material/Rating';
import cn from 'classnames';
import Meta from '../../services/Meta';


const BecomeMentor = () => {

    const [open, setOpen] = useState('');

    const toggle = (id) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };

    const [isloading, setloading] = useState(true)
    const [isloading2, setloading2] = useState(true)
    const [companies, setcompanies] = useState([])
    const [testimonial, setTestimonial] = useState([])

    const CustomSlider = useRef()

    const SlideNext = () => {
        CustomSlider.current.slickNext()
    }

    const SlidePrev = () => {
        CustomSlider.current.slickPrev()
    }

    const [faq, setFaq] = useState([])
    const [banner, setBanner] = useState([])
    const [skillList, setSkillList] = useState([])
    const [empower, setEmpower] = useState([])
    const [counterUp, setCounterUp] = useState([])
    const [SupportList, setSupportList] = useState([])
    const [diff, setDiff] = useState([])

    function htmlDecode(input) {
        if (input && input.includes('&lt;') && input.includes('&gt;')) {
            var e = document.createElement('div');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        } else {
            return input ?? ''
        }
    }

    const fetchFaq = async () => {
        setloading(true);
        getFaq(2).then(res => {
            setFaq(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchTopBanner = async () => {
        setloading(true);
        getTopBanner().then(res => {
            setBanner(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchSkillList = async () => {
        setloading(true);
        getSkillList().then(res => {
            setSkillList(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchEmpowerList = async () => {
        setloading(true);
        getEmpowerlist().then(res => {
            setEmpower(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchCounterList = async () => {
        setloading(true);
        getCounterUpList().then(res => {
            setCounterUp(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchSupportList = async () => {
        setloading(true);
        getSupport().then(res => {
            setSupportList(res.data);
            setloading(false);
        }).catch(e => {
            // setloading(false);
            console.log(e)
        })
    }

    const fetchMakeDiffList = async () => {
        setloading(true);
        getMakeDiff().then(res => {
            setDiff(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchCompanies = async () => {
        setloading(true);
        getCompanies().then(res => {
            setcompanies(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const [title, setTitle] = useState()

    const fetchTitleHome = async () => {
        setloading(true);
        getTitleHome().then(res => {
            setTitle(res?.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }



    const fetchTestimonials = async () => {
        setloading(true);
        getTestimonials(2).then(res => {
            setTestimonial(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchPromist = async () => {
        await Promise.all([
            fetchTestimonials(),
            fetchFaq(),
            fetchCompanies(),
            fetchTopBanner(),
            fetchSkillList(),
            fetchCounterList(),
            fetchSupportList(),
            fetchMakeDiffList(),
            fetchEmpowerList(),
            fetchTitleHome(),
        ])
    }

    useEffect(() => {
        fetchPromist();
    }, [])

    const [imgLoad, setImagLoad] = useState(false)


    return (<>
        <Meta
            title={"Become a Mentor"}
            pathName={'/becomeMentor'}
        />
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
                </div> :
                <div className='swift-up-text'>
                    {
                        <div className='bg_banner mb-xl-4 mb-3'>
                            <Container>
                                <Row className='align-items-center '>
                                    <Col md="6">
                                        {/* <img className='transis_img' onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg2.png"} style={imgLoad ? {opacity:1} : {}} onLoad={()=> setImagLoad(true) } src={banner?.background_image} alt="" /> */}
                                        <img className='' onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg2.png"} onLoad={() => setImagLoad(true)} src={banner?.background_image} alt="" />
                                    </Col>
                                    <Col md="6">
                                        <h2 className='mb-xl-4 mb-3 col-xl-10'>
                                            {banner?.title}
                                        </h2>
                                        <h5 className='mb-3 three_line' dangerouslySetInnerHTML={{ __html: htmlDecode(banner?.description) }} />
                                        <Link to={banner?.button_link ?? "/mentorApplyForm-1"} >
                                            <button type='button' className='btn btn_banner'>{banner?.button_text}</button>
                                        </Link>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                    }

                    {
                        skillList?.length > 0 ?
                            <div className='about-mentoring'>
                                <Container>
                                    {
                                        <div>
                                            <h2 className='text-center'>{banner?.mentor_title ?? ''}</h2>
                                            <p className='text-center '>{banner?.mentor_text ?? ''}</p>
                                        </div>
                                    }
                                    <div className='mt-4 mt-xl-5 '>
                                        <Row className='h-100'>
                                            <Col xl="8">
                                                <Row className='h-100'>
                                                    {
                                                        skillList?.slice(0, 5).map((data, i) => (
                                                            <Col sm="6" key={i} className='mb-3 d-flex align-items-center justify-content-center'>
                                                                <div className='bg_about_card text-center px-3'>
                                                                    <div className='d-flex justify-content-center mb-3'>
                                                                        <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='icon_auth_about ' src={data?.image} alt="" />
                                                                    </div>
                                                                    <h3>{data?.heading}</h3>
                                                                    <p className='px-xl-3 three_line' dangerouslySetInnerHTML={{ __html: htmlDecode(data?.description) }} />
                                                                </div>
                                                            </Col>
                                                        ))
                                                    }
                                                    {/* <Col sm="6" className='mb-3 d-flex align-items-center justify-content-center'>
                                                        <div className='bg_about_card text-center px-3'>
                                                            <div className='d-flex justify-content-center mb-3'>
                                                                <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='icon_auth_about ' src={`/assets/images/__Improve interpersonal skills.png`} alt="" />
                                                            </div>
                                                            <h3>Learn leadership skills</h3>
                                                            <p className='px-xl-3'>Leadership is more than just setting an example. it is about inspiring and encouraging people. Use our platform to practice and hone this skill.</p>
                                                        </div>
                                                    </Col> */}
                                                    <Col sm="6" className='mb-3 d-flex align-items-center justify-content-center'>
                                                        {

                                                            <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='img_xutjhfdgv' src={banner?.banner_image2} alt="" />
                                                            // <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='img_xutjhfdgv' src={''} alt="" />
                                                        }
                                                    </Col>
                                                </Row>
                                            </Col>
                                            <Col xl="4" className='mb-4'>
                                                {
                                                    <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='image_auth_about d-xl-block d-none h-100' src={banner?.banner_image1} alt="" />
                                                    // <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='image_auth_about d-xl-block d-none h-100' src={``} alt="" />
                                                }
                                            </Col>
                                        </Row>
                                    </div>
                                </Container>
                            </div> : ''
                    }


                    {
                        companies?.length > 0 ?
                            <section className="py-lg-5 py-3 custome_zbdvy">
                                <div className="d-flex justify-content-center">
                                    <h2 className="text-center col-xl-5 col-lg-7 col-md-9 col-sm-10">Become part of a driven community of educators and leaders</h2>
                                </div>
                                <Slider {...Slider7} autoplay={true} autoplaySpeed={2000} className="slide-7 slide_brand py-xl-5 py-lg-4 py-3 no-arrow">
                                    {
                                        companies?.map((data, index) => (
                                            <div className="slider-item" key={index}>
                                                <img src={data?.banner} alt={data?.name} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="start me-1 w-100" />
                                            </div>
                                        ))
                                    }
                                </Slider>
                                {/* <Slider {...Slider7} className="slide-7 slide_brand py-xl-5 py-lg-4 py-3 no-arrow">
                                    <div className="slider-item">
                                        <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} src={`/assets/images/homepg/companies/11.png`} alt="" className="start me-1" />
                                    </div>
                                </Slider> */}
                            </section>
                            : ''
                    }

                    {
                        empower?.length > 0 ?
                            <div className='mt-3'>
                                <Container>
                                    <div className='empower_section'>
                                        <h2 className='mb-4'>How do we empower you?</h2>
                                        <Row>
                                            {
                                                empower.map((data, i) => (
                                                    <Col lg="4" sm="6" className='mb-3' key={i}>
                                                        <div className=''>
                                                            <h3>{data?.title}</h3>
                                                            <p className='three_line' dangerouslySetInnerHTML={{ __html: htmlDecode(data?.description) }} />
                                                        </div>
                                                    </Col>
                                                ))
                                            }

                                        </Row>
                                    </div>
                                </Container>
                            </div> : ''
                    }


                    {
                        counterUp?.length > 0 ?
                            <div className=' color_bg_themer my-xl-4 my-3'>
                                <div className='bg_count  py-5'>
                                    <Container className='py-xl-5'>
                                        {/* <h2 className='text-center mb-4 mb-xl-5 text-white'>Stats Show That Mentorship Results In <br></br>  Tangible <span className='text_yellow'>Benefits </span>For The Mentor</h2> */}
                                        <h2 className='text-center two_line mb-4 mb-xl-5 text-white'>{counterUp[0]?.heading
                                        }</h2>
                                        <Row>
                                            <Col lg="3" xs="6">
                                                <h2 className='mb-3 text-white'>{counterUp[0]?.counterup_value1}</h2>
                                                <h5 className='col-xxl-6  col-lg-9 text-grey two_line'>{counterUp[0]?.counterup_text1}</h5>
                                            </Col>
                                            <Col lg="3" xs="6">
                                                <h2 className='mb-3 text-white'>{counterUp[0]?.counterup_value2}</h2>
                                                <h5 className='col-xxl-6  col-lg-9 text-grey two_line'>{counterUp[0]?.counterup_text2}</h5>
                                            </Col>
                                            <Col lg="3" xs="6">
                                                <h2 className='mb-3 text-white'>{counterUp[0]?.counterup_value3}</h2>
                                                <h5 className='col-xxl-6  col-lg-9 text-grey two_line'>{counterUp[0]?.counterup_text3
                                                }</h5>
                                            </Col>
                                            <Col lg="3" xs="6">
                                                <h2 className='mb-3 text-white'>{counterUp[0]?.counterup_value4}</h2>
                                                <h5 className='col-xxl-6  col-lg-9 text-grey two_line'>{counterUp[0]?.counterup_text4}</h5>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </div> : ''
                    }

                    {
                        SupportList?.length > 0 ?
                            <div className='my-xl-5 my-lg-4 my-3'>
                                <Container>
                                    <h2 className='text-center'>{SupportList[0]?.heading}</h2>
                                    <div className='d-flex justify-content-center mb-lg-4 mb-3'>
                                        <p className='text-center col-xl-6 col-lg-8 two_line col-md-10' dangerouslySetInnerHTML={{ __html: htmlDecode(SupportList[0]?.content) }} />
                                    </div>

                                    <Row className='justify-content-center '>
                                        <Col lg="4" sm="6" className='mb-3 d-flex align-items-center justify-content-center'>
                                            <div className='bg_about_card text-center px-3'>
                                                <div className='d-flex justify-content-center mb-3'>
                                                    <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='icon_auth_about ' src={SupportList[0]?.image1} alt="" />
                                                </div>
                                                <h3>{SupportList[0]?.title1}</h3>
                                                <p className='px-xl-3'>{SupportList[0]?.description1}</p>
                                            </div>
                                        </Col>
                                        <Col lg="4" sm="6" className='mb-3 d-flex align-items-center justify-content-center'>
                                            <div className='bg_about_card text-center px-3'>
                                                <div className='d-flex justify-content-center mb-3'>
                                                    <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='icon_auth_about ' src={SupportList[0]?.image2} alt="" />
                                                </div>
                                                <h3>{SupportList[0]?.title2}</h3>
                                                <p className='px-xl-3'>{SupportList[0]?.description2}</p>
                                            </div>
                                        </Col>
                                        <Col lg="4" sm="6" className='mb-3 d-flex align-items-center justify-content-center'>
                                            <div className='bg_about_card text-center px-3'>
                                                <div className='d-flex justify-content-center mb-3'>
                                                    <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className='icon_auth_about ' src={SupportList[0]?.image3} alt="" />
                                                </div>
                                                <h3>{SupportList[0]?.title3}</h3>
                                                <p className='px-xl-3'>{SupportList[0]?.description3}</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            : ""
                    }

                    {
                        testimonial.length > 0 ?
                            <div className="pb-xl-5 pb-lg-4 pb-3 testimonial_section about_testimonoal">
                                <Container>
                                    <Row>
                                        <Col xl="5">
                                            <div className='d-flex flex-column justify-content-between h-100'>
                                                <div>
                                                    <h4 className='text-sm-start text-center'>Testimonials</h4>
                                                    <h2 className='col-xxl-10 mb-4 text-sm-start text-center'>What Our Mentors Say</h2>
                                                </div>
                                                <div className='d-flex align-items-center'>
                                                    <div className='me-3 position_sectiom' role="button" onClick={() => SlidePrev()}><i className="fa fa-long-arrow-left" aria-hidden="true"></i></div>
                                                    <div className=' position_sectiom' role="button" onClick={() => SlideNext()}><i className="fa fa-long-arrow-right" aria-hidden="true"></i></div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col xl="7">
                                            <div className='position-relative'>
                                                <Slider {...Slider2} ref={CustomSlider} className="slide-2 testimonial-slider no-arrow">
                                                    {
                                                        testimonial.map((data, i) => (
                                                            <div className='slider-item' key={i}>
                                                                <div className='bg_user_test '>
                                                                    <div className='d-flex align-items-center mb-4'>
                                                                        <Rating name="read-only" value={parseInt(data?.rating ?? '')} readOnly />
                                                                    </div>
                                                                    <p className='four_line mb-4 mb-xl-5' dangerouslySetInnerHTML={{ __html: htmlDecode(data?.description) }} />
                                                                    <div className='d-flex align-items-center mt-4 mb-3'>
                                                                        <img src={data?.image} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="me-3 testimonial-user" />
                                                                        <div className=''>
                                                                            <h5>{data?.full_name}</h5>
                                                                            <p className='mb-0'>{data?.location}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </Slider>
                                                <img src={`/assets/images/homepg/testimonial/__Quote.png`} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="img_pos" />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div> : ''
                    }

                    {
                        diff?.length > 0 ?
                            <div className='pb-xl-5 pb-lg-4 pb-3 mt-4 px-3' >
                                <Container className='position-relative'>
                                    <div className='text-center custome_banerhfd'>
                                        <div className='p-3'>
                                            <h2 className='text-white mb-xl-4 mb-3'>{diff[0]?.title}</h2>
                                            <div className='d-flex justify-content-center'>
                                                <h5 className=' three_line text-light mb-xl-4 mb-3 col-xl-8 col-lg-10' dangerouslySetInnerHTML={{ __html: htmlDecode(diff[0]?.description) }} />
                                            </div>
                                            <Link to={'/mentorApplyForm-1'}>
                                                <Button type='button' className='btn'>{diff[0]?.button_text}r</Button>
                                            </Link>
                                        </div>
                                    </div>
                                    <img onError={(e) => e.currentTarget.src = "/assets/images/signupamentor.png"} src={diff[0]?.background_image} alt="" className="signupamentor" />
                                </Container>
                            </div> : ""
                    }


                    {
                        faq.length > 0 ?
                            <div className="faq_section">
                                <Container>
                                    <div className="py-xl-5 py-lg-4 py-3">
                                        <h2 className="text-center mb-3">Frequently Asked Questions</h2>
                                        <Row className="justify-content-center align-items-center">
                                            <Col xl="7">
                                                {
                                                    faq.map((data, i) => (
                                                        <Accordion flush open={open} toggle={toggle} key={i}>
                                                            <AccordionItem >
                                                                <AccordionHeader targetId={`${i}`} >{data?.question ?? ''}</AccordionHeader>
                                                                <AccordionBody accordionId={`${i}`} >
                                                                    <p className='three_line'> {data?.answer ?? ''}<Link to={'/faq'} className="">
                                                                        {/* <span className='fw-bold theme_color'>Read More</span> */}
                                                                    </Link></p>
                                                                </AccordionBody>
                                                            </AccordionItem>
                                                        </Accordion>
                                                    ))
                                                }
                                            </Col>
                                            <Col xl="5" className='d-xl-flex d-none'>
                                                <img onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} src={title?.faq_image ?? ''} alt="" className="img_baner_1" />
                                            </Col>
                                        </Row>

                                    </div>
                                </Container>
                            </div> : ''
                    }
                </div>
        }
    </>
    )
}

export default BecomeMentor;