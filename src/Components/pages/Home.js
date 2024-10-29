import React, { Fragment, useState, useRef, useEffect } from "react";
import Slider from "react-slick";
import { Container, Row, Col, TabContent, TabPane, Nav, NavItem, NavLink, Accordion, AccordionItem, AccordionHeader, AccordionBody, UncontrolledAccordion } from "reactstrap";
import { Slider4, Slider2, Slider3 } from "../../services/script";
import { Slider7 } from "../../services/script";
import { Link, json, useNavigate } from "react-router-dom";
import Select from 'react-select';
import classnames from 'classnames';
import { getAdvices, getBanner2, getCareerMentor, getCompanies, getCounterUp, getDomains, getExploreProgram, getFaq, getPrograms, getSlider, getStories, getTestimonials, getTitleHome } from "./core/_request";
import { usePage } from "./core/PageProvider";
import cn from 'classnames';
import Rating from '@mui/material/Rating';
import Meta from "../../services/Meta";

const Home = () => {

    const array1 = [{ id: 1, name: 'test1' }, { id: 2, name: 'test2' }, { id: 3, name: 'test3' }, { id: 4, name: 'test4' }];

    const array = [15, 16, 17, 18, 19];

    function reducer(accumulator, currentValue, index) {
        const returns = accumulator + currentValue;
        // console.log(
        //     `accumulator: ${accumulator}, currentValue: ${currentValue}, index: ${index}, returns: ${returns}`,
        // ); 

        return returns;
    }

    array.reduce(reducer);

    function htmlDecode(input) {
        if (input && input.includes('&lt;') && input.includes('&gt;')) {
            var e = document.createElement('div');
            e.innerHTML = input;
            return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
        } else {
            return input ?? ''
        }
    }

    const [currentActiveTab, setCurrentActiveTab] = useState("0");
    const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }

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


    const CustomSlider = useRef()
    const slickC = useRef()

    const SlideNext = () => {
        CustomSlider.current.slickNext()
    }

    const SlidePrev = () => {
        CustomSlider.current.slickPrev()
    }

    const router = useNavigate();

    const handleFind = () => {
        // console.log('sdljsdhsl')
        router('/mentor', { state: { filter: filter } })
    }



    const [open, setOpen] = useState('0');

    const toggleDoit = (id) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };

    const [slideData, setSlideData] = useState([])
    const [banners, setBanners] = useState([])
    const [testimonial, setTestimonial] = useState([])
    const [domains, setDomains] = useState([])
    const [companies, setcompanies] = useState([])
    const [programs, setPrograms] = useState([])
    const [isloading, setloading] = useState(true)
    const [mentors, setMentors] = useState([])
    const [expertise, setExpertise] = useState([])
    const [faq, setFaq] = useState([])
    const [stats, setStats] = useState([])
    const [advices, setAdvice] = useState([])
    const [stories, setStories] = useState([])
    const [title, setTitle] = useState()
    const [mentorID, setmentorId] = useState('')
    const [initIndex, setinitIndex] = useState(0)
    const [filter, setfilter] = useState({
        "interest": '',
        "program": '',
        "domain": '',
        "companies": ''
    })

    const Data = [
        {
            img: "home1",
            title: "welcome to fashion",
            desc: "men fashion",
            link: "/left-sidebar/collection ",
        },
        {
            img: "home2",
            title: "welcome to fashion",
            desc: "women fashion",
            link: "/left-sidebar/collection ",
        },
    ];

    const fetchSlider = async () => {
        setloading(true);
        getSlider().then(res => {
            setSlideData(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }


    const fetchTitleHome = async () => {
        setloading(true);
        getTitleHome().then(res => {
            setTitle(res?.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchFaq = async () => {
        setloading(true);
        getFaq(1).then(res => {
            setFaq(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchTestimonials = async () => {
        setloading(true);
        getTestimonials(1).then(res => {
            setTestimonial(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchDomains = async () => {
        setloading(true);
        getDomains().then(res => {
            setDomains(res.data);
            setloading(false);
            // setmentorId(res.data[0]?.id)
            // MentorTab(res.data[0]?.id);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchCompanies = async () => {
        setloading(true);
        getCompanies().then(res => {
            setcompanies(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const MentorTab = (id) => {
        getCareerMentor(id).then(res => {
            setMentors(res.data ?? []) 
 
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchCourses = async () => {
        setloading(true);
        getPrograms().then(res => {
            setPrograms(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchAdvice = async () => {
        setloading(true);
        getAdvices().then(res => {
            setAdvice(res.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchExplore = async () => {
        setloading(true);
        getExploreProgram().then(res => {
            setExpertise(res.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchStatsCounters = async () => {
        setloading(true);
        getCounterUp().then(res => {
            setStats(res.data)
            let value = [];
            // let value = [];
            // let result = {}
            // res.data.map((v,i)=> {
            //     if (v.key.includes(1)) {
            //         if (v.key.includes('text')) {
            //             result.text =  v.value
            //         } else {
            //             result.value = v.value
            //         }
            //     }
            //     value.push(result)
            // })
            // console.log(value)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchBanners = async () => {
        setloading(true);
        getBanner2().then(res => {
            setBanners(res.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchStories = async () => {
        setloading(true);
        getStories().then(res => {
            setStories(res)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }


    const fetchPromist = async () => {
        await Promise.all([
            fetchSlider(),
            fetchTestimonials(),
            fetchDomains(),
            fetchCourses(),
            fetchCompanies(),
            fetchAdvice(),
            fetchExplore(),
            fetchFaq(),
            fetchStatsCounters(),
            fetchBanners(),
            fetchStories(),
            MentorTab(0),
            fetchTitleHome()
        ])
    }

    useEffect(() => {
        fetchPromist()
        // fetchSlider();
        // fetchTestimonials();
        // fetchDomains();
        // fetchCourses();
        // fetchCompanies();
        // fetchAdvice();
        // MentorTab(5);
        // fetchExplore();
        // fetchFaq();
        // fetchStatsCounters();
        // fetchBanners();
    }, [])




    return (<> 
            <Meta
                title={"Mentaroo"} 
                pathName={'/'} 
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
                <div className="swift-up-text">
                    {/* Banner */}
                    {
                        slideData.length > 0 &&
                        <section className="p-0 home_slider ">
                            <Slider className="slide-1 home-slider" dots={true} autoplay={true} autoplaySpeed={2000}>
                                {slideData.map((data, i) => (
                                    <div className={`home ${data.img}`} key={i} style={{ backgroundImage: `url(${data.image})` }}>
                                        <Container>
                                            <Row className="align-items-center py-4">
                                                <Col lg='6' md="7">
                                                    <div className="banner_inner">
                                                        <div className="">
                                                            {/* <h1 className="col-xl-10">Power your career ahead with <span>Mentaroo</span></h1> */}
                                                            <h1 className="col-xl-10 text_box">{
                                                                data?.title ?
                                                                    data?.title.split(' ').map((t, i) => (
                                                                        data?.title.split(' ')?.length - 1 == i ? <span key={i}>{t}</span> : <data key={i}>{t + " "}</data>
                                                                    )) : ''
                                                            }</h1>
                                                            {/* <h5 className="py-xxl-4 py-3">Engage in 1-on-1 conversation with an expert at just Rs 99!</h5> */}
                                                            <h5 className="py-xxl-4 py-3">{data?.description}</h5>
                                                            <Link
                                                                to={data?.button_url ?? '/'}
                                                                className={`btn btn btn_banner`}>
                                                                {data?.button_text}
                                                                {/* Explore Mentors */}
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </Col>
                                                <Col lg='6' md="5">
                                                    {/* <img src={`/assets/images/homepg/banner/bannerimage.png`} alt="" className="banner_image d-md-block d-none" /> */}
                                                    <img src={data.image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg2.png"} alt="" className="banner_image d-md-block d-none" />
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                ))}
                            </Slider>
                        </section>
                    }

                    {/* Find Your Mentor */}
                    <section className="pt-lg-5 pt-3 pb-xxl-5 ">
                        <Container>
                            <div className="partition2">
                                <h2 className="text-center">{title?.home_mentor_title ?? ''}</h2>
                                <h4 className="text-center">{title?.home_mentor_text ?? ''}</h4>

                                <Row className="select_dropdown mt-lg-4 mt-xxl-5 mt-3 justify-content-center">
                                    <Col xl="2" md="4" sm="6" xs="12" className="mb-xl-0 mb-3 d-none">
                                        <div className="mentor_f d-none">
                                            <Select
                                                isSearchable={false}
                                                placeholder='Interest'
                                                classNamePrefix="select"
                                                options={[]}
                                                // defaultValue={{ label: 'Topics of Interest', value: '1' }}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: '#f4f7f7',
                                                        primary: '#125453',
                                                        primary50: '#f4f7f7',
                                                    },
                                                })}
                                            />
                                        </div>
                                    </Col>

                                    <Col xl="2" md="3" sm="6" xs="12" className="mb-xl-0 mb-3">
                                        <div className=" mentor_f">
                                            <Select
                                                isSearchable={false}
                                                placeholder='Programs'
                                                classNamePrefix="select"
                                                options={programs}
                                                // defaultValue={{ label: 'Programs', value: '1' }}
                                                getOptionLabel={(value) => value?.title}
                                                getOptionValue={(value) => value?.id}
                                                onChange={(e) => setfilter((p) => ({ ...p, program: e?.id }))}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: '#f4f7f7',
                                                        primary: '#125453',
                                                        primary50: '#f4f7f7',
                                                    },
                                                })}
                                            />
                                        </div>
                                    </Col>

                                    <Col xl="2" md="3" sm="6" xs="12" className="mb-xl-0 mb-3">
                                        <div className="mentor_f">
                                            <Select
                                                isSearchable={false}
                                                placeholder='Domains'
                                                classNamePrefix="select"
                                                options={domains}
                                                // defaultValue={{ label: 'Domains', value: '1' }}
                                                getOptionLabel={(value) => value?.name}
                                                getOptionValue={(value) => value?.id}
                                                onChange={(e) => setfilter((p) => ({ ...p, domain: e?.id }))}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: '#f4f7f7',
                                                        primary: '#125453',
                                                        primary50: '#f4f7f7',
                                                    },
                                                })}
                                            />
                                        </div>
                                    </Col>

                                    <Col xl="2" md="3" sm="6" xs="12" className="mb-xl-0 mb-3">
                                        <div className="mentor_f">
                                            <Select
                                                isSearchable={false}
                                                placeholder='Companies'
                                                classNamePrefix="select"
                                                options={companies}
                                                getOptionLabel={(event) => event?.name}
                                                getOptionValue={(event) => event?.id}
                                                onChange={(e) => setfilter((p) => ({ ...p, companies: e?.id }))}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: '#f4f7f7',
                                                        primary: '#125453',
                                                        primary50: '#f4f7f7',
                                                    },
                                                })}
                                            />
                                        </div>
                                    </Col>

                                    <Col xl="2" md="3" sm="6" xs="12" className="mb-xl-0 mb-3">
                                        {/* <Link to={'/mentor'} state={{ filter: filter }}> */}
                                            <button  className="submit_btn" type="button" onClick={()=> router('/mentor',{state :{ filter: filter } })} >Submit</button>
                                        {/* </Link> */}
                                    </Col>
                                </Row>
                            </div>
                        </Container>
                    </section> 

                    {/* notch advice! */}
                    {
                        advices.length > 0 ?
                            <Container className="py-xxl-5 py-3 ">
                                <div className="d-flex justify-content-center w-100">
                                    <h2 className="text-center two_line w-50">{title?.home_advice_heading ?? ''}</h2>
                                </div>
                                {/* <h2 className="text-center ">destination for top notch advice!</h2> */}
                                <Row className="mt-xl-5 mt-lg-4 mt-3 justify-content-center md_xonten">
                                    {
                                        advices.map((data, i) => (
                                            <Col xl="4" md="6" className="mb-3 mb-lg-4" key={i}>
                                                <div className="bg_destination_outer">
                                                    <div className="d-md-block d-flex flex_reverse">
                                                        <div className="d-flex justify-content-end">
                                                            <div className="bg_destination">
                                                                <img src={data?.icon} alt="" className="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} />
                                                            </div>
                                                        </div>
                                                        <h6 className="one_line">{data?.title}</h6>
                                                    </div>
                                                    <p className="three_line">{data?.description}</p>
                                                </div>
                                            </Col>
                                        ))
                                    }
                                </Row>
                            </Container>
                            : ""
                    }

                    {/* career mentor */}
                    {
                        domains.length > 0 ?
                            <section>
                                <Container className="pb-lg-5 py-3 pt-xl-5 section_tab">
                                    {/* <h2 className="text-center">Easily access a committed career mentor</h2> */}
                                    <div className="d-flex justify-content-center w-100">
                                        <h2 className="text-center two_line w-50">{title?.home_career_mentor_heading ?? ''}</h2>
                                    </div>
                                    <div className="border_boton"><div className="inner_bojd"></div></div>
                                    <Nav tabs className="mt-xl-5 mt-lg-4 mt-3 custome_screy">
                                        <NavItem>
                                            <NavLink
                                                className={classnames({
                                                    active:
                                                        // currentActiveTab === `${i}`
                                                        '' == mentorID
                                                })}
                                                onClick={() => { toggle(``); MentorTab(0); setmentorId('');}}
                                            >
                                                All
                                            </NavLink>
                                        </NavItem>
                                        {
                                            domains.map((data, i) => (
                                                <NavItem key={i}>
                                                    <NavLink
                                                        className={classnames({
                                                            active:
                                                                // currentActiveTab === `${i}`
                                                                data?.id == mentorID
                                                        })}
                                                        onClick={() => { toggle(`${i}`);  MentorTab(data?.id); setmentorId(data?.id); setfilter((p) => ({ ...p, domain: data?.id })) }}
                                                    >
                                                        {data.name}
                                                    </NavLink>
                                                </NavItem>
                                            ))
                                        }

                                        {/* <Link to={'/mentor'} state={{ filter: filter }}> */}
                                            <NavItem className="cusome_btj" >
                                                <NavLink
                                                    className={classnames({
                                                        active:
                                                            currentActiveTab === '6'
                                                    })}
                                                    onClick={() => { toggle('6'); router('/mentor', {state:{filter: filter}}) }}
                                                >
                                                    Find My Mentor <i className="fa fa-angle-right ms-2" aria-hidden="true"></i>
                                                </NavLink>
                                            </NavItem>
                                        {/* </Link> */}
                                    </Nav>

                                    <TabContent activeTab={currentActiveTab}>
                                        {
                                            mentors?.length > 0 ?
                                                <TabPane tabId={currentActiveTab}>
                                                    <Slider {...Slider4}  infinite={mentors?.length > 1 ? true : false}   swipe={mentors?.length > 3}  ref={slickC}  className="slide-4 slide_commitcareer" >
                                                        { 
                                                            mentors.map((data, i) => (
                                                                <div className="slider-item h-100" key={i}>
                                                                    <div className="bg_careermentor my-lg-4 my-xl-5 my-3 position-relative h-100" onClick={() => router('/mentorDetails', { state: { id: data.id } })}>
                                                                        <div className="bg_coussag ">
                                                                            <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="start me-1" /><span>{data?.overall_rating}</span> </div>
                                                                        <div className="d-flex-sm">
                                                                            <div className="d-flex align-items-center justify-content-center mb-3 mt-4">
                                                                                <img src={data?.image} alt="" className="user"
                                                                                    onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"}
                                                                                />
                                                                            </div>

                                                                            <div className="">
                                                                                <h3 className="one_line">{data?.first_name ?? " "}</h3>
                                                                                <p className="two_line">{data?.job_title}</p>
                                                                                <div className="custome_descd">
                                                                                    <h4>{data?.total_mentees ?? 0} mentees</h4>
                                                                                    <div className="bg_coussag ">
                                                                                        <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="start me-1" /><span>{data?.overall_rating}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))
                                                        }
                                                    </Slider>
                                                </TabPane> : ""
                                        }
                                    </TabContent>
                                </Container>
                            </section>
                            : ''
                    }

                    {
                        companies?.length > 0 ?
                            <section className="pt-lg-5 py-3 pb-xl-5 custome_zbdvy">
                                <div className="d-flex justify-content-center">
                                    <div className="d-flex justify-content-center w-100">
                                        <h2 className="text-center two_line col-xl-7 col-lg-10 col-md-11">{title?.home_company_heading ?? ''}</h2>
                                    </div>
                                    {/* <h2 className="text-center col-xl-7 col-lg-10 col-md-11">Tap into the minds of mentors who've fueled success in the world's foremost companies</h2> */}
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
                            </section>
                            : ''
                    }

                    {
                        expertise.length > 0 ?
                            <section className="py-xxl-5 py-3 jurny_sectoion">
                                <Container>
                                    <div className="d-flex justify-content-center w-100">
                                        <h2 className="text-center two_line col-xl-7 col-lg-10 col-md-11">{title?.home_expertise_heading ?? ''}</h2>
                                    </div>
                                    {/* <h2 className="text-center px-5">Your journey intersects with our expertise</h2> */}
                                    <div className="pt-xl-5 pt-lg-4 pt-3">
                                        <Row className="md_xonten">
                                            {
                                                expertise.slice(0, 6).map((data, i) => (
                                                    <Col lg="4" sm="6" className="mb-3 mb-lg-4" key={i}>
                                                        <div className="jurny_bg">
                                                            <div className="d-flex align-items-center mb-3">
                                                                <img src={data?.image} alt="" className="jurny_img me-3" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} />
                                                                <h5>{data?.title}</h5>
                                                            </div>
                                                            <p className="three_line mb-0">{data?.description}</p>
                                                        </div>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                        {
                                            expertise.length > 6 ?
                                                <div className="d-flex justify-content-center mt-3">
                                                    <Link to={`/exploreprogram`}> <button type="button" className="btn_em">Explore More</button> </Link>
                                                </div> : ''
                                        }
                                    </div>
                                </Container>
                            </section> : ""
                    }

                    {
                        stats.length > 0 ?
                            <section>
                                <Container>
                                    <div className="satesection d-xl-block d-none">
                                        <Row className="d-flex align-items-center justify-content-center">
                                            <Col xl="5" className="pe-xl-4">
                                                <h2 className="px-4 px-xxl-5 two_line">{title?.home_counterup_heading}</h2>
                                            </Col>
                                            {
                                                stats.map((data, i) => (
                                                    <Col key={i}>
                                                        <div className="inner_satesection" >
                                                            <h2 className="mb-3 mt-4">{JSON.parse(data?.value)?.value}</h2><p>{JSON.parse(data?.value)?.text}</p>
                                                        </div>
                                                    </Col>
                                                ))
                                            }
                                        </Row>
                                    </div>
                                </Container>
                            </section>
                            : ""
                    }

                    {/* How Does This Work? */}
                    <div className='bg_work mt-lg-4 mt-xl-5 mt-3'>
                        <Container className="py-xl-5 py-lg-4 py-3 inner_test">
                            <h2 className='text-center'>How Does This Work?</h2>
                            <h4 className='text-center mb-3 fw-400'>Simple, Easy & Effective</h4>
                            <Row className=' align-items-cnter justify-content-center'>
                                <Col xl="3" lg="4" xs="6" className='d-flex align-items-cnter justify-content-center mb-xl-0 mb-3'>
                                    <div className='p-sm-3 p-2 cusome_uatdc'>
                                        <div className='mb-3 d-xl-none d-flex align-items-center justify-content-center'>
                                            <img src={`/assets/images/homepg/icons/__Sign Up.png`} alt="" className="" />
                                        </div>
                                        <h4 className='text-center'>Find your Mentor</h4>
                                        <p className='text-center mb-0'>Discover the right mentor for you by exploring our network of skilled professionals.</p>
                                    </div>

                                </Col>
                                <Col xl="2" xs="12" className='d-xl-flex d-none'></Col>
                                <Col xl="3" lg="4" xs="6" className='d-flex align-items-cnter justify-content-center mb-xl-0 mb-3'>
                                    <div className='p-sm-3 p-2 cusome_uatdc'>
                                        <div className='mb-3 d-xl-none d-flex align-items-center justify-content-center'>
                                            <img src={`/assets/images/homepg/icons/__Find your Mentor.png`} alt="" className="" />
                                        </div>
                                        <h4 className='text-center'>Get Personalized guidance</h4>
                                        <p className='text-center mb-0'>Collaborate with your mentor to create an actionable work plan tailored to your developmental goals</p>
                                    </div>
                                </Col>
                            </Row>
                            <img src={`/assets/images/homepg/Workflow.png`} alt="" className="w-100 d-xl-block d-none" />
                            <Row className=' align-items-cnter justify-content-xl-between justify-content-center'>
                                <Col xl="3" lg="4" xs="6" className='d-flex align-items-cnter justify-content-center mb-xl-0 mb-3'>
                                    <div className='p-sm-3 p-2 cusome_uatdc'>
                                        <div className='mb-3 d-xl-none d-flex align-items-center justify-content-center'>
                                            <img src={`/assets/images/homepg/icons/__Connect with your mentor.png`} alt="" className="" />
                                        </div>
                                        <h4 className='text-center'>Find your Mentor</h4>
                                        <p className='text-center '>Discover the right mentor for you by exploring our network of skilled professionals.</p>
                                    </div>

                                </Col>
                                <Col xl="3" lg="4" xs="6" className='d-flex align-items-cnter justify-content-center mb-xl-0 mb-3'>
                                    <div className='p-sm-3 p-2 cusome_uatdc'>
                                        <div className='mb-3 d-xl-none d-flex align-items-center justify-content-center'>
                                            <img src={`/assets/images/homepg/icons/__Get Personalized guidance.png`} alt="" className="" />
                                        </div>
                                        <h4 className='text-center'>Get Personalized guidance</h4>
                                        <p className='text-center'>Collaborate with your mentor to create an actionable work plan tailored to your developmental goals</p>
                                    </div>
                                </Col>
                                <Col xl="3" lg="4" xs="6" className='d-flex align-items-cnter justify-content-center mb-xl-0 mb-3'>
                                    <div className='p-sm-3 p-2 cusome_uatdc'>
                                        <div className='mb-3 d-xl-none d-flex align-items-center justify-content-center'>
                                            <img src={`/assets/images/homepg/icons/__Work with your mentor.png`} alt="" className="" />
                                        </div>
                                        <h4 className='text-center'>Get Personalized guidance</h4>
                                        <p className='text-center'>Collaborate with your mentor to create an actionable work plan tailored to your developmental goals</p>
                                    </div>
                                </Col>
                            </Row>
                            <div className="d-flex justify-content-center align-items-center mt-4 ">
                                <Link to={`/mentor`} ><button className="btn_em me-3">Find My Mentor</button></Link>  
                                <Link to={`/becomeMentor`}><h4 className='mb-0 text-underline'>Become a Mentor</h4></Link>
                            </div>
                        </Container>
                    </div>

                    {/* small banner */}
                    {
                        banners.length > 0 ?
                            <Container className="py-xl-5 py-lg-4 py-3 ">
                                <Row className='md_xonten'>
                                    {
                                        banners.map((data, i) => (
                                            <Col lg="6" className="h-100 " key={i}><img src={data?.full_path} alt="" className="img_baner_1" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} /></Col>
                                        ))
                                    }
                                </Row>
                            </Container>
                            : ""
                    }

                    {
                        testimonial.length > 0 ?
                            <div className="testimonial_section ">
                                <Container>
                                    <Row>
                                        <Col xl="5">
                                            {
                                                testimonial.length > 2 ?
                                                    <div className='d-flex flex-column justify-content-between h-100'>
                                                        <div>
                                                            <h4 className='text-sm-start text-center'>{title?.home_testimonial_title ?? ''}</h4>
                                                            <h2 className='col-xxl-10 mb-4 text-sm-start text-center'>{title?.home_testimonial_heading}</h2>
                                                        </div>
                                                        <div className='d-flex align-items-center'>
                                                            <div className='me-3 position_sectiom' role="button" onClick={() => SlidePrev()}><i className="fa fa-long-arrow-left" aria-hidden="true"></i></div>
                                                            <div className=' position_sectiom' role="button" onClick={() => SlideNext()}><i className="fa fa-long-arrow-right" aria-hidden="true"></i></div>
                                                        </div>
                                                    </div> : ''
                                            }
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
                                                <img src={`/assets/images/homepg/testimonial/__Quote.png`} alt="" className="img_pos" />
                                            </div>
                                        </Col>
                                    </Row>
                                </Container>
                            </div>
                            : ""
                    }

                    {
                        faq.length > 0 ?
                            <div className="faq_section">
                                <Container>
                                    <div className="py-xl-5 py-lg-4 py-3">
                                        <h2 className="text-center mb-3">{title?.faq_title ?? ''}</h2>
                                        <Row className="justify-content-center align-items-center">
                                            <Col xl="7" className='pe-xl-5'>
                                                <UncontrolledAccordion defaultOpen={`0`} className='me-xl-3'>
                                                    <Accordion flush open={open} toggle={toggleDoit}>
                                                        {
                                                            faq.map((data, i) => (
                                                                <AccordionItem key={i} >
                                                                    <AccordionHeader targetId={`${i}`} >{data?.question ?? ''}</AccordionHeader>
                                                                    <AccordionBody accordionId={`${i}`} >
                                                                        <p className="">
                                                                            <span className="three_line">{data?.answer ?? ''}</span>
                                                                            {/* <Link to={'/faq'} className="">
                                                                                <span className='fw-bold theme_color'>Read More</span>
                                                                            </Link> */}
                                                                            </p>
                                                                    </AccordionBody>
                                                                </AccordionItem>
                                                            ))
                                                        }
                                                    </Accordion>
                                                </UncontrolledAccordion>
                                            </Col>
                                            <Col xl="5" className='d-xl-flex d-none ps-xl-5'>
                                                <img src={title?.faq_image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="img_baner_1" />
                                            </Col>
                                        </Row>
                                    </div>
                                </Container>
                            </div>
                            : ""
                    }

                    {
                        stories.length > 0 ?
                            <div className="py-xl-5 py-lg-4 py-3 bg_stories">
                                <Container>
                                    <h4 className='text-sm-start text-center mb-3'>{title?.store_title}</h4>
                                    <h2 className='mb-xl-4 mb-3 text-sm-start text-center'>{title?.store_heading}</h2>
                                    <Slider {...Slider3} className="slide-2 testimonial-slider no-arrow">
                                        {
                                            stories.map((data, i) => (
                                                <div className="slider-item h-100 d-flex align-items-center" key={i} onClick={() => router('/stories_detail', { state: { id: data?.blog_id } })}>
                                                    <div className="inner_stories h-100">
                                                        <h3 className="mb-3 two_line">{data?.title}</h3>
                                                        <div className="d-flex align-items-center mb-3">
                                                            <img src={data?.user_image ?? ''} alt="" className="image_auth me-2" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} />
                                                            <div className="">
                                                                <h6 className="mb-0">{data?.user_name}</h6>
                                                                <p className="mb-0">{data?.job_title}</p>
                                                            </div>
                                                        </div>

                                                        <img src={data?.banner ?? ''} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="image_stories mb-3" />
                                                        {
                                                            data?.added_date &&
                                                            <div className="d-flex align-items-center">
                                                                <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                                                <p className="mb-0">{formatUnixTimestamp(data?.added_date)}</p>
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            ))
                                        }

                                    </Slider>
                                </Container>
                            </div>
                            : ""
                    }

                </div>
        }
    </>
    )
}


export default Home;