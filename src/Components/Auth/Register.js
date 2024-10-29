import React, { useRef, useState } from "react";
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import PropTypes from "prop-types";
import PhoneInput from "react-phone-input-2";
import ProfileSet from "./ProfileSetup";
import ProfileSet2 from "./ProfileSetup2";
import { OTPVeryfy, SendOtp } from "./core/Auth_request";
import toast from "react-hot-toast";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import Meta from "../../services/Meta";
import { genarteOtp, VerifyCationApi } from "../dashboard/requests";



const Register = ({ direction, ...args }) => {

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const router = useNavigate();

  const [activeIndex, setActiveIndex] = useState(0);
  const [activeIndex2, setActiveIndex2] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [otpValues2, setOtpValues2] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowpassword] = useState(false);
  const [steps, setSteps] = useState(1);
  const [setup1, setsetup1] = useState({});
  const [Otpsend, sended] = useState(false);
  const [Otpsend2, sended2] = useState(false);
  const [verified, setVerified] = useState(false);
  const [verified2, setVerified2] = useState(false);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];  

  const inputRefs2 = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];  
      const handleGenerateOtp = () => {
        var formData = new FormData();
        const phone = formik.getFieldProps('phone_number').value; 
        if(phone.length < 10) {
          return toast.error("Enter Valid Number!")
        }
        formData.append('phone', phone)
        genarteOtp(formData).then(res => {
            if (res.status == 200) {
                toast.success("OTP SENDED!")
                sended2(true); 
            } else {
                toast.error(res?.message);
            }
        }).catch((err) => {
            console.log("err", err.message);
            toast.error(err?.message);
        })
    } 

    const handleVerifyCation = () => { 
      if (!otpValues2.includes('')) {         
        const phone = formik.getFieldProps('phone_number').value; 
        const otp = otpValues2.join('');
        VerifyCationApi(phone, otp).then(res => {
            if (res.status == 200) {
               setVerified(true)
                toast.success("Verified Mobile Number!");
                setOtpValues2(["", "", "", "", "", ""]);
            } else {
                toast.error(res?.message)
            }
        }).catch((err) => {
            console.log("err", err.message);
        })
      }else {
        toast.error("Enter Valid OTP!")
      }
    }


    const handleFocus = (index) => {
      setActiveIndex(index);
    };

    const handleFocus2 = (index) => {
      setActiveIndex2(index);
    };

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

  const handleChange2 = (index, e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");

    if (value.length === 1 && index < inputRefs2.length - 1) {
      inputRefs2[index + 1].current.focus();
    }
    if (value.length === 0 && index > 0) {
      inputRefs2[index - 1].current.focus();
    }

    const newOtpValues = [...otpValues2];
    newOtpValues[index] = value;
    setOtpValues2(newOtpValues);
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

  const handleBackspace2 = (index, e) => {
    if (e.key === "Backspace" && index >= 0) {
      if (otpValues2[index] === "") {
        inputRefs[index - 1]?.current.focus();
      } else {
        const newOtpValues = [...otpValues2];
        newOtpValues[index] = "";
        setOtpValues2(newOtpValues);
      }
    }
  };

  let initialValues = {
    full_name: "",
    email_address: "",
    password: "",
    phone_number: "",
  };

  const VerifycationSchema = Yup.object().shape({
    full_name: Yup.string().required("Enter Your Name"),
    email_address: Yup.string() 
    .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter Valid Email Address')
    .required("Enter Your Email Address"),
    password: Yup.string()
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/," Password must have one upper case, lower case, special character and number (length 8-12)")
    .required("Create Your Password"),
    phone_number: Yup.string().required("Enter Your Phone Number"),
  }); 


  const verifyMail = () => {
    if (!otpValues.includes('')) {
      const mail = formik.getFieldProps('email_address').value; 
      var formdata = new FormData()
      formdata.append('email', mail); 
      formdata.append('otp', otpValues.join('')); 
      OTPVeryfy(formdata).then(res => {
        if (res.status == 200) {
          setVerified2(true)
        } else {
          toast.error(res?.message ?? "Enter Valid OTP!")
        }
      })
    } else {
      toast.error('Enter Valid OTP!')
    }
  }

  const formik = useFormik({
    initialValues,
    validationSchema: VerifycationSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      try {
        // console.log(values, otpValues); 
        if(!verified) {
          return toast.error("Please Verify Mobile Number!")
        }
        if(!verified2) {
          return toast.error("Please Verify Mail Address!")
        }
        setsetup1((p) => ({
          ...p,
          "name": values.full_name,
          "email": values.email_address,
          "password": values.password,
          "phone": values.phone_number
        })) 
        setSteps(2)
      } catch (error) {
        console.log("err", error.message);
      }
    },
  });

  const sendeOtp = () => {
    if (formik.getFieldProps("email_address").value) {
      var formData = new FormData()
      formData.append("email", formik.getFieldProps("email_address").value)
      SendOtp(formData).then(res => {
        sended(true)
        toast.success("OTP SENDED!")
      })
    } else {
      toast.error("Enter Your Email Address!")
    }
  }


  return (<> 
   <Meta title={'Register'}  />
    {
      steps == 1 ?
        <div>
          <div className="d-lg-none d-block bg_bojsryf">
            <Container>
              <img src={`/assets/images/homepg/logo.png`} alt="logo" className="" />{" "}
            </Container>
          </div>

          <section className="login-page section-b-space overflow-x-hidden">
            <Row className="justify-content-center  h-100">
              <Col
                lg="6"
                md="10"
                xs="11"
                className={
                  steps === 1
                    ? "d-lg-flex align-items-center justify-content-center px-3"
                    : "d-none"
                }
              >
                <div className="col-xxl-7 col-xl-8 ms-xxl-5 ps-xl-5 py-4">
                  {/* <div className=""> */}
                  <h3 className="text-sm-start text-center">
                    Create a New Account
                  </h3>
                  <h5 className="text-sm-start text-center mb-4">
                    Already have an account?{" "}
                    <Link to={`/login`} className="theme_color">
                      {" "}
                      Sign In
                    </Link>
                  </h5>
                  <div className="d-flex align-items-center w-100 mb-3">
                    <div className="Row d-flex align-items-center w-100 me-3">
                      <div className="col-2 p-0 color_orange"></div>
                      <div className="col-6 p-0 color_grey"></div>
                      <div className="col-4 p-0 color_grey"></div>
                    </div>
                    <p className="mb-0 w-100px">Step 1 of 3</p>
                  </div>

                  <Form className="theme-form mb-4" onSubmit={formik.handleSubmit}>
                    <div className="form-group mb-3">
                      <Label className="form-label" for="name">
                        Full Name
                      </Label>
                      <div className={`input-container mb-1`}>
                        <Input
                          type="text"
                          className="form-control"
                          id="name"
                          {...formik.getFieldProps("full_name")}
                          placeholder="Enter Full Name"
                          required=""
                        />
                        <img
                          src={`/assets/images/homepg/Login-Register-flow/__Name.png`}
                          alt=""
                          className=""
                        />
                      </div>
                      {formik.touched.full_name && formik.errors.full_name && (
                        <div className="fv-plugins-message-container ">
                          <div className="fv-help-block">
                            <span role="alert" className="text-danger ">
                              {formik.errors.full_name}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-group mb-3">
                      <Label className="form-label" htmlFor="p_number">
                        Phone Number
                      </Label>
                          <div className={`input-container mb-1`}>
                            <PhoneInput
                              country={"in"}
                              countryCodeEditable={false} 
                              inputProps={{
                                id: "p_number",
                              }}
                              disabled={verified}
                              // {...formik.getFieldProps('phone_number')}
                              placeholder="9176-5432-1023"
                              onChange={(phone) =>  {  
                                console.log('phonephone',phone.substring(2)) 
                                const phoneNum = phone.substring(2); 
                                formik.setFieldValue("phone_number", phoneNum)
                              }}
                              className="mb-1"
                            /> 

                             {
                              !Otpsend2 ? 
                              <div className="verfyOtp cursor_pointer" onClick={() => handleGenerateOtp()}>
                                GET OTP
                              </div> : !verified ?
                              <div className="verfyOtp cursor_pointer" onClick={() => handleVerifyCation()} >
                                VERIFY
                              </div> :
                                <img
                                  src={`/assets/images/homepg/Login-Register-flow/__Verify.png`}
                                  alt=""  
                                  className=""
                                /> 
                             }
                          </div>

                        {
                        formik.errors.phone_number && (
                          <div className="fv-plugins-message-container ">
                            <div className="fv-help-block">
                              <span role="alert" className="text-danger ">
                                {formik.errors.phone_number}
                              </span>
                            </div>
                          </div>
                        )} 

                        {
                          Otpsend2 && !verified ? 
                          <div className="d-flex justify-content-start flex-column"> 
                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <Label className=" mb-2" for="otps">
                                Enter OTP
                              </Label>
                              <Link href="#" className="theme_color fw-bold" onClick={() => handleGenerateOtp()}>
                                {" "}
                                {
                                "Resend OTP"
                                }
                              </Link>
                            </div>

                            <div className="otp-container ">
                              {inputRefs2.map((inputRef, index) => (
                                <input
                                  key={index}
                                  ref={inputRef}
                                  type="text"
                                  id={`otps${index}`}
                                  maxLength="1"
                                  className={`otp-input ${activeIndex2 === index || otpValues2[index] !== ""
                                    ? "active"
                                    : ""
                                    }`}
                                  value={otpValues2[index]}
                                  onFocus={() => handleFocus2(index)}
                                  onChange={(e) => handleChange2(index, e)}
                                  onKeyDown={(e) => handleBackspace2(index, e)}
                                />
                              ))}
                            </div>
                          </div> : ''
                        }
                    
                    </div>

                    <div className="form-group mb-3">
                      <Label className="form-label" for="password">
                        Create Password
                      </Label>
                      <div className="input-container mb-1">
                        <Input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          id="password"
                          {...formik.getFieldProps("password")}
                          placeholder="Enter Your Password"
                          required=""
                        />
                        <img
                          src={
                            showPassword
                              ? `/assets/images/homepg/Login-Register-flow/Crosseye.png`
                              : `/assets/images/homepg/Login-Register-flow/__eye.png`
                          }
                          alt="password"
                          className=""
                          onClick={() => setShowpassword(!showPassword)}
                        />
                      </div>
                      {formik.touched.password && formik.errors.password && (
                        <div className="fv-plugins-message-container ">
                          <div className="fv-help-block">
                            <span role="alert" className="text-danger ">
                              {formik.errors.password}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className=" mb-4">
                    <div className="form-group mb-3 ">
                      <Label className="form-label" for="email1">
                        Email Address
                      </Label>
                      <div className="input-container mb-1">
                        <Input
                          type="email"
                          className="form-control"
                          id="email1"
                          {...formik.getFieldProps("email_address")}
                          placeholder="Email Address"
                          required=""
                        />  
                         
                         {
                           !Otpsend ? 
                          <div className="verfyOtp cursor_pointer" onClick={() => sendeOtp()}>
                            GET OTP
                          </div> : !verified2 ?
                          <div className="verfyOtp cursor_pointer" onClick={() => verifyMail()} >
                            VERIFY
                          </div> :
                            <img
                              src={`/assets/images/homepg/Login-Register-flow/__Verify.png`}
                              alt=""  
                              className=""
                            /> 
                          }
                        {/* <img
                          src={`/assets/images/homepg/Login-Register-flow/__email.png`}
                          alt=""
                          className=""
                        /> */}
                      </div>

                      {formik.touched.email_address &&
                        formik.errors.email_address && (
                          <div className="fv-plugins-message-container ">
                            <div className="fv-help-block">
                              <span role="alert" className="text-danger ">
                                {formik.errors.email_address}
                              </span>
                            </div>
                          </div>
                        )}
                    </div> 
                    {
                       Otpsend && !verified2 ?
                        <div className="d-flex flex-column justify-content-start">
                          <div className="d-flex align-items-center justify-content-between mt-3">
                            <Label className=" mb-2" for="otps">
                              Enter OTP
                            </Label>

                            <Link href="#" className="theme_color fw-bold" onClick={() => sendeOtp()}>
                              {" "}
                              {
                              "Resend OTP" 
                              }
                            </Link>
                          </div>
                          <div className="otp-container">
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
                        </div> : ''
                    }
                    </div>


                    <button
                      type="submit"
                      // disabled={otpValues.some((e) => e == "")}
                      className="btn btn-solid"
                    >
                     Next
                    </button>
                    {/* <button type='button' onClick={()=> setSteps(2)} className="btn btn-solid">Verify & Next</button> */}
                  </Form>

                  <div className="position-relative">
                    <hr></hr>
                    <div className="bsf">
                      <span>Or</span>
                    </div>
                  </div>

                  {/* <div
                    role="button"
                    className="d-flex align-items-center justify-content-center cursor_pointer login_google mt-4"
                  >
                    <img
                      src={`/assets/images/homepg/Login-Register-flow/__Google.png`}
                      alt="google"
                      className="me-3"
                    />
                    <p className="mb-0">Log in with Google</p>
                  </div> */}

                  <div className='mt-4 d-flex align-items-center justify-content-center cursor_pointer'>
                    <GoogleOAuthProvider clientId={process.env.REACT_APP_GG_APP_ID}>
                      <GoogleLogin
                        onSuccess={credentialResponse => {
                          console.log(credentialResponse);
                        }}
                        onError={() => {
                          console.log('Login Failed');
                        }}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </Col>

              <Col lg="6" className="login_img d-lg-flex d-none align-items-center justify-content-center h-auto">
                <div className="col-xl-8 me-xxl-5 pe-xl-5">
                  <Link to="/">  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Link>
                  <h6 className="py-md-5 py-4">Chat With Experts, Access Resources, Ignite Your Potential</h6>
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
        </div> : steps == 2 ?
          <ProfileSet setsetup1={setsetup1} setSteps={setSteps} /> :
          <ProfileSet2 formData={setup1} />
    }
  </>
  );
};

export default Register;