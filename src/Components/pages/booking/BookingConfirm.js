import React, { useRef, useState, useEffect } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { Link } from 'react-router-dom';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Auth/core/Auth';
import { getMentorDetails, getMentorPac, getMentorPacDetails, postBooking } from '../core/_request';
import { getCity, getCountry, getState } from '../../Auth/core/Auth_request';
import toast from "react-hot-toast";
import Select from 'react-select';
import Meta from '../../../services/Meta';
import { AdminDetails } from '../../footer/request';



const BookingConfirm = ({ direction, ...args }) => {
    const router = useNavigate();
    const { state } = useLocation();


    const handleGoBack = () => {
        router(-1);
    };

    const [isloading, setloading] = useState(false)
    const [packages, setPackage] = useState([])
    const [mentors, setmentors] = useState({})
    const [country, setCountry] = useState([]);
    const [State, setState] = useState([]);
    const [city, setCity] = useState([]);
    const [Scountry, setSCountry] = useState([]);
    const [SState, setSState] = useState([]);
    const [Scity, setSCity] = useState([]);
    const [plans, setPlans] = useState([]);
    const [address, setAddress] = useState();
    const [programs, setPrograms] = useState([]);
    const [Sprograms, setSPrograms] = useState();
    const [selectedProId, setSelectedProId] = useState(state?.proId)
    const [admin, setAdmin] = useState([]);

    const fetchAdmin = async (id) => {
        AdminDetails().then(res => {
            setAdmin(res);
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        fetchAdmin();
    }, [])


    const fetchmentorDetails = (id) => {
        // setloading(true)
        getMentorDetails(id).then(res => {
            setmentors(res?.data ?? '');
            // setPacjage(res?.data?.packages);
            // setloading(false)
        }).catch(err =>
            // setloading(false) 
            console.log(err)
        )
    }

    const fetchmentorAginstPac = (id) => {
        getMentorPac(id).then(res => {
            setPrograms(res?.data);
        }).catch(err => {

        })
    }

    const fetchCountry = async () => {
        getCountry().then(res => {
            setCountry(res.data)
        }).catch(e => {
            console.log(e)
        })
    }

    const fetchState = async (id) => {
        getState(id).then(res => {
            setState(res.data)
        }).catch(e => {
            console.log(e)
        })
    }

    const fetchCity = async (id) => {
        getCity(id).then(res => {
            setCity(res.data)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        var id = state?.id;
        if (id) {
            fetchmentorDetails(id);
            // fetchmentorAginstPac(id);
            // fetchPaclageList(proId);
            fetchCountry();
        } else {
            router('/mentor')
        }
    }, [])


    useEffect(() => {
        fetchPaclageList(selectedProId);
    }, [selectedProId])


    const fetchPaclageList = (id) => {
        getMentorPacDetails(id, state?.id).then(res => {
            setSPrograms(res?.data ?? '')
            const data = res?.data?.packages ?? []
            setPackage(data?.filter(e => e?.package_id == 4 ));
            setPlans(data?.find(e => e?.package_id == 4));
        }).catch(err => {
            console.log('err',err.message);
        })
    }

    const { auth } = useAuth() 

    function openPay(url) {
        // const win = window.open(url);
        // if (win != null) {
        //   win.focus();
        // }
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
      }

    const handleCheckout = async () => {

        try {
            let isValid = true;

            if (!address) {
                toast.error("Enter Billing Address")
                return isValid = false;
            }

            if (isValid) {
                setloading(true)
                var formData = new FormData();
                formData.append('title', Sprograms?.title)
                formData.append('category_id', 0)
                formData.append('sub_category_id', 0)
                formData.append('price_type', "hourly")
                formData.append('price', admin?.trial)
                formData.append('class_type', 1)
                formData.append('tutor_id', state?.id)
                formData.append('meeting_link', '')
                formData.append('program_id', selectedProId)
                // formData.append('package_id', plans?.package_id)
                formData.append('package_id', 7)
                formData.append('user_id', auth?.user_id)
                formData.append('country', Scountry)
                formData.append('state', SState)
                formData.append('address', address);    
                formData.append('coupon', '');
                formData.append(`mentor_slot_id[0]`,  '')
                formData.append(`day[0]`,  '')
                formData.append(`date[0]`,  "")
                formData.append(`start_time[0]`,  '')
                formData.append(`end_time[0]`,  '')
                formData.append(`valid_till[0]`, '')
                // formData.append('payment_type', 'COD')
                const response = await postBooking(formData)
                setloading(false)
                if (response.status == 200 && response?.data ) {
                     toast.success('success');
                     const payRedirect = `${process.env.REACT_APP_BASE_URL}/Payment_gateway/phonePe/${parseFloat(admin?.trial)}/${response?.data}`;
                     if(!parseFloat(admin?.trial) <= 0) {
                       openPay(payRedirect)
                     }
                     router(-1);
                } else {
                    toast.error(response.message)
                }
            }
        } catch (error) {
            setloading(false)
        }
    }


    return (<>
       <Meta title={'Booking'}  />

        <div className='text-start'> 
            <div className='inner_header'>
                <Container className='d-xl-flex d-none justify-content-between align-items-center py-2'>
                    <img onClick={handleGoBack} src={`/assets/images/homepg/left-white.png`} alt="" className="img-fluid arrow-back" />
                    <div className="brand-logo ">
                        <Link to="/"><img src={`/assets/images/homepg/logo.png`} alt="" className=" logo_booking" /></Link>
                    </div>
                    <div ></div>
                </Container>
                <Container className='d-flex d-xl-none justify-content-between align-items-center py-2'>
                    <div className="brand-logo ">
                        <Link to="/"><img src={`/assets/images/homepg/logo.png`} alt="" className=" logo_booking" /></Link>
                    </div>
                    <img src="/assets/images/__Menu.png" alt="" className="menu_icon m-0" />
                </Container>
            </div>

            <Row className='h-100vh'>
                <Col md="6" sm='5' className='d-xl-flex justify-content-end'>
                    <div className='col-xxl-9 col-xl-10  py-4'>
                        <div className='left_side_booking pe-xxl-4 px-3'>
                            <h2 className='mb-xl-4 mb-3'>Confirm your trial booking!</h2>
                            {/* <h5 className='mb-3'>Choose Plan</h5> */}
                            <Row>
                                {/* <div className='mb-3 col-sm-6 col-md-4 col-xl-6'>
                                    <div className='bg_sect_box mb-xl-4 position-relative'>
                                        <h5 className='text-dark fw-bold mb-1'>Introductory Call</h5>
                                        <p className='mb-1'>1 session (15 mins)</p>
                                        <p className='mb-0 text-dark fw-bold'>₹99</p>
                                        <input className='radio_btn' type="radio" id="html" name="fav_language" value="HTML"></input>
                                    </div>
                                </div> */}
                                {
                                    packages.map((plan, i) => (
                                        <Col sm="6" xl="6" md="4" className='mb-3 d-none' key={i} onClick={() => { setPlans(plan); document.getElementById(`htmlClicked${i}`)?.click() }}>
                                            <div className='bg_sect_box position-relative'>
                                                <h5 className='text-dark fw-bold mb-1'>{plan?.package_name} Plan</h5>
                                                <p className='mb-1'>{plan?.sessions ?? 0} session </p>
                                                <p className='mb-0 text-dark fw-bold'>₹{parseInt(plan?.price ?? 0)}</p>
                                                <input className='radio_btn' type="radio" id={`htmlClicked${i}`} name="fav_language" checked={plan === plans} value="HTML"></input>
                                            </div>
                                        </Col>
                                    ))
                                }
                            </Row>

                            <h5 className='mb-3'>Billing Address</h5>
                            <Row className='mb-3'>

                                <Col md='6'>
                                    <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" for="review">
                                            Country
                                        </Label>
                                        <div className="custome_dripo">
                                            <Select
                                                isSearchable={false}
                                                placeholder='Country'
                                                classNamePrefix="select"
                                                inputId=''
                                                options={country}
                                                getOptionLabel={(e) => e?.name}
                                                getOptionValue={(e) => e?.id}
                                                onChange={e => { setSCountry(e?.id); fetchState(e?.id) }}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: '#f4f7f7',
                                                        primary: '#125453',
                                                        primary50: '#f4f7f7'
                                                    },
                                                })}
                                            />
                                        </div>
                                    </div>
                                </Col>

                                <Col md='6'>
                                    <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" for="review">
                                            State / Union Territory
                                        </Label>
                                        <div className="custome_dripo">
                                            <Select
                                                isSearchable={false}
                                                placeholder='State'
                                                classNamePrefix="select"
                                                inputId='state'
                                                options={State}
                                                getOptionLabel={(e) => e?.state_name}
                                                getOptionValue={(e) => e?.id}
                                                onChange={(e) => { setSState(e?.id); fetchCity(e?.id) }}
                                                theme={(theme) => ({
                                                    ...theme,
                                                    colors: {
                                                        ...theme.colors,
                                                        primary25: '#f4f7f7',
                                                        primary: '#125453',
                                                        primary50: '#f4f7f7'
                                                    },
                                                })}
                                            />
                                        </div>

                                    </div>
                                </Col>

                                    <Col sm="12">
                                        <div className="form-group mb-3">
                                            <Label className="form-label" htmlFor="add">
                                            Address
                                            </Label>
                                            <div className={`input-container mb-1`}>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                onChange={(e) => setAddress(e.target.value)}
                                                id="add"
                                                placeholder="Enter Billing Address"
                                                required=""
                                            />
                                            </div>
                                        </div>
                                    </Col>

                            </Row>

                            <div className='bg_boogisg_card my-4 d-none'>
                                <div className='d-flex align-items-center py-3'>
                                    <img src={`/assets/images/mentor1.png`} alt="" className="img_author_booking me-3" />
                                    <div className=''>
                                        <h3>Vignesh Anbazhagan </h3>
                                        <h5 className='theme_color'>Design Lead - Senior Consultant</h5>
                                    </div>
                                </div>

                                <hr></hr>

                                <div className='py-3'>

                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h5 className='left'>Program</h5>
                                        <h5>Introductory Call</h5>
                                    </div>

                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h5 className='left'>No of sessions</h5>
                                        <h5>1</h5>
                                    </div>

                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h5 className='left'>Duration</h5>
                                        <h5>15 Mins</h5>
                                    </div>

                                    <div className='d-flex justify-content-between align-items-center'>
                                        <h5 className='left'>Valid until</h5>
                                        <h5>22/12/2023</h5>
                                    </div>

                                </div>

                                <hr></hr>
                                <div className='d-flex justify-content-between align-items-center py-3'>
                                    <h5 className='fw-bold'>Total</h5>
                                    <h5 className='fw-bold'>₹99</h5>
                                </div>

                                <h5 >By clicking "Go to checkout", you agree to our <Link to={`/termsService`}> <span className='theme_color fw-bold'>Terms of Service </span></Link> and <Link to={`/privacyPolicy`}> <span className='fw-bold theme_color'>Cancellation Policy</span></Link></h5>

                            </div>

                            <div className='d-none justify-content-between '>
                                <h5>Payment Method</h5>
                                <p>Secured connection</p>
                            </div>

                            <div className='d-none bx_select'>
                                <div className='d-flex align-items-center justify-content-between box_section_head'>
                                    <div className='d-flex align-items-center'>
                                        <div className='me-2' >
                                            <input type="radio" id="html" name="fav_language" value="HTML"></input>
                                        </div>
                                        <p className='mb-0'>New Payment Card</p>
                                    </div>

                                    <div className='d-flex align-items-center'>
                                        <img src={`/assets/images/homepg/__visa.png`} alt="" className="me-2" />
                                        <img src={`/assets/images/homepg/__Discover.png`} alt="" className="me-2" />
                                        <img src={`/assets/images/homepg/__Master.png`} alt="" className="me-2" />
                                        <img src={`/assets/images/homepg/__visa.png`} alt="" className="me-2" />
                                    </div>

                                </div>

                                <div className='p-3'>
                                    <div className="form-group">
                                        <Label className="form-label" for="email">
                                            Name on card
                                        </Label>
                                        <div className="input-container">
                                            <Input type="text" className="form-control" id="email" placeholder="" required="" />

                                        </div>

                                    </div>

                                    <div className="form-group">
                                        <Label className="form-label" htmlFor='cVBook133'>
                                            Card number
                                        </Label>
                                        <div className="input-container">
                                            <Input type="text" className="form-control" id="cVBook133" placeholder="" required="" />

                                        </div>

                                    </div>

                                    <div className='row px-2'>
                                        <div className='col-lg-6 px-1'>
                                            <div className="form-group">
                                                <Label className="form-label" htmlFor='cVBook678'>
                                                    Expiration date
                                                </Label>
                                                <div className="input-container">
                                                    <Input type="text" className="form-control" id="cVBook678" placeholder="" required="" />

                                                </div>

                                            </div>
                                        </div>
                                        <div className='col-lg-6 px-1'>
                                            <div className="form-group">
                                                <Label className="form-label" htmlFor='cVBook235'>
                                                    Security Code
                                                </Label>
                                                <div className="input-container">
                                                    <Input type="text" className="form-control" id="cVBook235" placeholder="" required="" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <label className="checkbox-container mb-0">Save card as per new RBI guidelines for future payments.
                                        <input type="checkbox" />
                                        <span className="checkmark"></span>
                                    </label>

                                </div>
                            </div>
                            <a href={`/booking-page`}><button className='btn_book mt-3 d-none ' >
                                Go to checkout
                            </button></a>
                        </div>
                    </div>
                </Col>
                
                <Col md="6" sm='7' className='bg_bookinb'>
                    <div className='col-xxl-7 col-xl-9  ps-xxl-5 ps-3'>
                        <div className='bg_boogisg_card my-4'>

                            <div className='d-flex align-items-center py-3'>
                                <img src={mentors?.users?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="img_author_booking me-3" />
                                <div className=''>
                                    <h3>{mentors?.users?.first_name} </h3>
                                    <p className='theme_color fw-bold'>{mentors?.mentor_job_name}</p>
                                </div>
                            </div>

                            <hr></hr>

                            <div className='py-3'>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>Program</h5>
                                    <h5>{Sprograms?.title ?? '-'}</h5>
                                </div> 

                               {/* 
                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>No of sessions</h5>
                                    <h5>{plans?.sessions ?? '-'}</h5>
                                </div>

                                <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>Duration</h5>
                                    <h5>{Sprograms?.class_time ?? '-'}</h5>
                                </div> */}

                                {/* <div className='d-flex justify-content-between align-items-center'>
                                    <h5 className='left'>Valid until</h5>
                                    <h5>{Sprograms?.course_validity + " Days" ?? '-'}</h5>
                                </div> */}

                            </div>

                            <hr></hr>

                            <div className='d-flex justify-content-between align-items-center py-3'>
                                <h5 className='fw-bold'>Total</h5>
                                {/* <h5 className='fw-bold'>₹{parseInt(plans?.price ?? 0) ?? "0"}</h5> */}
                                <h5 className='fw-bold'>₹{admin?.trial ?? "0"}</h5>
                            </div>

                            <h5>By clicking "Go to checkout", you agree to our <Link to={`/termsService`}> <span className='theme_color fw-bold'>Terms of Service </span></Link> and <Link to={`/refundPolicy`}> <span className='fw-bold theme_color'>Cancellation Policy</span></Link></h5>

                            {/* <a href={`/booking-page`} > */}
                            <button type='button' onClick={() => { !isloading && handleCheckout() }} className='btn_book mt-3' >
                                {
                                    isloading ? <>
                                        <span
                                        className="spinner-border spinner-border-sm"
                                        aria-hidden="true"
                                        ></span>
                                        <span role="status">Loading...</span>
                                    </> : 'Go to checkout'
                                    }
                            </button>
                            {/* </a> */}
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    </>

    )
}

export default BookingConfirm;