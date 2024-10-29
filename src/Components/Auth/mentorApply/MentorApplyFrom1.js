import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Form, Label, Input, Col, Button } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import PhoneInput from 'react-phone-input-2'
import Select from 'react-select';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { getCity, getCountry, getState, getTimeZone } from '../core/Auth_request';
import MentorApplyFrom2 from './MentorApplyFrom2';
import MentorApplyFrom3 from './MentorApplyFrom3';
import Meta from '../../../services/Meta';


const MentorApplyFrom1 = ({ direction, ...args }) => {

  const [profilePre, SetprofilePre] = useState()
  const [image, Setimage] = useState()

  const handleprofileimg = (img) => {
    Setimage(img)
    SetprofilePre(URL.createObjectURL(img))
  }


  const router = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const toggle1 = () => setDropdownOpen1((prevState) => !prevState);
  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const toggle2 = () => setDropdownOpen2((prevState) => !prevState);
  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const toggle3 = () => setDropdownOpen3((prevState) => !prevState);

  const [country, setCountry] = useState([]);
  const [State, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [zone, setZone] = useState([]);
  const [Formvalue, setFormvalue] = useState({});
  const [passVis, setPassVis] = useState(false);

  const [isloading, setloading] = useState(true)
  const [step, setStep] = useState(1)

  const fetchCountry = async () => {
    setloading(true);
    getCountry().then(res => {
      setCountry(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  const fetchCity = async (id) => {
    getCity(id).then(res => {
      setCity(res.data)
    }).catch(e => {
      console.log(e)
    })
  }

  const fetchZone = async () => {
    setloading(true);
    getTimeZone().then(res => {
      setZone(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  const fetchState = async (id) => {
    setloading(true);
    getState(id).then(res => {
      setState(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }


  useEffect(() => {
    fetchCountry();
    fetchZone()
  }, [])


  let initialValues = {
    full_name: '',
    email_address: '',
    phone_number: '',
    country: '',
    state: '',
    city: '',
    website: '',
    linkedin: '',
    instagram: '',
    time_zone: '',
    password: ''
  }

  const mentorShema = Yup.object().shape({
    full_name: Yup.string().required('Enter Your Full Name'),
    email_address: Yup.string().required('Enter Your Email Addresss').matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter a valid email'),
    phone_number: Yup.string()
      .required('Enter Your Phone Number'),
    country: Yup.string(),
    password: Yup.string()
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/," Password must have one upper case, lower case, special character and number (length 8-12)")
    .required("Enter Your Password"),
    state: Yup.string(),
    city: Yup.string(),
    website: Yup.string(),
    linkedin: Yup.string().required("Enter Your LinkedIn URL"),
    instagram: Yup.string(),
    time_zone: Yup.string(),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: mentorShema,
    onSubmit: async (values, { resetForm, setStatus, setSubmitting }) => {
      try {
        setFormvalue((p) => ({
          ...p,
          values,
          "image": image
        }))
        setStep(2)
        console.log(values)
      } catch (error) {
        console.log('err', error.message)
      }
    }
  })


  return (<> 
   <Meta title={'Apply as a mentor'}  />
    {
      step == 1 ?
        <div>
          <div className='text-center applay_form-head d-flex align-items-center justify-content-center'>
            <div className=''>
              <h2 className='text-white'>Apply as a mentor</h2>
              <p className='text-white'>Follow the simple 3 Steps to complete your Profile.</p>
            </div>
          </div>
          <div className='position-setps'>
            <Container>
              <Row className='justify-content-center mb-4'>
                <Col xxl="9">
                  <div className='applay_form-body'>
                    <div className='tab_head'>
                      <Row>
                        <Col className='pe-0'>
                          <div className='d-flex align-items-center mentor-tab_head_design_yellow'>
                            <div className='me-2 inner_text'>1</div>
                            <p className='mb-0'>Profile Information</p>
                          </div>
                        </Col>
                        <Col className='px-0 '>
                          <div className='d-flex align-items-center mentor-tab_head_design justify-content-center'>
                            <div className='me-2 inner_text'>2</div>
                            <p className='mb-0'>About You</p>
                          </div>
                        </Col>
                        <Col className='ps-0'>
                          <div className='d-flex align-items-center mentor-tab_head_design'>
                            <div className='me-2 inner_text'>3</div>
                            <p className='mb-0'>Your Motivation</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                    <div className='tab_body p-4'>

                      <form onSubmit={formik.handleSubmit} className=''>
                        <Row>
                          <Col xs="12">
                            <div className="form-group ">
                              <Label className="form-label" htmlFor="uphotos">Photo</Label>
                              <div className='d-flex align-items-center mb-3'>
                                <img src={profilePre ?? "/assets/images/UserProfile.png"} alt="" onError={(e) => e.currentTarget.src = "/assets/images/UserProfile.png"} className="photo_upload_img me-3" />
                                <div role='button' className='photo_upload d-flex align-items-center' onClick={() => document.getElementById('ProfileUpload21')?.click()}>
                                  <img src={`/assets/images/Icons/9.png`} alt="" className="img-rd me-2" />
                                  <p className='mb-0'>Upload Photo</p>
                                </div>
                                <input type='file' id='ProfileUpload21' onChange={(e) => handleprofileimg(e.target.files[0])} accept="image/png, image/jpeg" className='d-none' />
                              </div>
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group mb-3">
                              <Label className="form-label" htmlFor="fnume">Full Name</Label>
                              <div className="input-container mb-1">
                                <Input type="text" className="form-control" {...formik.getFieldProps('full_name')} id="fnume" placeholder="Enter Full Name" required="" />
                                <img src={`/assets/images/homepg/Login-Register-flow/__Name.png`} alt="" className="" />
                              </div>
                              {formik.touched.full_name && formik.errors.full_name && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.full_name}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group mb-3">
                              <Label className="form-label" htmlFor="email46464"> Email Address</Label>
                              <div className="input-container mb-1">
                                <Input type="text" className="form-control" {...formik.getFieldProps('email_address')} id="email46464" placeholder="Email Address" required="" />
                                <img src={`/assets/images/homepg/Login-Register-flow/__email.png`} alt="" className="" />
                              </div>
                              {formik.touched.email_address && formik.errors.email_address && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.email_address}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <Label className="form-label" htmlFor="p_number">
                                Phone Number
                              </Label>
                              <PhoneInput
                                country={'in'}
                                countryCodeEditable={false}
                                inputProps={{
                                  id: 'p_number',
                                  name: 'phone_number'
                                }} 
                                value={formik.getFieldProps('phone_number').value}
                                className='mb-1'
                                placeholder='9176-5432-1023'
                                onChange={phone => formik.setFieldValue('phone_number', phone)}
                              />
                              {formik.touched.phone_number && formik.errors.phone_number && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.phone_number}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group custome_dripo mb-3">
                              <Label className="form-label" htmlFor="country">
                                Country
                              </Label>
                              <div className="custome_dripo">
                                <Select
                                  isSearchable={false}
                                  placeholder='Country'
                                  inputId='country'
                                  classNamePrefix="select"
                                  options={country}
                                  value={country.find(e => e?.id == formik.getFieldProps('country')?.value)}
                                  getOptionLabel={(e) => e?.name}
                                  getOptionValue={(e) => e?.id}
                                  onChange={e => { formik.setFieldValue('country', e?.id); fetchState(e?.id) }}
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
                                {formik.touched.country && formik.errors.country && (
                                  <div className='fv-plugins-message-container ' >
                                    <div className='fv-help-block'>
                                      <span role='alert' className='text-danger '>{formik.errors.country}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group custome_dripo mb-3">
                              <Label className="form-label" htmlFor="state">
                                State
                              </Label>
                              <div className="custome_dripo">
                                <Select
                                  isSearchable={false}
                                  placeholder='State'
                                  classNamePrefix="select"
                                  inputId='state'
                                  options={State} 
                                  value={State.find(e => e?.id == formik.getFieldProps('state').value)}
                                  getOptionLabel={(e) => e?.state_name}
                                  getOptionValue={(e) => e?.id}
                                  onChange={(e) => { formik.setFieldValue('state', e?.id); fetchCity(e?.id) }}
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
                                {formik.touched.state && formik.errors.state && (
                                  <div className='fv-plugins-message-container ' >
                                    <div className='fv-help-block'>
                                      <span role='alert' className='text-danger '>{formik.errors.state}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group custome_dripo mb-3">
                              <Label className="form-label" htmlFor="city">
                                City
                              </Label>
                              <div className="custome_dripo">
                                <Select
                                  isSearchable={false}
                                  placeholder='City'
                                  classNamePrefix="select"
                                  inputId='City'
                                  options={city}
                                  value={city.find(e => e?.id == formik.getFieldProps('city').value)}
                                  getOptionLabel={(e) => e?.city_name}
                                  getOptionValue={(e) => e?.id}
                                  onChange={(e) => formik.setFieldValue('city', e?.id)}
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
                                {formik.touched.city && formik.errors.city && (
                                  <div className='fv-plugins-message-container ' >
                                    <div className='fv-help-block'>
                                      <span role='alert' className='text-danger '>{formik.errors.city}</span>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group mb-3">
                              <Label className="form-label" htmlFor="website">Personal Website(optional)</Label>
                              <div className="input-container mb-1">
                                <Input type="text" className="form-control" {...formik.getFieldProps('website')} id="website" placeholder="Personal Website" required="" />
                              </div>
                              {formik.touched.website && formik.errors.website && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.website}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group mb-3">
                              <Label className="form-label" htmlFor="linkedin">Linkedin</Label>
                              <div className="input-container mb-1">
                                <Input type="text" className="form-control" {...formik.getFieldProps('linkedin')} id="linkedin" placeholder="Linkedin" required="" />
                              </div>
                              {formik.touched.linkedin && formik.errors.linkedin && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.linkedin}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group mb-3">
                              <Label className="form-label" htmlFor="instagram">Instagram (Optional)</Label>
                              <div className="input-container mb-1">
                                <Input type="text" className="form-control" {...formik.getFieldProps("instagram")} id="instagram" placeholder="Instagram" required="" />
                              </div>
                              {formik.touched.instagram && formik.errors.instagram && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.instagram}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group mb-3">
                              <Label className="form-label" htmlFor="instagram">Password</Label>
                              <div className="input-container mb-1">
                                <Input type={passVis ? 'text' : 'password'} className="form-control" {...formik.getFieldProps("password")} id="instagram" placeholder="Password" required="" />
                                <img src={!passVis ? `/assets/images/homepg/Login-Register-flow/__eye.png` : `/assets/images/homepg/Login-Register-flow/Crosseye.png`} alt="" className="" onClick={() => setPassVis((pos) => !pos)} />
                              </div>
                              {formik.touched.password && formik.errors.password && (
                                <div className='fv-plugins-message-container ' >
                                  <div className='fv-help-block'>
                                    <span role='alert' className='text-danger '>{formik.errors.password}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </Col>
                          <Col xs="12">
                            <div className="form-group custome_dripo mb-3">
                              <Label className="form-label" htmlFor="timeZone">
                                Select your time zone
                              </Label>
                              <div className="custome_dripo">
                                <Select
                                  isSearchable={false}
                                  placeholder='select'
                                  classNamePrefix="select"
                                  inputId='timeZone'
                                  options={zone}
                                  getOptionLabel={(e) => e?.name}
                                  getOptionValue={(e) => e?.id}
                                  value={zone.find(e => e.id == formik.getFieldProps('time_zone').value)}
                                  onChange={(e) => formik.setFieldValue('time_zone', e?.id)}
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
                                {formik.touched.time_zone && formik.errors.time_zone && (
                                  <div className='fv-plugins-message-container ' >
                                    <div className='fv-help-block'>
                                      <span role='alert' className='text-danger '>{formik.errors.time_zone}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Col>
                          <Col xs="12">
                            <div className='d-flex align-items-center justify-content-center'>
                            {/* <button type='button' className='btn_back border-0 me-2'>Back</button> */}
                              <button type='submit' className='border-0  btn_next'>Next</button>
                              </div>
                          </Col>
                        </Row>
                      </form>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </div>
        </div> : step == 2 ?
          <MentorApplyFrom2 setStep={setStep} setFormvalue={setFormvalue} Formvalue={Formvalue} />
          : <MentorApplyFrom3 setStep={setStep} setFormvalue={setFormvalue} Formvalue={Formvalue} />}
  </>
  );
};

export default MentorApplyFrom1;
