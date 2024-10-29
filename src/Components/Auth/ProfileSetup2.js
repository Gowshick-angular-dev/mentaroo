import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Form, Label, Input, Col, button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { Link } from 'react-router-dom';
import { getCompanies } from '../pages/core/_request';
import { MenteeRegister } from './core/Auth_request';
import { useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import Meta from '../../services/Meta';

const ProfileSet2 = ({ formData, direction, ...args }) => {
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  const fullList = ['Vriksha Techno Solutions Pvt Ltd', 'Google', 'Amazon', 'Accenture', 'Deloitee', 'Web Design', 'Meta', 'American Express']
  const [interestList, setInterestList] = useState([])
  const [CompaniesList, setCompaniesList] = useState([])
  const [selectedList, setSelectedList] = useState([])
  const [terms, setTerms] = useState(false)
  const router = useNavigate()

  const handleSearch = (key) => {
    key === '' ? setInterestList(CompaniesList) : setInterestList(CompaniesList?.filter(d => d?.name.toLowerCase().includes(key.toLowerCase())))
  }

  const [isloading, setloading] = useState(true)

  const fetchCompanies = async () => {
    setloading(true);
    getCompanies().then(res => {
      setInterestList(res.data);
      setCompaniesList(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  const [isLoading, setLoading] = useState(false);


  const handleRegister = () => {
    try {
      setLoading(true)
      var formDatas = new FormData()
      formDatas.append('first_name', formData?.name)
      formDatas.append('last_name', '')
      formDatas.append('email', formData?.email)
      formDatas.append('password', formData?.password)
      formDatas.append('phone', formData?.phone)
      formDatas.append('current_situation', formData?.situation)
      formDatas.append('career_goal', formData?.goals)
      if (formData?.intrest?.length > 0) {
        // for(var i; i < formData?.intrest.length ; i++){
        //     formDatas.append(`topic_of_interest[${i}]`,formData?.intrest[i])
        // }
        formData?.intrest.map((d, i) => {
          formDatas.append(`topic_of_interest[${i}]`, d)
        })
      }

      selectedList.map((d, i) => {
        formDatas.append(`dream_companies[${i}]`, d?.id)
      })

      MenteeRegister(formDatas).then(res => {
        setLoading(false)
        if (res.status == 200) {
          toast.success(res.message ?? "success")
          router('/login')
        } else {
          toast.error(res.message)
        }
      })
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])


  return (
    <div> 
       <Meta title={'Profile Setup'}  />
      <div className="d-lg-none d-block bg_bojsryf">
        <Container>  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Container>
      </div>

      <section className="login-page section-b-space">
        <Row className="justify-content-center">
          <Col lg="6" md="10" xs="11" className="d-lg-flex align-items-center justify-content-center px-3 py-4">
            <div className="col-xxl-7 col-lg-8 ms-xxl-5 ps-xl-5">
              <h3 className="text-sm-start text-center">Profile Setup</h3>
              <h5 className="text-sm-start text-center mb-4">Already have an account?  <Link to={`/login`} className="theme_color">Sign In</Link></h5>
              <div className='d-flex align-items-center w-100 mb-3'>
                <div className='Row d-flex align-items-center w-100 me-3'>
                  <div className='col-4 p-0 color_orange' ></div>
                  <div className='col-4 p-0 color_orange' ></div>
                  <div className='col-4 p-0 color_orange' ></div>
                </div>
                <p className='mb-0 w-100px'>Step 3 of 3</p>
              </div>

              <Form className="theme-form mb-5 ">
                <div className="form-group custome_dripo mb-3">
                  <Label className="form-label" for="search_companies">
                    Dream companies
                  </Label>
                  <div className="multi_dropdown ">
                    <div className="form-group has-search mb-3 px-md-3">
                      <span className="fa fa-search form-control-feedback"></span>
                      <input type="search" className="form-control text_dbfvuid" id='search_companies' placeholder="I Would Like To Work For...." onChange={(e) => handleSearch(e.target.value)} />
                    </div>
                    <div className='custome_dropdown'>
                      <Row className='px-md-3 d-none'>
                        <Col xs="6 " className='mb-3'>
                          <div className='custome-selcte avtive-sect'>
                            <h5 className='me-2'>Vriksha Techno Solutions Pvt Ltd</h5><img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>Google</h5>
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>Amazon</h5>
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>Accenture</h5>
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>Deloitee</h5>
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>Web Design</h5>
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>Meta</h5>
                          </div>
                        </Col>
                        <Col xs="6" className='mb-3'>
                          <div className='custome-selcte'>
                            <h5>American Express</h5>
                          </div>
                        </Col>
                      </Row>

                      <Row className='px-md-3 '>
                        {interestList?.length > 0 ?
                          interestList?.map((data, index) => (
                            <Col xs="6" className='mb-3' key={index}>
                              <div role='button' className={`custome-selcte ${selectedList.find(e => e == data) ? 'avtive-sect' : ''}`}
                                onClick={() => setSelectedList(selectedList.find(e => e == data) ? selectedList?.filter(e => e != data) : [...selectedList, data])}
                              >
                                <h5 className='me-2'>{data?.name}</h5>
                                {
                                  selectedList.find(e => e == data) &&
                                  <img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />
                                }
                              </div>
                            </Col>
                          ))
                          :
                          <Col xs="12" className='text-center mb-3' >
                            <span>No Data Found</span>
                          </Col>
                        }
                      </Row>

                    </div>
                  </div>
                  <div className='d-flex flex-wrap mt-3'>
                    {/* <div className='d-flex customet-sg align-items-center mb-3'><h5 className='mb-0 me-3'>Vriksha Techno Solutions Pvt Ltd </h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} alt="" className="img-rd" /> </div> */}
                    {
                      selectedList?.map((data, index) => (
                        <div className='d-flex customet-sg align-items-center mb-3' key={index}><h5 className='mb-0 me-3'>{data?.name}</h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} role='button' alt="" className="img-rd" onClick={() => setSelectedList(selectedList.filter(e => e != data))} /> </div>
                      ))
                    }
                  </div>
                </div>
                <label className="checkbox-container my-4 ">I agree with <Link to={`/termsService`} className='theme_color fw-bold' >Terms and conditions</Link>
                  <input type="checkbox" value={terms} onChange={(e) => setTerms(e.target.checked)} />
                  <span className="checkmark"></span>
                </label>
                {/* <a onClick={toggle} className="btn btn-solid"> Submit</a> */}
                {
                  !terms ?
                    <button type='button' className="btn btn-secondary w-100 p-3 rounded-3 "> Submit</button> : isLoading ? (
                      <button type="button" className="btn btn-solid w-100 p-3">
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                        ></span>
                        <span role="status">Loading...</span>
                      </button>
                    ) :
                      <button type='button' onClick={() => handleRegister()} className="btn btn-solid w-100 p-3 "> Submit</button>
                }

                <Modal className='cutome_popup' isOpen={modal} toggle={toggle} centered={true} {...args}>
                  <ModalBody className='p-4 '>
                    <div className='px-4'>
                      <h1 className='text-center mt-lg-5 mt-3'>Thank You!</h1>
                      <div className='d-flex justify-content-center mb-3'>
                        <img src={`/assets/images/homepg/Login-Register-flow/__Created check.png`} alt="" className="" />
                      </div>
                      <h2 className='mb-3 text-center'>Hello Dharma,</h2>
                      <p className='text-center'>You're now part of our growing tribe of 11000+ members receiving exclusive career advice, trends and insights from industry leaders.</p>
                      <div className='d-flex justify-content-center'>
                        <Link href={`/dashboard`}>
                          <button className='btn-popup mb-lg-4 mb-3 mt-3'>Get Started</button>
                        </Link>
                      </div>
                    </div>
                  </ModalBody>
                </Modal>
              </Form>
            </div>
          </Col>

          <Col lg="6" className="login_img d-lg-flex d-none align-items-center justify-content-center ">
            <div className="col-xl-8 me-xxl-5 pe-xl-5">
              <Link to="/">  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Link>
              <h6 className="py-md-5 py-4">Your Mentorship Hub: Discover, Connect, Thrive.</h6>
              <div className="row custome_hjagef">
                <div className="col-4 w190824">
                  <div className="d-flex me-3 position-relative">
                    <div className="img_login_auth">  <img src={`/assets/images/homepg/testimonial/1.jpg`} alt="" className="" /> </div>
                    <div className="img_login_auth_1">  <img src={`/assets/images/homepg/testimonial/2.jpg`} alt="" className="" /> </div>
                    <div className="img_login_auth_2">  <img src={`/assets/images/homepg/testimonial/3.jpg`} alt="" className="" /> </div>
                    <div className="img_login_auth_3">  <img src={`/assets/images/homepg/testimonial/4.jpg`} alt="" className="" /> </div>

                  </div>
                </div>
                <div className="col d-flex align-items-center">
                  <p className="mb-0">Browse over 10K+ mentors</p></div>
              </div>
            </div>
          </Col>
        </Row>
      </section>
    </div>
  );
};
export default ProfileSet2;
