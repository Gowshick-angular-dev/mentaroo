import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import Select from 'react-select';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getCouponList, getMentorDetails, getMentorPac, getMentorPacDetails, getPrograms, postBooking, redirctPayment } from '../core/_request';
import { getCity, getCountry, getState } from '../../Auth/core/Auth_request';
import { useAuth } from '../../Auth/core/Auth';
import toast from "react-hot-toast";
import cn from 'classnames';
import SlotBooking from '../../dashboard/mentee/Bookings';
import Meta from '../../../services/Meta';


const BookingSlotPage = ({ direction, ...args }) => {
  const router = useNavigate();

  const { state } = useLocation();

  const handleGoBack = () => {
    router(-1);
  };

  const [isloading, setloading] = useState(false)
  const [PageLoading, setPageLoading] = useState(false)
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
  const [CouponList, setCouponList] = useState([]);
  const [Coupon, setCoupon] = useState('')
  const [validCoupon, setValidCoupon] = useState({
    price: plans?.price,
    valid: false,
    discount: '0'
  });


  useEffect(() => {
    // console.log('ggggggg',Array(parseFloat(plans?.sessions ?? 0)).fill({}));
    if(plans?.sessions != null) {
      setSlotData(Array(parseInt(plans?.sessions)).fill({}));
    }
  }, [plans])


  const handleCoupon = () => {
    if (!Coupon) {
      return toast.error("Please Enter Coupon")
    } 

    if(parseFloat(validCoupon.price) <= 0) {
      return null
    } 
    
    const codeData = CouponList.find(e => e.code === Coupon)
    if (codeData && CouponList.some(e => e.code === Coupon)) {
      const discountedPrice = validCoupon.price - (validCoupon.price * (codeData.discount_percentage / 100)); 
      setValidCoupon((p) => ({ discount: codeData.discount_percentage, price: discountedPrice, valid: true }));
    } else {
      toast.error("Enter Valid Code")
    }

  }

  const [getSlotData, setSlotData] = useState([])


  const fetchmentorDetails = (id) => {
    setPageLoading(true)
    getMentorDetails(id).then(res => {
      setmentors(res?.data ?? '');
      // setPacjage(res?.data?.packages);
      setPageLoading(false)
    }).catch(err =>
      setPageLoading(false)
      // console.log(err)
    )
  }


  const fetchCouponList = () => {
    getCouponList().then(res => {
      setCouponList(res?.data);
    }).catch(err => {
      console.log("err", err?.message);
    })
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
      fetchmentorAginstPac(id);
      fetchCouponList();
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
      setPackage(data);
      setPlans(data[0]);
      // setSlotData()
      setValidCoupon((p) => ({ ...p, price: data[0]?.price }));
    }).catch(err => {

    })
  }

  const handleCopyClipBoard = (value, i) => {
    navigator.clipboard.writeText(`${value}`).then(() => {
      document.getElementById(`copyClipboard${i}`)?.classList.remove('d-none')
      document.getElementById(`copyClipboard${i}`)?.classList.add('d-block')

      setTimeout(() => {
        document.getElementById(`copyClipboard${i}`)?.classList.remove('d-block')
        document.getElementById(`copyClipboard${i}`)?.classList.add('d-none')
      }, 1500)
    }).catch(err => console.log("err", err.message))
  }



  const { auth } = useAuth()

  function openPay(url) {
    // const win = window.open(url);
    // if (win != null) {
    //   win.focus();
    // }
    // const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    // if (newWindow) newWindow.opener = null
    if(url != null) {
      window.location.href = url;
    }
  }


  const [openSlots, setOpenSlots] = useState(false);



  const handleCheckout = async () => {
    try {
      let isValid = true;
      if (!address) {
        toast.error("Enter Billing Address")
        return isValid = false;
      }
      if (isValid) {
        const couponData = CouponList.find(e => e.code === Coupon) ?? '';
        setloading(true)
        var formData = new FormData();
        formData.append('title', Sprograms?.title ?? '')
        formData.append('category_id', 0 ?? '')
        formData.append('sub_category_id', 0 ?? '')
        formData.append('price_type', "hourly" ?? '')
        formData.append('price', validCoupon?.price ?? '')
        formData.append('class_type', 1 ?? '')
        formData.append('tutor_id', state?.id ?? '')
        formData.append('meeting_link', '' ?? '')
        formData.append('program_id', selectedProId ?? '')
        formData.append('package_id', plans?.package_id ?? '')
        formData.append('user_id', auth?.user_id ?? '')
        formData.append('country', Scountry ?? '')
        formData.append('state', SState ?? '')
        formData.append('address', address ?? '')
        // formData.append('payment_type', 'COD')
        formData.append('coupon', JSON.stringify(couponData ?? {}) ?? '')
        // formData.append('mentor_slot_id', getSlotData.id)
        // formData.append('start_time', getSlotData.startTime)
        // formData.append('end_time', getSlotData.endTime)
        // formData.append('valid_till', '') 
        getSlotData.map((v, i) => {
          formData.append(`mentor_slot_id[${i}]`, v?.id ?? '')
          formData.append(`day[${i}]`, v?.day ?? '')
          formData.append(`date[${i}]`, v?.date ?? "")
          formData.append(`start_time[${i}]`, v?.start_time ?? '')
          formData.append(`end_time[${i}]`, v?.end_time ?? '')
          formData.append(`valid_till[${i}]`, '')
        })

        const response = await postBooking(formData)
         setloading(false)
          if (response.status == 200 && response?.data) {
            toast.success('success'); 
            const payRedirect = `${process.env.REACT_APP_BASE_URL}/Payment_gateway/phonePe/${parseFloat(validCoupon?.price)}/${response?.data}`;
            if(!parseFloat(validCoupon.price) <= 0) {
              openPay(payRedirect)
            }
            // window.open(payRedirect,'_blank')
            // router(-1);
          } else {
            toast.error(response.message)
          }
      }
    } catch (error) {
      setloading(false)
    }
  }



  return (
    <>
    <Meta title={'Booking'}  />
      <button type='button' className='d-none' id='ClickToPostSavebooking' onClick={() => handleCheckout()} />
      {openSlots ?
        <SlotBooking setOpenSlots={setOpenSlots} isloading={isloading} getSlotData={getSlotData} setSlotData={setSlotData} Sprograms={Sprograms} plans={plans} mentors={mentors} handleCheckout={handleCheckout} />
        :
        <div className='text-start'>
          <div className='inner_header'>
            <Container className='d-flex justify-content-between align-items-center py-2'>
              <img onClick={handleGoBack} src={`/assets/images/homepg/left-white.png`} alt="" className="img-fluid arrow-back" />
              <div className="brand-logo ">
                <Link to="/"><img src={`/assets/images/homepg/logo.png`} alt="" className=" logo_booking" /></Link>
              </div>
              <div >
              </div>
            </Container>
          </div>

          {
            PageLoading ?
              <div className='pageLoading'>
                <span
                  className={cn(
                    'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                  )}
                >
                  <span className={"loading"} />
                </span>
              </div> :
              <Row className='h-100vh'>
                <Col xl="6" className='d-xl-flex justify-content-end'>
                  <div className='col-xxl-9 col-xl-10  py-4'>
                    <div className='left_side_booking pe-xxl-4 px-3'>
                      <h2 className='mb-xl-4 mb-3'>Checkout</h2>
                      <h5 className='mb-3'>Choose Plan</h5>
                      <Row className='mb-4'>
                        {
                          packages.slice(0,3).map((plan, i) => (
                            <Col sm="6" xl="6" md="4" className='mb-3' key={i} onClick={() => { setPlans(plan); document.getElementById(`htmlClicked${i}`)?.click(); setValidCoupon((p) => ({ discount: "0", price: plan?.price, valid: false })); }}>
                              <div className='bg_sect_box position-relative'>
                                <h5 className='text-dark fw-bold mb-1'>{plan?.package_name} Plan</h5>
                                <p className='mb-1'>{plan?.sessions ?? 0} session </p>
                                <p className='mb-0 text-dark fw-bold'>₹{parseFloat(plan?.price ?? 0)}</p>
                                <input className='radio_btn' type="radio" id={`htmlClicked${i}`} name="fav_language" checked={plan === plans} value="HTML"></input>
                              </div>
                            </Col>
                          ))
                        }

                        {/* <Col sm="6" xl="6" md="4" className='mb-3'>
                  <div className='bg_sect_box position-relative'>
                    <h5 className='text-dark fw-bold mb-1'>Regular Plan</h5>
                    <p className='mb-1'>2 sessions (50 mins each)</p>
                    <p className='mb-0 text-dark fw-bold'>₹1,500</p>
                    <input className='radio_btn' type="radio" id="html" name="fav_language" value="HTML"></input>
                  </div></Col>
                <Col sm="6" xl="6" md="4" className='mb-3'>
                  <div className='bg_sect_box position-relative'>
                    <h5 className='text-dark fw-bold mb-1'>Pro Plan</h5>
                    <p className='mb-1'>4 sessions (60 mins each)</p>
                    <p className='mb-0 text-dark fw-bold'>₹2000</p>
                    <input className='radio_btn' type="radio" id="html" name="fav_language" value="HTML"></input>
                  </div></Col> */}
                      </Row>

                      {/* 
                  <h5 className='mb-3'>Choose Program</h5>
                      <div className="form-group custome_dripo mb-4">
                        <div className="custome_dripo">
                          <Select
                            isSearchable={false}
                            placeholder='Select'
                            classNamePrefix="select"
                            inputId=''
                            options={programs}
                            value={programs.find(e=> e?.program_id == selectedProId)}
                            getOptionLabel={(e) => e?.program_name}
                            getOptionValue={(e) => e?.program_id}
                            // onChange={(v)=> formik.setFieldValue("current_situation",v?.id)}
                            onChange={(e)=> setSelectedProId(e?.program_id)}
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
                      </div>   */}

                      <h5 className='mb-3'>Billing Address</h5>
                      <Row className='mb-3'>
                        <Col sm="6">
                          <div className="form-group custome_dripo mb-3">
                            <Label className="form-label" htmlFor="review">
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
                          </div></Col>

                        <Col sm="6">
                          <div className="form-group custome_dripo mb-3">
                            <Label className="form-label" htmlFor="review">
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

                      <div className='d-flex justify-content-between d-none'>
                        <h5>Payment Method</h5>
                        <p>Secured connection</p>
                      </div>

                      {/* <iframe src="http://192.168.1.56/mentaroo/Payment_gateway/phonePe/1/1" width={500} height={700} title="description"></iframe> */}

                      <div className='bx_select d-none'>
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
                            <Label className="form-label" htmlFor='SLOh7868'>
                              Name on card
                            </Label>
                            <div className="input-container">
                              <Input type="text" className="form-control" id="SLOh7868" placeholder="" required="" />
                            </div>

                          </div>

                          <div className="form-group">
                            <Label className="form-label" htmlFor='SLOh7868467'>
                              Card number
                            </Label>
                            <div className="input-container">
                              <Input type="text" className="form-control" id="SLOh7868467" placeholder="" required="" />

                            </div>

                          </div>

                          <div className='row px-2'>
                            <div className='col-lg-6 px-1'>
                              <div className="form-group">
                                <Label className="form-label" htmlFor='SLOh7868473'>
                                  Expiration date
                                </Label>
                                <div className="input-container">
                                  <Input type="text" className="form-control" id="SLOh7868473" placeholder="" required="" />

                                </div>

                              </div>
                            </div>
                            <div className='col-lg-6 px-1'>
                              <div className="form-group">
                                <Label className="form-label" htmlFor='SLOh786gfg8'>
                                  Security Code
                                </Label>
                                <div className="input-container">
                                  <Input type="text" className="form-control" id="SLOh786gfg8" placeholder="" required="" />

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
                    </div>
                  </div>
                </Col>

                <Col xl="6" className='bg_bookinb'>
                  <div className='col-xxl-7 col-xl-9  ps-xxl-5 ps-3'>
                    <div className='bg_boogisg_card mt-4 mb-3'>
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
                          <h5 className='left'>Plan</h5>
                          <h5>{plans?.package_name ? plans?.package_name + " Plan" : '-'}</h5>
                        </div>

                        <div className='d-flex justify-content-between align-items-center'>
                          <h5 className='left'>Program</h5>
                          <h5>{Sprograms?.title ?? '-'}</h5>
                        </div>

                        <div className='d-flex justify-content-between align-items-center'>
                          <h5 className='left'>Fee</h5>
                          <h5>₹{parseFloat(plans?.price ?? 0) ?? "0"}</h5>
                        </div>

                        <div className='d-flex justify-content-between align-items-center'>
                          <h5 className='left'>No of sessions</h5>
                          <h5>{plans?.sessions ?? '-'}</h5>
                        </div>

                        <div className='d-flex justify-content-between align-items-center'>
                          <h5 className='left'>Duration</h5>
                          <h5>{Sprograms?.class_time ?? '-'}</h5>
                        </div>

                        <div className='d-flex justify-content-between align-items-center'>
                          <h5 className='left'>Valid until</h5>
                          <h5>{Sprograms?.course_validity + " Days" ?? '-'}</h5>
                        </div>

                        {
                          validCoupon.valid ?
                            <div className='d-flex justify-content-between align-items-center'>
                              <h5 className='left'>Discount</h5>
                              <h5>{validCoupon.discount ?? "0"}%</h5>
                            </div> : ''
                        }

                      </div>

                      <hr></hr>

                      <div className='d-flex justify-content-between align-items-center pt-1'>
                        <h5 className='fw-bold'>Total</h5>
                        <h5 className='fw-bold'>₹{parseFloat(validCoupon?.price ?? 0) ?? "0"}</h5>
                      </div>
                    </div>

                    <div className='bg_boogisg_card mb-4'>
                      <h3>Apply Coupon code</h3>
                      <div className='apply-code mb-3'>
                        <input placeholder='Enter Code' disabled={validCoupon.valid || parseFloat(validCoupon.price) <= 0} value={Coupon} onChange={(e) => setCoupon(e.target.value)} type='text' ></input>
                        <button type='button' disabled={parseFloat(validCoupon.price) <= 0} onClick={() => validCoupon.valid ? null : handleCoupon()}>
                          {
                            validCoupon.valid ?
                              <span>
                                <i class="fa fa-check me-1" aria-hidden="true"></i>
                                Applied
                              </span> :
                              "Apply"
                          }
                        </button>
                      </div>

                      <h3 className='mb-3'>Available coupons</h3>

                      {
                        CouponList.length > 0 ?
                          CouponList.map((data, index) => (
                            <div className='available_cupon mb-4' key={index}>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <div className='d-flex align-items-center'>
                                  <div className='img_logo me-3'>
                                    <img src={`/assets/images/favicon.png`} alt="" />
                                  </div>
                                  <div className='bg_boodjksfh text-truncate'>
                                    {data?.code ?? ''}
                                  </div>
                                </div>

                                <div className='position-relative'>
                                  <div title='copy' onClick={() => handleCopyClipBoard(data?.code, index)} className='custome_copy cursor_pointer d-flex align-items-center'>
                                    <img src={`/assets/images/copy_theme.png`} alt="" className="me-2" />
                                    <p className='mb-0'>Copy</p>
                                  </div>
                                  <div id={`copyClipboard${index}`} className="d-none bg-secondary user-select-none text-light px-3 py-1 rounded-3 position-absolute top-100 start-50">copied!</div>
                                  {/* <span className="position-absolute start-100 fw-normal top-50 px-2 p-1 badge text-bg-secondary">Copied</span> */}
                                </div>
                              </div>
                              <p className='mb-0 two_line'>{`Apply code ${data?.code ?? ''} to get ${data?.discount_percentage ?? '0'}% off for your first Session.`}</p>
                            </div>
                          ))
                          : (<p>No Coupons Available</p>)
                      }

                      {/* <div className='available_cupon mb-4'>
                              <div className='d-flex justify-content-between align-items-center mb-3'>
                                <div className='d-flex align-items-center'>
                                  <div className='img_logo me-3'>
                                    <img src={`/assets/images/favicon.png`} alt="" />
                                  </div>
                                  <div className='bg_boodjksfh'>
                                    7gfg5v2
                                  </div>
                                </div>

                                <div className='custome_copy d-flex align-items-center'>
                                  <img src={`/assets/images/copy_theme.png`} alt="" className="me-2" />
                                  <p className='mb-0'>Copy</p>
                                </div>

                              </div>
                              <p className='mb-0'>Apply code 7gfg5v2 to get 10% off for your first Session.</p>
                            </div> */}

                      <h5 className='mt-4'>By clicking "Go to checkout", you agree to our <Link to={`/termsService`}> <span className='theme_color fw-bold'>Terms of Service </span></Link>
                        and <Link to={`/refundPolicy`}> <span className='fw-bold theme_color'>Cancellation Policy</span></Link></h5>
                      {/* <Link to={`/bookingConfirm`}> */}
                      <button type='button' onClick={() => { !isloading && handleCheckout() }} className='btn_book mt-3' >
                        {/* <button type='button' onClick={() => {
                          if (!address) {
                            toast.error("Enter Billing Address")
                          }else {
                            !isloading && setOpenSlots(true);
                          }
                          }} className='btn_book mt-3' > */}
                        {
                          isloading ? <>
                            <span
                              className="spinner-border spinner-border-sm"
                              aria-hidden="true"
                            ></span>
                            <span role="status">Loading...</span>
                          </> : 'Submit'
                        }
                      </button>
                      {/* </Link> */}
                    </div>
                  </div>
                </Col>
              </Row>
          }
        </div>}
    </>
  )
}

export default BookingSlotPage;