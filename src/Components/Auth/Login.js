import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { MetorLogin, MenteeLogin } from './core/Auth_request';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import { ToastContainer, toast } from 'react-toastify';
import toast from "react-hot-toast";
import { useAuth } from './core/Auth';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { GoogleLoginButton, LinkedInLoginButton } from 'react-social-login-buttons'
import { LoginSocialGoogle, LoginSocialLinkedin } from "reactjs-social-login"
import { AdminDetails } from '../footer/request';
import Meta from '../../services/Meta';


const Login = () => {

    const router = useNavigate();
    const [selectedOption, setSelectedOption] = useState(
        localStorage.getItem('selectedOption') ?? 'mentee'
    );

    const { saveAuth, setCurrentUser } = useAuth()
    const [remindMe, setRemindMe] = useState(false);
    const [passVis, setPassVis] = useState(false);
    const [isLoading, setLoading] = useState(false);

    const [provider, setProvider] = useState('');
    const [profile, setProfile] = useState();

    const onLoginStart = useCallback(() => {
        //   alert('login start');
    }, []);


    const [admin, setAdmin] = useState([]);

    const fetchAdmin = async (id) => {
        AdminDetails().then(res => {
            setAdmin(res?.data);
            localStorage.setItem("admin", JSON.stringify(res?.data));
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        fetchAdmin();
    }, [])

    const onLogoutSuccess = useCallback(() => {
        setProfile(null);
        setProvider('');
        alert('logout success');
    }, []);

    const onLogout = useCallback(() => { }, []);

    const remainder = JSON.parse(localStorage.getItem("remainder"));

    const initialValues = {
        email: remainder?.email ?? "",
        password: remainder?.password ?? "",
    }

    const handleOptionChange = (value) => {
        // const value = event.target.value;
        setSelectedOption(value);
        localStorage.setItem('selectedOption', value);
    };

    const taskSaveSchema = Yup.object().shape({
        email: Yup.string()
        .matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter a valid email').required('Email is required'),
        password: Yup.string()
        // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,"Password must have one upper case, lower case, special character and number (length 8-12)")
        .required('Password is required'), 
    })

    const formik = useFormik({
        initialValues,
        validationSchema: taskSaveSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm, setErrors }) => {
            setLoading(true)
            try {
                let body = {
                    "email": values.email,
                    "password": values.password
                }
                var formData = new FormData()
                formData.append("email", values.email)
                formData.append("password", values.password)
                if (selectedOption === 'mentee') {
                    const email = values.email;
                    const password = values.password;
                    MenteeLogin(email, password).then(menteeRes => {
                        // console.log(menteeRes)
                        setLoading(false)
                        if (menteeRes?.validity != 0) {
                            localStorage.setItem('token', menteeRes?.token);
                            router("/dashboard")
                            saveAuth(menteeRes);
                            setCurrentUser("mentee")
                            toast.success("Login Suucess")
                        } else {
                            setErrors({ auth: "Authentication failed!" });
                        }
                    })
                } else {
                    let formData = new FormData();
                    formData.append('email', values.email);
                    formData.append('password', values.password);
                    MetorLogin(formData).then(menteeRes => {
                        setLoading(false)
                        if (menteeRes?.validity == 1) {
                            localStorage.setItem('token', menteeRes?.token);
                            saveAuth(menteeRes);
                            setCurrentUser("mentor")
                            toast.success("Login Suucess")
                            router("/dashboard")
                        } else {
                            setErrors({ auth: "Authentication failed!" });
                        }
                    })
                }

                if (remindMe) {
                    localStorage.setItem("remainder", JSON.stringify(values));
                }
            } catch (error) {
                console.error(error)
                setStatus('The registration details is incorrect');
                setSubmitting(false);
                setLoading(false);
            }
        }
    })

    useEffect(() => {
        // To update the localStorage if the component's state changes
        localStorage.setItem('selectedOption', selectedOption);
    }, [selectedOption]);
    return (
        // <CommonLayout parent="home" title="login">
        <div> 
             <Meta title={'Login'}  />
            <div className="d-lg-none d-block bg_bojsryf">
                <Container>  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Container>
            </div>
            <section className="login-page section-b-space text-start">
                <Row className="justify-content-center">
                    <Col lg="6" md="10" xs="11" className="d-lg-flex align-items-center justify-content-center px-3">
                        <div className="col-xxl-7 col-xl-8 ms-xxl-5 ps-xl-5">
                            <h3 className="text-sm-start text-center">Welcome Back!</h3>

                            {selectedOption === 'mentee' && (
                                <h5 className="text-sm-start text-center">
                                    Doesn't have an account yet?{' '}
                                    <Link className="theme_color" to={`/register`}>
                                        Sign Up
                                    </Link>
                                    {/* <div onClick={()=> {
                                        const payRedirect = `https://menti.vrikshatech.in/Payment_gateway/phonePe/1/1`; 
                                          const newWindow = window.open(payRedirect, '_blank', 'noopener,noreferrer')
                                        if (newWindow) newWindow.opener = null
                                        }}>
                                        Sign Up
                                    </div> */}
                                </h5>
                            )}

                            {selectedOption === 'mentor' && (
                                <h5 className="text-sm-start text-center">
                                    Join us as a Mentor?{' '}
                                    <Link className="theme_color" to={`/mentorApplyForm-1`}>
                                        Apply Now
                                    </Link>
                                </h5>
                            )}

                            <div className="d-flex align-items-center justify-content-sm-start justify-content-center my-4 my-lg-4 btn_logn">
                                <label className={selectedOption === 'mentee' ? 'checked' : ''} onClick={() => handleOptionChange('mentee')}>
                                    {/* <input
                                        type="radio"
                                        value="mentee"
                                        checked={selectedOption === 'mentee'}
                                        onChange={handleOptionChange}
                                    /> */}
                                    I'm a Mentee
                                </label>

                                <label className={selectedOption === 'mentor' ? 'checked' : ''} onClick={() => handleOptionChange('mentor')}>
                                    {/* <input
                                        type="radio"
                                        value="mentor"
                                        checked={selectedOption === 'mentor'}
                                        onChange={handleOptionChange}
                                    /> */}
                                    I'm a Mentor
                                </label> 

                            </div>

                            {formik?.errors?.auth && (
                                <div className="alert alert-danger w-100" role="alert">
                                    <i className="fa fa-exclamation-triangle text-danger me-2" aria-hidden="true"></i>  {formik?.errors?.auth}
                                </div>
                            )}

                            <hr></hr>

                            <form className="theme-form  mt-4 mb-5" onSubmit={formik.handleSubmit} >
                                <div className="form-group mb-4">
                                    <Label className="form-label" for="email"> Email </Label>
                                    <div className="input-container mb-2">
                                        <Input type="email" className="form-control" id="email" placeholder="Email" {...formik.getFieldProps('email')} />
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

                                <div className="form-group mb-4">
                                    <Label className="form-label" for="review">
                                        Password
                                    </Label>
                                    <div className="input-container mb-2">
                                        <Input type={passVis ? 'text' : 'password'} className="form-control" id="review" placeholder="Enter your password" {...formik.getFieldProps('password')} />
                                        <img src={!passVis ? `/assets/images/homepg/Login-Register-flow/__eye.png` : `/assets/images/homepg/Login-Register-flow/Crosseye.png`} alt="" className="" onClick={() => setPassVis((pos) => !pos)} />
                                    </div>
                                    {formik.touched.password && formik.errors.password && (
                                        <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{formik.errors.password}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex align-items-center justify-content-end mb-3 mb-md-4">
                                    {/* <label className="checkbox-container mb-0">Remember Me
                                        <input type="checkbox" onChange={(e) => setRemindMe(e.target.checked)} />
                                        <span className="checkmark"></span>
                                    </label> */}
                                    <Link to={`/fogetpassword`}> <span className="theme_color fw-600">Forgot Password?</span></Link>
                                </div>

                                {isLoading ? (
                                    <button type="button" className="btn btn-solid ">
                                        <span
                                            className="spinner-border spinner-border-sm"
                                            aria-hidden="true"
                                        ></span>
                                        <span role="status">Loading...</span>
                                    </button>
                                ) : (
                                    <button type="submit" className="btn btn-solid ">
                                        <span>Login</span>
                                    </button>
                                )} 

                              {/* <div className='mb-3 mt-2'>
                                <small >By Signing in, I agree to <Link to={`/termsService`}> <span className='theme_color fw-bold'>Terms & Condition </span></Link> and <Link to={`/privacyPolicy`}> <span className='fw-bold theme_color'>Privacy Policy</span></Link></small>
                              </div> */}
                              
                            </form>
                            
                            <div className=" position-relative">
                                <hr></hr>
                                <div className="bsf"><span>Or</span></div>
                            </div>

                            {/* <div className="d-flex align-items-center justify-content-center cursor_pointer login_google mt-4">
                                 <img src={`/assets/images/homepg/Login-Register-flow/__Google.png`} alt="" className="me-3" />
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

                            <div className="d-flex align-items-center justify-content-center cursor_pointer  mt-4">
                                <LoginSocialLinkedin
                                    client_id={process.env.REACT_APP_LINKEDIN_APP_ID || ''}
                                    client_secret={process.env.REACT_APP_LINKEDIN_APP_SECRET || ''}
                                    redirect_uri={"REDIRECT_URI"}
                                    onLoginStart={onLoginStart}
                                    onResolve={({ provider, data }) => {
                                        setProvider(provider);
                                        setProfile(data);
                                    }}
                                    onReject={(err) => {
                                        console.log(err);
                                    }}
                                >
                                    <LinkedInLoginButton align='center' iconSize={20} text='Sign in with LinkedIn' size='40px' className='text-truncate socail_btn' />
                                </LoginSocialLinkedin>
                            </div>

                            {/* <div className="d-flex align-items-center justify-content-center cursor_pointer  mt-4">
                                <LoginSocialGoogle 
                                    client_id={process.env.REACT_APP_GG_APP_ID || ''}
                                    onLoginStart={onLoginStart}
                                    redirect_uri={'REDIRECT_URI'}
                                    scope="openid profile email"
                                    discoveryDocs="claims_supported"
                                    access_type="offline"
                                    onResolve={({ provider, data }) => {
                                        setProvider(provider);
                                        setProfile(data);
                                    }}
                                    onReject={err => {
                                        console.log(err);
                                    }}
                                    >
                                    <GoogleLoginButton align='center'  className='f-6' />
                                    </LoginSocialGoogle>
                                </div>  */}
                        </div>
                    </Col>

                    <Col lg="6" className="login_img d-lg-flex d-none align-items-center justify-content-center">
                        <div className="col-xl-8 me-xxl-5 pe-xl-5">
                            <Link to="/">  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Link>
                            <h6 className="py-md-5 py-4">Have 1-On-1 Conversations With Experts Anywhere, Anytime.</h6>
                            <div className="row custome_hjagef">
                                <div className="col-4 w190824">
                                    <div className="d-flex me-3 position-relative">
                                        <div className="img_login_auth"> <img src={`/assets/images/homepg/testimonial/1.jpg`} alt="" className="" /> </div>
                                        <div className="img_login_auth_1"> <img src={`/assets/images/homepg/testimonial/2.jpg`} alt="" className="" /> </div>
                                        <div className="img_login_auth_2"> <img src={`/assets/images/homepg/testimonial/3.jpg`} alt="" className="" /> </div>
                                        <div className="img_login_auth_3"> <img src={`/assets/images/homepg/testimonial/4.jpg`} alt="" className="" /> </div>
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
        // </CommonLayout>
    );
};

export default Login;
