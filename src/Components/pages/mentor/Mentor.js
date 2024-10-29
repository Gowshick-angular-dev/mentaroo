import React, { useState, useEffect, useRef } from 'react';
import {
    Container, Row, Col, Collapse,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Button
} from 'reactstrap';
import RangeSlider from 'react-bootstrap-range-slider';
import Slider from '@mui/material/Slider';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import 'rc-slider/assets/index.css';
import Range from "rc-slider";
import { Link } from 'react-router-dom';
import cn from 'classnames';
import Select from "react-select"
import { getCompanies, getDomains, getMentors, getPrograms } from '../core/_request';
import { useNavigate, useLocation } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Meta from '../../../services/Meta';

const theme = createTheme({
    palette: {
        primary: {
            main: '#135554',
        },
    },
});


const Mentor = ({ direction, ...args }) => {

    const [sidebarView, setSidebarView] = useState(false)
    const [mentorList, setMentorList] = useState([])
    const router = useNavigate();
    const { state } = useLocation();
    const [isCategoryOpen, setIsCategoryOpen] = useState(true);
    const toggleCategory = () => setIsCategoryOpen(!isCategoryOpen);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [isOpen3, setIsOpen3] = useState(false);
    const toggleBrand = () => setIsOpen(!isOpen);
    const toggleBrand2 = () => setIsOpen2(!isOpen2);
    const toggleBrand3 = () => setIsOpen3(!isOpen3);



    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);

    const openCloseSidebar = () => {
        if (sidebarView) {
            setSidebarView(!sidebarView)
        } else {
            setSidebarView(!sidebarView)
        }
    }

    const [sortBy, setSortBy] = useState("AscOrder");
    const [values, setValues] = useState([1, 30]);
    const [values2, setValues2] = useState([20, 50, 70, 90]);

    const handleChange = (event, newValue) => {
        // const newValues = e.target.value.split(',').map((val) => parseInt(val));
        setValues(newValue);
        setFilter((P) => ({
            ...P,
            exp: newValue.join(",") ?? 0
        }))
    };
    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(1000);
    const [values1, setValues1] = useState([1, 10000]);
    const handleChanged = (event) => {
        setMinValue(event.target.value.min);
        setMaxValue(event.target.value.max);
    };

    const handleChange1 = (event, newValue) => {
        // const newValues1 = e.target.value.split(',').map((val) => parseInt(val));
        console.log(newValue.join(","))
        setValues1(newValue);
        setFilter((P) => ({
            ...P,
            price: newValue.join(",") ?? 0
        }))
    };

    const [isloading, setloading] = useState(true)
    const [domains, setDomains] = useState([])
    const [companies, setcompanies] = useState([])
    const [programs, setPrograms] = useState([])
    const [sKeys, setsKeys] = useState('')
    const [stateValue, setstateValue] = useState(state?.filter ? true : false)

    const key = state?.filter;

    const [filter, setFilter] = useState({
        skey: "",
        exp: "",
        price: "",
        dom: key?.domain ?? "",
        com: key?.companies ?? "",
        pro: key?.program ?? "",
        rating: "",
        sort: "",
    })

    const fetchMentors = async (key, exp, price, rating, company, domain, program, sort) => {
        setloading(true);
        getMentors(key, exp, price, rating, company, domain, program, sort).then(res => {
            if (res.data) {
                setMentorList(res.data)
            } else {
                setMentorList([])
            }
            setsKeys('')
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    // const fetchFilterMentors = async (key, exp, price, rating, company, domain, program) => {
    //     getMentors(key, exp, price, rating, company, domain, program).then(res => {
    //         setMentorList(res.data ?? []);
    //     }).catch(e => {
    //         console.log(e)
    //     })
    // }

    const fetchDomains = async () => {
        // setloading(true);
        getDomains().then(res => {
            setDomains(res.data);
            // setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchCompanies = async () => {
        // setloading(true);
        getCompanies().then(res => {
            setcompanies(res.data);
            // setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    const fetchCourses = async () => {
        // setloading(true);
        getPrograms().then(res => {
            setPrograms(res.data);
            // setloading(false);
        }).catch(e => {
            console.log(e)
            // setloading(false);
        })
    }

    // useEffect(() => {
    //     if (stateValue && filter.com == "" && filter.dom == "" && filter.pro == "") {
    //         let key = state?.filter
    //         fetchMentors(sKeys, filter.exp, filter.price, filter.rating, key?.companies, key.domain, key.program, filter.sort);
    //     } else {
    //         fetchMentors(sKeys, filter.exp, filter.price, filter.rating, filter.com, filter.dom, filter.pro, filter.sort);
    //     }
    // }, [filter])

    useEffect(() => {
        fetchMentors(sKeys, filter.exp, filter.price, filter.rating, filter.com, filter.dom, filter.pro, filter.sort);
    }, [filter])


    useEffect(() => {
        fetchDomains();
        fetchCourses();
        fetchCompanies();
    }, [])





    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = mentorList.length ?? 0;

    const totalPages = Math.ceil(mentorList.length / itemsPerPage);

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [activePage])

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    const goToFirstPage = () => {
        setActivePage(1);
    };

    const goToLastPage = () => {
        setActivePage(totalPages);
    };

    const openSidebar = () => {
        openCloseSidebar(sidebarView)
    }

    const startItemIndex = (activePage - 1) * itemsPerPage;
    const endItemIndex = Math.min(startItemIndex + itemsPerPage, totalItems);

    // const currentPageItems = Array.from(Array(itemsPerPage), (_, index) => {
    const currentPageItems = mentorList.slice(startItemIndex, endItemIndex).map((data, index) => {
        const itemNumber = (activePage - 1) * itemsPerPage + index + 1;
        return (
            <Col xl="6" lg="12" className="mb-3 " key={index}>
                <Link to="/mentorDetails" state={{ id: data.id }}>
                    <div className="listing-card h-100">
                        <div className="d-flex mb-3">
                            <div className="position-relative me-3">
                                <img src={data?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd" />
                                {/* <img src={`/assets/images/__Badge.png`} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="list_img_gd_pos" /> */}
                            </div>
                            <div className="edsf">
                                <h5 className="one_line mb-1">{data?.first_name ?? ''}</h5>
                                <p className="mb-1 theme_color one_line fw-bold">{data?.mentorDetail?.job_title}</p>
                                <p className="one_line">{data?.mentorDetail?.yrs_of_exp ? parseInt(data?.mentorDetail?.yrs_of_exp ?? 0) + " yrs of Exp." : ''}</p>
                            </div>
                        </div>

                        <div className="d-flex align-items-center justify-content-between ">
                            <div className="d-flex align-items-center mb-3">

                                <div className="custonePdhg d-flex align-items-center me-3">
                                    <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="img-satrt me-2" />
                                    <h5>{data?.overall_rating ?? 0}</h5>
                                </div>
                                <p className="mb-0 sm-font-p">{data?.total_mentees} mentees</p>
                            </div>
                            {
                                data?.lowest_price ?
                                    <div className="custonesgfhvd d-flex align-items-center mb-3">
                                        <img src={`/assets/images/homepg/icons/__Tag.png`} alt="" className="img-key me-2" />
                                        <h5>Introductory Call @ Rs {JSON.parse(data?.lowest_price ?? '0')}.</h5>
                                    </div>
                                    : ''
                            }
                        </div>

                        <p className="three_line">{data?.biography ?? ''}</p>

                        {
                            data?.mentorDetail?.courses?.length > 0 ?
                                <>
                                    <hr></hr>
                                    <div className="d-flex flex-wrap">
                                        {
                                            data?.mentorDetail?.courses?.map(((v, i) => (
                                                <div className="text_bguryh mb-2 me-2 " key={i}>{v?.title}</div>
                                            )))
                                        }
                                    </div>
                                </> : ""
                        }

                    </div>
                </Link>
            </Col>
        );
    });

    const paginationNumbers = Array.from(Array(totalPages), (_, index) => (
        <Button
            key={index}
            onClick={() => { handlePageChange(index + 1); window.scrollTo(0, 0) }}
            className={activePage === index + 1 ? 'active' : ''}
        >
            {index + 1}
        </Button>
    ));

    return (    
        <>
            <Meta
                title={"Mentors"}
                key={"mentor"}
                pathName={'/mentor'}
                description={"All Mentor List"}
            />

            <section className="section-b-space ratio_asos text-start">
                <img src={`/assets/images/listpagebanner.png`} alt="" className="banner_list" />
                <div className="collection-wrapper my-4">
                    <Container>
                        <Row>
                            <Col sm={"4"} xl={"3"} className="collection-filter" style={sidebarView ? { left: "0px" } : {}}>
                                <div className="collection-filter-block boredr_vd ">
                                    <div className="collection-mobile-back" onClick={() => openCloseSidebar(sidebarView)}>
                                        <span className="filter-back">
                                            <i className="fa fa-angle-left" aria-hidden="true"></i> Filters
                                        </span>
                                    </div>
                                    <div className='mobile_sidebar' >
                                        <div className='mt-3 px-3 px-xl-4 stye-filetr'>
                                            <h5 className='mb-3 mt-4'>Search Here</h5>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                setSidebarView(false)
                                                fetchMentors(sKeys, filter.exp, filter.price, filter.rating, filter.com, filter.dom, filter.pro, filter.sort);
                                            }}>
                                                <div className='filter-search d-flex justify-content-between align-items-center'>
                                                    <input type='search' value={sKeys} className='border border-0 text-truncate w-100' placeholder='Search by company,skills' onChange={(e) => {
                                                        setsKeys(e.target.value)
                                                    }}></input>
                                                    <i onClick={() => sKeys && fetchMentors(sKeys, filter.exp, filter.price, filter.rating, filter.com, filter.dom, filter.pro, filter.sort)} className="fa fa-search" aria-hidden="true"></i>
                                                </div>
                                                <button type='submit' className='d-none' />
                                            </form>
                                        </div>
                                        <hr></hr>
                                        <div className='mt-3 px-3 px-xl-4 stye-filetr'>
                                            <h5 className='mb-3'>Year Of Experience</h5>
                                            <div>

                                                <ThemeProvider theme={theme}>
                                                    <Slider
                                                        value={values}
                                                        onChange={handleChange}
                                                        min={1}
                                                        max={30}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </ThemeProvider>

                                                <ul>
                                                    {values[0] + "-" + values[1]}
                                                </ul>
                                            </div>
                                        </div>
                                        <hr></hr>

                                        <div className='mt-3 px-3 px-xl-4 stye-filetr'>
                                            <h5 className='mb-3'>Pricing</h5>
                                            <div>
                                                <ThemeProvider theme={theme}>
                                                    <Slider
                                                        value={values1}
                                                        onChange={handleChange1}
                                                        min={1}
                                                        step={500}
                                                        max={10000}
                                                        valueLabelDisplay="auto"
                                                    />
                                                </ThemeProvider>
                                                <ul>
                                                    {values1[0] + "-" + values1[1]}
                                                </ul>
                                            </div>
                                        </div>
                                        <hr></hr>
                                        {/* Ratings */}
                                        <div className="collection-collapse-block open px-3 px-xl-4" >
                                            <h3 className={isCategoryOpen ? 'collapse-block-title2' : "collapse-block-title"} onClick={toggleCategory}>
                                                Ratings
                                            </h3>
                                            <Collapse isOpen={isCategoryOpen}>
                                                <div className="collection-collapse-block-content">
                                                    <div className="collection-star-filter">
                                                        <div className="checkbox-container w-100" onClick={() => {
                                                            setFilter((P) => ({
                                                                ...P,
                                                                rating: P?.rating === 5 ? '' : 5
                                                            })); setSidebarView(false)
                                                        }}>
                                                            <div className='d-flex align-items-center mb-3' >
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                            </div>
                                                            <input type="checkbox" checked={filter.rating === 5} onChange={() => { }} />
                                                            <span className="checkmark me-2"></span>
                                                        </div>

                                                        <div className="checkbox-container w-100" onClick={() => {
                                                            setFilter((P) => ({
                                                                ...P,
                                                                rating: P?.rating === 4 ? '' : 4
                                                            })); setSidebarView(false)
                                                        }}>
                                                            <div className='d-flex align-items-center mb-3' >
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                            </div>
                                                            <input type="checkbox" onChange={() => { }} checked={filter.rating === 4} />
                                                            <span className="checkmark me-2"></span>
                                                        </div>

                                                        <div className="checkbox-container w-100" onClick={() => {
                                                            setFilter((P) => ({
                                                                ...P,
                                                                rating: P?.rating === 3 ? '' : 3
                                                            })); setSidebarView(false)
                                                        }}>
                                                            <div className='d-flex align-items-center mb-3' >
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                            </div>
                                                            <input type="checkbox" onChange={() => { }} checked={filter.rating === 3} />
                                                            <span className="checkmark me-2"></span>
                                                        </div>
                                                        <div className="checkbox-container w-100" onClick={() => {
                                                            setFilter((P) => ({
                                                                ...P,
                                                                rating: P?.rating === 2 ? '' : 2
                                                            })); setSidebarView(false)
                                                        }}>
                                                            <div className='d-flex align-items-center mb-3' >
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                            </div>
                                                            <input type="checkbox" onChange={() => { }} checked={filter.rating === 2} />
                                                            <span className="checkmark me-2"></span>
                                                        </div>

                                                        <div className="checkbox-container w-100" onClick={() => {
                                                            setFilter((P) => ({
                                                                ...P,
                                                                rating: P?.rating === 1 ? '' : 1
                                                            })); setSidebarView(false)
                                                        }} >
                                                            <div className='d-flex align-items-center mb-3' >
                                                                <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                                <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 start-icon" />
                                                            </div>
                                                            <input type="checkbox" onChange={() => { }} checked={filter.rating === 1} />
                                                            <span className="checkmark me-2"></span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Collapse>
                                        </div>

                                        <hr></hr>
                                        {/* companies */}
                                        <div className="collection-collapse-block open px-3 px-xl-4">
                                            <h3 className={isOpen ? 'collapse-block-title2' : "collapse-block-title"} onClick={toggleBrand}>
                                                Company
                                            </h3>
                                            <Collapse isOpen={isOpen}>
                                                <div className="collection-collapse-block-content">
                                                    <div className="collection-star-filter">
                                                        {
                                                            companies.map((data, i) => (
                                                                <div className="checkbox-container w-100" key={i} onClick={() => {
                                                                    setFilter((p) => ({
                                                                        ...p,
                                                                        com: p.com === data.id ? '' : data.id
                                                                    }))
                                                                    setSidebarView(false)
                                                                }} >
                                                                    <div className='d-flex align-items-center justify-content-between mb-3' >
                                                                        <p className="mb-0 text-dark text-truncate">{data?.name ?? ''}</p>
                                                                        {/* <p className="mb-0 text-dark">40</p> */}    
                                                                    </div>
                                                                    <input type="checkbox" checked={filter.com == data.id} onChange={() => { }} />
                                                                    <span className="checkmark me-2"></span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </Collapse>
                                        </div>
                                        <hr></hr>

                                        {/* Domain */}
                                        <div className="collection-collapse-block open px-3 px-xl-4">
                                            <h3 className={isOpen2 ? 'collapse-block-title2' : "collapse-block-title"} onClick={toggleBrand2}>Domain</h3>
                                            <Collapse isOpen={isOpen2}>
                                                <div className="collection-collapse-block-content">
                                                    <div className="collection-star-filter">
                                                        {
                                                            domains.map((data, i) => (
                                                                <div className="checkbox-container w-100" key={i} onClick={() => {
                                                                    setFilter((p) => ({
                                                                        ...p,
                                                                        dom: p.dom === data.id ? '' : data.id
                                                                    }))
                                                                    setSidebarView(false)
                                                                }}>
                                                                    <div className='d-flex align-items-center justify-content-between mb-3' >
                                                                        <p className="mb-0 text-dark">{data?.name ?? ''}</p>
                                                                        {/* <p className="mb-0 text-dark">40</p> */}
                                                                    </div>
                                                                    <input type="checkbox" checked={filter.dom == data.id} onChange={() => { }} />
                                                                    <span className="checkmark me-2"></span>
                                                                </div>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </Collapse>
                                        </div>
                                        <hr></hr>

                                        {/* Program */}
                                        <div className="collection-collapse-block border-0 open px-3 px-xl-4">
                                            <h3 className={isOpen3 ? 'collapse-block-title2' : "collapse-block-title"} onClick={toggleBrand3}>
                                                Programs
                                            </h3>
                                            <Collapse isOpen={isOpen3}>
                                                <div className="collection-collapse-block-content">
                                                    <div className="collection-star-filter">
                                                        {
                                                            programs.map((data, i) => (
                                                                <div className="checkbox-container w-100" key={i} onClick={() => {
                                                                    setFilter((p) => ({
                                                                        ...p,
                                                                        pro: p.pro === data.id ? '' : data.id
                                                                    }))
                                                                    setSidebarView(false)
                                                                }}>
                                                                    <div className='d-flex align-items-center justify-content-between mb-3' id={`fdkdsdakjda${i}`} >
                                                                        <p className="mb-0 text-dark">{data?.title}</p>
                                                                        {/* <p className="mb-0 text-dark">40</p> */}
                                                                    </div>
                                                                    <input type="checkbox" checked={filter.pro == data.id} onChange={() => {
                                                                    }} />
                                                                    <span className="checkmark me-2"></span>
                                                                </div>
                                                            ))
                                                        }

                                                        {/* <label className="checkbox-container w-100">
                                                                            <div className='d-flex align-items-center justify-content-between mb-3'>
                                                                                <p className="mb-0 text-dark">Interview Coaching</p>  <p className="mb-0 text-dark">7</p>
                                                                            </div>
                                                                            <input type="checkbox" />
                                                                            <span className="checkmark me-2"></span>
                                                                        </label> */}
                                                    </div>
                                                </div>
                                            </Collapse>
                                        </div>

                                        <div className='px-3 px-xl-4 pb-4'> <button type='button' className='btn_reser' onClick={() => {
                                            setFilter({
                                                skey: "",
                                                exp: "",
                                                price: "",
                                                dom: "",
                                                com: "",
                                                pro: "",
                                                rating: "",
                                                sort: '',
                                            }); setstateValue(false);
                                            setSidebarView(false)
                                            setValues([1, 30])
                                            setValues1([1, 10000])
                                        }} >Reset Filter</button></div>
                                    </div>
                                </div>
                            </Col>

                            <Col className="collection-content ">
                                {
                                    isloading ? <div className='pageLoading'>
                                        <span
                                            className={cn(
                                                'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                                            )}
                                        >
                                            <span className={"loading"} />
                                        </span>
                                    </div> :
                                        mentorList.length > 0 ?
                                            <div className="page-main-content h-100 animate fadeInUp1 one">
                                                <div className='d-flex flex-column justify-content-between h-100'>

                                                    <div className=''>
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <h3 className="sm_tes">{mentorList.length ?? 0} Mentors Found</h3>
                                                            <div className="form-group filter_dropbfu d-flex align-items-center  mb-3">
                                                                <p className="mb-0 me-2">Sort By:</p>
                                                                <Select
                                                                    isSearchable={false}
                                                                    placeholder='High to Low'
                                                                    value={[{ label: 'High to Low', value: '1' }, { label: 'Low to High', value: '0' }].find(e => e.value == filter.sort)}
                                                                    onChange={(e) => setFilter((p) => ({ ...p, sort: e?.value }))}
                                                                    options={[{ label: 'High to Low', value: '1' }, { label: 'Low to High', value: '0' }]}
                                                                    theme={(theme) => ({
                                                                        ...theme,
                                                                        colors: {
                                                                            ...theme.colors,
                                                                            primary25: '#f4f7f7',
                                                                            primary: '#125453',
                                                                            primary50: '#f4f7f7'
                                                                        },
                                                                    })}
                                                                    classNamePrefix={'sortSelect'}
                                                                />
                                                            </div>
                                                        </div>
                                                        <Row>{currentPageItems}</Row>
                                                    </div>

                                                    {
                                                        mentorList.length > 10 ?
                                                            <div className="d-flex justify-content-center ">
                                                                <div className="pagination" >
                                                                    <Button className="btn_lecy" disabled={activePage === 1} onClick={goToFirstPage}>
                                                                        <i className="fa fa-arrow-left" aria-hidden="true"></i>
                                                                    </Button>
                                                                    {paginationNumbers}
                                                                    <Button className="btn_lecy" disabled={activePage === totalPages} onClick={goToLastPage}>
                                                                        <i className="fa fa-arrow-right"></i>
                                                                    </Button>
                                                                </div>
                                                            </div> : ''
                                                    }

                                                </div>
                                            </div>
                                            :
                                            <div className="text-center d-flex   justify-content-center  ">
                                                <img src='/assets/nodata.png' className='w-50' />
                                            </div>
                                }

                                <div
                                    className="filter-main-btn"
                                    onClick={() => openSidebar()}
                                >
                                    <span className="filter-btn btn btn-theme">
                                        <i className="fa fa-filter" aria-hidden="true"></i>{" "}
                                    </span>
                                </div>

                            </Col>
                        </Row>
                    </Container>
                </div>
            </section>
        </>
    )
}

export default Mentor;