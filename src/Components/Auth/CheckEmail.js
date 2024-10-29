import React, { useState } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { Link } from 'react-router-dom';
import toast from "react-hot-toast";
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { PostNewPassword } from './core/Auth_request';

const CheckMail = () => {

  const initialValues = {
    password: "",
    cPassword: ""
  }

  const router = useNavigate();

  const { state } = useLocation();
  const { slug } = useParams();

  const [passVis, setPassVis] = useState(false);
  const [passVis2, setPassVis2] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const taskSaveSchema = Yup.object().shape({
    password: Yup.string()
    // .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/," Password must have one upper case, lower case, special character and number (length 8-12)")
    .required('Password is required'),
    cPassword: Yup.string().oneOf([Yup.ref('password'), null], "Password must be Same!").required('Confirm Password is required'),
  })

  const formik = useFormik({
    initialValues,
    validationSchema: taskSaveSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm, setErrors }) => {
      try {
        setLoading(true)
        var formData = new FormData();
        formData.append('new_password', values.password);
        formData.append('confirm_password', values.cPassword);
        const id = state?.id ?? slug;;
        const response = await PostNewPassword(id, formData);
        if (response.status == 200) {
          router('/login');
          toast.success(response.message ?? "Success");
        } else {
          toast.error(response.message ?? "")
        }
      } catch (error) {
        setLoading(false)
      }
    }
  })


  return (
    <div>
      <div className="d-lg-none d-block bg_bojsryf">
        <Container>  <img src={`/assets/images/homepg/logo.png`} alt="" className="" /> </Container>
      </div>

      <section className="login-page section-b-space">
        <Row className="justify-content-center">
          <Col lg="6" md="10" xs="11" className="d-lg-flex align-items-center justify-content-center px-4">
            <div className="col-xxl-7 col-xl-8 ms-xxl-5 ps-xl-5">
              <h3 className="text-sm-start text-center">Set a  New Password</h3>
              <form className="theme-form mb-5 mt-4" onSubmit={formik.handleSubmit} >
                <div className="form-group mb-4">
                  <Label className="form-label" htmlFor="review3">  New Password </Label>
                  <div className="input-container mb-2">
                    <Input type={passVis ? 'text' : 'password'} className="form-control" id="review3" placeholder="Enter your password" {...formik.getFieldProps('password')} />
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

                <div className="form-group mb-4">
                  <Label className="form-label" htmlFor="review1">
                    Confirm Password
                  </Label>
                  <div className="input-container mb-2">
                    <Input type={passVis2 ? 'text' : 'password'} className="form-control" id="review1" placeholder="Enter your password" {...formik.getFieldProps('cPassword')} />
                    <img src={!passVis2 ? `/assets/images/homepg/Login-Register-flow/__eye.png` : `/assets/images/homepg/Login-Register-flow/Crosseye.png`} alt="" className="" onClick={() => setPassVis2((pos) => !pos)} />
                  </div>
                  {formik.touched.cPassword && formik.errors.cPassword && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <span role='alert' className='text-danger'>{formik.errors.cPassword}</span>
                      </div>
                    </div>
                  )}
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
                    <span>Continue</span>
                  </button>
                )}

              </form>
            </div>
          </Col>
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

export default CheckMail;