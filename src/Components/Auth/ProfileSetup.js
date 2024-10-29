import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from "yup"
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { getGoals, getIntrest, getSituation } from './core/Auth_request';
import Meta from '../../services/Meta';

const ProfileSet = ({ setSteps, setsetup1, direction, ...args }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const toggle2 = () => setDropdownOpen2((prevState) => !prevState);

  const [activeIndex, setActiveIndex] = useState(0);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const fullList = ['Javascript', 'Machine Learning', 'Web Development', 'Product Managers', 'Product Design', 'Web Design', 'Entrepreneurship', 'UX Research']
  const [interestList, setInterestList] = useState([])
  const [domailList, setdomainList] = useState([])
  const [selectedList, setSelectedList] = useState([])
  const [dropSituation, setDropSituation] = useState([])
  const [dropGoals, setDropGoals] = useState([])

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null)
  ];

  const handleSearch = (key) => {
    key === '' ? setInterestList(domailList) : setInterestList(domailList?.filter(d => d.name.toLowerCase().includes(key.toLowerCase())))
  }

  const [isloading, setloading] = useState(true)

  let initialValues = {
    current_situation: '',
    career_goal: '',
    topics_interest: ''
  }

  const fetchSutuation = async () => {
    setloading(true);
    getSituation().then(res => {
      setDropSituation(res.data)

      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }


  const fetchGoals = async () => {
    setloading(true);
    getGoals().then(res => {
      setDropGoals(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  const fetchInterest = async () => {
    setloading(true);
    getIntrest().then(res => {
      setdomainList(res.data)
      setInterestList(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  useEffect(() => {
    fetchSutuation()
    fetchInterest()
    fetchGoals()
  }, [])


  const validationSchema = Yup.object().shape({
    current_situation: Yup.number(),
    // .required('Select Your Current situation'),
    career_goal: Yup.string(),
    // .required('Select Your Carrer Goal'),
    topics_interest: Yup.string()
    // .required('Select Of Any Topics Of Interest')
  })


  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values, { resetForm, setStatus, setSubmitting }) => {
      try {
        let body = {
          'situation': values.current_situation,
          "goals": values.career_goal,
          "intrest": selectedList.map(e => e.id)
        }
        setsetup1((p) => ({
          ...p,
          'situation': values.current_situation,
          "goals": values.career_goal,
          "intrest": selectedList.map(e => e.id)
        }))
        setSteps(3)
      } catch (error) {
        console.log('err', error.message)
      }
    }
  })


  return (
    <div> 
       <Meta title={'Profile Setup'}  />
      <div className="d-lg-none d-block bg_bojsryf">
        <Container>
          <img src={`/assets/images/homepg/logo.png`} alt="" className="" />
        </Container>
      </div>
      <section className="login-page section-b-space  ">
        <Row className="justify-content-center h-100">
          <Col lg="6" md="10" xs="11" className="d-lg-flex align-items-center justify-content-center px-3 py-4">
            <div className="col-xxl-7 col-lg-8 ms-xxl-5 ps-xl-5">
              {/* <div className=""> */}
              <h3 className="text-sm-start text-center">Profile Setup</h3>
              <h5 className="text-sm-start text-center mb-4">Already have an account?  <Link href={`/login`} className="theme_color"> Sign In</Link></h5>
              <div className='d-flex align-items-center w-100 mb-3'>
                <div className='Row d-flex align-items-center w-100 me-3'>
                  <div className='col-4 p-0 color_orange' ></div>
                  <div className='col-4 p-0 color_grey' ></div>
                  <div className='col-4 p-0 color_grey' ></div>
                </div>
                <p className='mb-0 w-100px'>Step 2 of 3</p>
              </div>

              <Form onSubmit={formik.handleSubmit} className="theme-form mb-5 ">
                <div className="form-group custome_dripo mb-3">
                  <Label className="form-label" htmlFor="Current_situation">
                    Current situation
                  </Label>
                  <div className="custome_dripo">
                    <Select
                      isSearchable={false}
                      placeholder='In college, preparing for placements'
                      classNamePrefix="select"
                      inputId='Current_situation'
                      options={dropSituation}
                      getOptionLabel={(e) => e?.name}
                      getOptionValue={(e) => e?.id}
                      onChange={(v) => formik.setFieldValue("current_situation", v?.id)}
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
                    {formik.touched.current_situation && formik.errors.current_situation && (
                      <div className='fv-plugins-message-container ' >
                        <div className='fv-help-block'>
                          <span role='alert' className='text-danger '>{formik.errors.current_situation}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group custome_dripo mb-3">
                  <Label className="form-label" htmlFor="Career_Goal"> Career Goal </Label>
                  <div className="custome_dripo">

                    <Select
                      isSearchable={false}
                      placeholder='Select any one'
                      classNamePrefix="select"
                      inputId='Career_Goal'
                      options={dropGoals}
                      getOptionLabel={(e) => e?.name}
                      getOptionValue={(e) => e?.id}
                      onChange={(v) => formik.setFieldValue("career_goal", v?.id)}
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
                    {formik.touched.career_goal && formik.errors.career_goal && (
                      <div className='fv-plugins-message-container ' >
                        <div className='fv-help-block'>
                          <span role='alert' className='text-danger '>{formik.errors.career_goal}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group custome_dripo mb-3">
                  <Label className="form-label" for="search_inter">Topics of Interest</Label>
                  <div className="multi_dropdown ">
                    <div className="form-group has-search mb-3 px-md-3">
                      <span className="fa fa-search form-control-feedback"></span>
                      <input type="search" onChange={(e) => handleSearch(e.target.value)} className="form-control" id='search_inter' placeholder="Search" />
                    </div>
                    <div className='custome_dropdown custom_sel'>

                      <Row className='px-md-3'>
                        {interestList?.length > 0 ?
                          interestList?.map((data, index) => (
                            <Col xs="6" className='mb-3' key={index}>
                              <div role='button' className={`custome-selcte ${selectedList.find(e => e == data) ? 'avtive-sect' : ''}`}
                                onClick={() => setSelectedList(selectedList.find(e => e == data) ? selectedList?.filter(e => e != data) : [...selectedList, data])}
                              >
                                <h5 className='me-2 '>{data?.name}</h5>
                                {
                                  selectedList.find(e => e == data) &&
                                  <img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />
                                }
                              </div>
                            </Col>
                          )) : <Col xs="12" className='mb-3 text-center' >
                            <span> No Data Found</span>
                          </Col>
                        }
                      </Row>
                    </div>
                  </div>

                  <div className='d-flex flex-wrap mt-3'>
                    {formik.touched.topics_interest && formik.errors.topics_interest && (
                      <div className='fv-plugins-message-container ' >
                        <div className='fv-help-block'>
                          <span role='alert' className='text-danger '>{formik.errors.topics_interest}</span>
                        </div>
                      </div>
                    )}
                    {
                      selectedList.map((data, index) => (
                        <div className='d-flex align-items-center customet-sg mb-3' key={index}><h5 className='mb-0 me-3'>{data?.name}</h5>
                          <img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} role='button' alt="" className="img-rd" onClick={() => setSelectedList(selectedList.filter(e => e != data))} /> </div>
                      ))
                    }
                  </div>
                </div>
                {/* <Link to={'/profile-setup-2'}> */}
                <button type='submit' className='btn btn-solid'>Next</button>
                {/* </Link> */}
              </Form>
            </div>
          </Col>

          <Col lg="6" className="login_img d-lg-flex d-none align-items-center justify-content-center h-auto">
            <div className="col-xl-8 me-xxl-5 pe-xl-5">
              <Link to="/">  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Link>
              <h6 className="py-md-5 py-4">Unlimited Insights, Unlimited Growth: Your Mentor, Your Way.</h6>
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

export default ProfileSet;
