import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import * as Yup from 'yup';
import { AdminDetails, PostContact } from '../footer/request';
import toast from "react-hot-toast";
import Meta from '../../services/Meta';


const ContactUs = () => {

  const initialValues = {
    name: "",
    email: "",
    subject: "",
    message: ""
  }
  const [isloading, setloading] = useState(false)
  const [admin, setAdmin] = useState([]);


  const fetchAdmin = async (id) => {
    AdminDetails().then(res => {
      setAdmin(res?.data)
    }).catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    fetchAdmin();
  }, [])


  const ContactSchema = Yup.object().shape({
    name: Yup.string().required('Name is required '),
    email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter a valid email').required('Email is required '),
    subject: Yup.string().required('Subject is required'),
    message: Yup.string().required('Message is required')
  })

  const formik = useFormik({
    initialValues,
    validationSchema: ContactSchema,
    onSubmit: async (values, { setErrors, resetForm, setSubmitting }) => {
      try {
        setloading(true);
        var formData = new FormData();
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('subject', values.subject)
        formData.append('message', values.message)
        const response = await PostContact(formData)
        setloading(false);
        if (response.status == 200) {
          toast.success("Successfull")
          resetForm();
        } else {
          toast.error(response.message)
        }
      } catch (error) {
        console.error(error)
        // setStatus('The registration details is incorrect');
        setSubmitting(false);
        setloading(false);
      }
    }

  })


  return (
    <> 
         <Meta title={'Contact Us'}  />

      <section className="jurny_sectoion mb-4 text-start h-100">
        <div className='position-relative'>
          <img src={`/assets/images/__Conatact Us Banner.png`} alt="" className="banner_list" />
          <div className='set_tilte ' >
            <h2>Contact Us</h2>
          </div>
        </div>

        <Container className='text-common my-4 stories'>
          <Row className="align-items-enter">
            <Col xl="5" lg="6" sm="12">
              <div className=''>
                <h2>Support inquiries</h2>
                <p>All inquiries are handled by our support team. Expect typical turnaround time of 24 hours</p>
                <div className=''>
                  {
                    admin.map((data, i) => ( data?.key == "address" || data?.key == "phone" ||  data?.key == "system_email"  ?  
                      <div className='d-flex mb-3 contact_ard' key={i}>
                        <div className='bg_round_icon me-3'>
                          {
                            data?.key == "address" ?
                              <img src={`/assets/images/__location white.png`} alt="" className="" />
                              : data?.key == "phone" ?
                                <img src={`/assets/images/__phone white.png`} alt="" className="" />
                                : data?.key == "system_email" ?
                                  <img src={`/assets/images/__email white.png`} alt="" className="" />
                                  : <img src={`/assets/images/__phone white.png`} alt="" className="" />

                          }
                        </div>
                        <div className=''>
                          <p className='mb-2 fw-bold theme_color'>{
                            data?.key == "address" ? "Location" : data?.key == "phone" ?
                              "Phone Number" : data?.key == "system_email" ? "Email" : ''
                          }</p>
                          <h6 className='fw-bold text-wrap lh-base'>{data?.value}</h6>
                        </div>
                      </div> : ''
                    ))
                  }

                  {/* <div className='d-flex mb-3 contact_ard'>
                                 <div className='bg_round_icon me-3'>
                                 <img src={`/assets/images/__phone white.png`} alt="" className="" /> 
                                 </div>
                                 <div className=''>
                                    <p className='mb-2 fw-bold theme_color'>Phone Number</p>
                                    <h6 className='fw-bold'>+91 9876543210</h6>
                                 </div>
                                </div> 

                                <div className='d-flex mb-3 contact_ard'>
                                 <div className='bg_round_icon me-3'>
                                 <img src={`/assets/images/__location white.png`} alt="" className="" /> 
                                 </div>
                                 <div className=''>
                                    <p className='mb-2 fw-bold theme_color'>Location</p>
                                    <h6 className='fw-bold'>25, Bharathiyar 2nd Street, Pazhavanthangal, Chennai, Tamil Nadu, India 600114.</h6>
                                 </div>
                                </div>  */}

                </div>
              </div>
            </Col> 

            <Col xl="7" lg="6" sm="12" className='d-lg-flex justify-content-center position-relative  px-md-5'>
              <div className='col-xxl-10 col-lg-11 col-12 custome_crad_content'>
                <form className=''  onSubmit={formik.handleSubmit}>
                  <div className="form-group mb-4">
                    <div className="input-container mb-2">
                      <Input type="text" {...formik.getFieldProps('name')} className="form-control" id="name" placeholder="Name" required="" />
                      <img src={`/assets/images/homepg/Login-Register-flow/__Name.png`} alt="" className="" />
                    </div>
                    {formik.touched.name && formik.errors.name && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert' className='text-danger'>{formik.errors.name}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <div className="input-container mb-2">
                      <Input type="text" className="form-control" {...formik.getFieldProps('email')} id="email" placeholder="Email Address" required="" />
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
                    <div className="input-container mb-2">
                      <Input type="text" {...formik.getFieldProps('subject')} className="form-control" id="subject" placeholder="Subject" required="" />
                      <img src={`/assets/images/__Subject.png`} alt="" className="" />
                    </div>
                    {formik.touched.subject && formik.errors.subject && (
                      <div className='fv-plugins-message-container'>
                        <div className='fv-help-block'>
                          <span role='alert' className='text-danger'>{formik.errors.subject}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <textarea name="textarea" {...formik.getFieldProps('message')} placeholder='Write A Message...' rows="5" >
                  </textarea>
                  {formik.touched.message && formik.errors.message && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block'>
                        <span role='alert' className='text-danger'>{formik.errors.message}</span>
                      </div>
                    </div>
                  )}

                  <div className='my-4 d-flex justify-content-end'>
                    <button type='submit' className='btn_theme py-2 px-3'>
                      {
                        isloading ?
                          <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span> : "Submit"
                      }
                    </button>
                  </div>

                </form>
              </div>
              <img src={`/assets/images/Contact png bg.png`} alt="" className="img_contant_positiobsf d-xl-block d-none" />
            </Col>
          </Row>
        </Container>
      </section>
    </>
  )
}

export default ContactUs;