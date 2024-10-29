import React, { useState, useRef } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { Link, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { forgetSendOtp, forgetverifyOtp } from './core/Auth_request';
import Meta from '../../services/Meta';

const ForgetPwd = () => {

  const router = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verify, setVerify] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);

  const inputRefs = [
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ];

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




  const handleFocus = (index) => {
    setActiveIndex(index);
  }; 

  const formik = useFormik({
    initialValues: { 'email': '' },
    validationSchema: Yup.object().shape({ email: Yup.string().required("Enter Your Email Address").matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter a valid email') }),
    onSubmit: async (values, { setStatus, setSubmitting, resetForm, setErrors }) => {
      try {
        setLoading(true)
        var formData = new FormData();
        if (verify) {
          formData.append('email', values.email)
          formData.append('otp', otpValues.join(''))
          const response = await forgetverifyOtp(formData);
          setLoading(false)
          if (response.status == 200) {
            toast.success(response.message ?? "Success")
            response?.user_id && router('/Password', { state: { id: response?.user_id } })
          } else {
            toast.error(response.message ?? "Enter Valid OTP!")
          }
        } else {
          formData.append('email', values.email)
          const response = await forgetSendOtp(formData);
          setLoading(false)
          if (response.status == 200) {
            toast.success(response?.message);
            router(-1)
            // setVerify(true);
          } else {
            toast.error(response?.message)
          }
        }
      } catch (error) {
        console.error(error);
        setStatus('The registration details is incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  })


  const handleResend = async () => {
    setLoading(true)
    var formData = new FormData();
    formData.append('email', formik.getFieldProps('email')?.value)
    const response = await forgetSendOtp(formData);
    setLoading(false)
    if (response.status == 200) {
      toast.success(response?.message);
      // setVerify(true);
    } else {
      toast.error(response?.message)
    }
  }


  return (
    <div> 
       <Meta title={'Forget Password'}  />
      <div className="d-lg-none d-block bg_bojsryf">
        <Container>  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Container>
      </div>

      <section className="login-page section-b-space">
        <Row className="justify-content-center">
          {
            verify ?
              <Col lg="6" md="10" xs="11" className="d-lg-flex align-items-center justify-content-center px-4">
                <div className="col-xxl-7 col-xl-8 ms-xxl-5 ps-xl-5 d-none">
                  <h3 className="text-sm-start text-center">Check your email</h3>
                  <h5 className="text-sm-start text-center">Don't Receive Email? <span role='button' onClick={() => formik.handleSubmit()} className="theme_color">Resend</span></h5>


                  <div className='cutyesiur col-xl-10  mt-4'>
                    <img src={`/assets/images/homepg/Login-Register-flow/__Verify.png`} alt="" className="mb-3" />
                    <p>If an account exists for your email, you'll receive an email with instructions on resetting your password. If it doesn't arrive, please check your spam folder and make sure your email address is spelled correctly</p>
                  </div>

                  <div className="d-flex align-items-center mt-4 mt-xl-5">
                    <Link className="d-flex align-items-center" to={`/login`}>
                      <i className="fa fa-angle-left me-2 theme_color  fw-14" aria-hidden="true"></i>
                      <h6 className="mb-0 theme_color fw-bold">Back to login</h6></Link>
                  </div>

                </div>

                <div className="col-xxl-7 col-xl-8 ms-xxl-5 ps-xl-5">
                  <h3 className="text-sm-start text-center">Verify OTP!</h3>
                  <form onSubmit={formik.handleSubmit}>
                    <div className='text-center'>
                      <div className="d-flex align-items-center justify-content-between mt-3">
                        <Label className=" mb-2" for="otps">
                        </Label>
                        <Link href="#" className="theme_color fw-bold" onClick={() => handleResend()}>
                          Resend OTP
                        </Link>
                      </div>
                    </div>

                    <div className="otp-container mb-4 d-flex justify-content-center mt-2">
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

                    {loading ? (
                      <button type="button" className="btn btn-solid mt-3">
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                        ></span>
                        <span role="status">Loading...</span>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-solid mt-3">
                        <span>Verify & Next</span>
                      </button>
                    )}
                  </form>

                  <div className="d-flex align-items-center mt-4 mt-xl-5">
                    <Link className="d-flex align-items-center" to={`/login`}>
                      <i className="fa fa-angle-left me-2 theme_color  fw-14" aria-hidden="true"></i>
                      <h6 className="mb-0 theme_color fw-bold">Back to login</h6></Link>
                  </div>
                </div>
              </Col> :
              <Col lg="6" md="10" xs="11" className="d-lg-flex align-items-center justify-content-center px-4">
                <div className="col-xxl-7 col-xl-8 ms-xxl-5 ps-xl-5">
                  <h3 className="text-sm-start text-center">Forgot Password?</h3>
                  <h5 className="text-sm-start text-center">Enter your email address and we'll send you a link to Reset your password.</h5>
                  <Form onSubmit={formik.handleSubmit} className="theme-form mb-5 mt-4">
                    <div className="form-group mb-3">
                      <Label className="form-label" for="email">
                        Email Address
                      </Label>
                      <div className="input-container mb-1">
                        <Input type="text" className="form-control" {...formik.getFieldProps('email')} id="email" placeholder="Enter Your Email Address" required="" />
                        <img src={`/assets/images/homepg/Login-Register-flow/__email.png`} alt="" className="" />
                      </div>
                      {formik.touched.email && formik.errors.email && (
                        <div className='fv-plugins-message-container'>
                          <div className='fv-help-block'>
                            <span role='alert' className='text-danger'>{formik.errors.email}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* <Link to={`/Password`}> <a className="btn btn-solid mt-3">Send reset link</a> </Link> */}
                    {loading ? (
                      <button type="button" className="btn btn-solid mt-3">
                        <span
                          className="spinner-border spinner-border-sm"
                          aria-hidden="true"
                        ></span>
                        <span role="status">Loading...</span>
                      </button>
                    ) : (
                      <button type="submit" className="btn btn-solid mt-3">
                        <span>Send reset link</span>
                      </button>
                    )}
                  </Form>

                  <div className="d-flex align-items-center mt-4 mt-xl-5">
                    <Link to={`/login`} className='d-flex align-items-center'>
                      <i className="fa fa-angle-left me-2 theme_color fw-14" aria-hidden="true"></i>
                      <h6 className="mb-0 theme_color fw-bold">Back to login</h6></Link>
                  </div>
                </div>

              </Col>
          } 
          <Col lg="6" className="login_img d-lg-flex d-none align-items-center justify-content-center">
            {/* <img src={`/assets/images/homepg/Login-Register-flow/login-bg.png`} alt="" className="login_img" /> */}
            <div className="col-xl-8 me-xxl-5 pe-xl-5">
              <Link to="/"><img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Link>
              <h6 className="py-md-5 py-4">Have 1-On-1 Conversations With Experts Anywhere, Anytime.</h6>
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
  )
}

export default ForgetPwd;