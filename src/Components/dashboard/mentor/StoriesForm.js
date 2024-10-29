import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import PropTypes from 'prop-types';
import { Editor } from 'primereact/editor';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getDomains, getStoriesDetails, getStoryCat } from '../../pages/core/_request';
import toast from "react-hot-toast";
import { saveStories } from './request';
import { useAuth } from '../../Auth/core/Auth';
import { useNavigate, useLocation } from 'react-router-dom';
import cn from 'classnames';
import Meta from '../../../services/Meta'; 
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";


const AddNewStory = ({ direction, ...args }) => {
  const [text, setText] = useState('');

  const [loading, setLoading] = useState(false)
  const [domainList, setDomainList] = useState([])
  const [category, setCategory] = useState([])
  const [image, setImage] = useState();
  const [Pageloading, setPageLoading] = useState(false);
  const { quill, quillRef } = useQuill();  

  // useEffect(() => {
  //   if (quill) {  
  //     quill.on('text-change', (delta, oldDelta, source) => {
  //       setText(quill.root.innerHTML); 
  //       // console.log(quill.getText()); // Get text only
  //       // console.log(quill.getContents()); // Get delta contents
  //       // console.log(quill.root.innerHTML); // Get innerHTML using quill
  //       // console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
  //     });
  //   }
  // }, [quill]); 


  const [Preimage, setPreimage] = useState();
  const router = useNavigate();

  const { state } = useLocation();

  const { auth } = useAuth();

  const handleImage = (e) => {
    setPreimage(URL.createObjectURL(e.target.files[0]))
    setImage(e.target.files[0])
  }

  const storiesSchema = Yup.object().shape({
    domain: Yup.string(),
    category: Yup.string(),
    title: Yup.string().required("Enter Story Title"),
    description: Yup.string(),
    user_id: Yup.string(),
  })



  const fetchDomain = () => {
    getDomains().then(res => {
      setDomainList(res.data);
    }).catch(err => console.log(err))
  }

  const fetchStroycat = () => {
    getStoryCat().then(res => {
      setCategory(res);
    }).catch(err => console.log(err))
  }

  const initialValues = {
    domain: "",
    category: "",
    title: "",
    description: "",
    user_id: "",
  } 


  const formik = useFormik({
    initialValues,
    validationSchema: storiesSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm, setErrors }) => {
      try {
        setLoading(true);

        var formData = new FormData();
        formData.append('domain', values?.domain)
        formData.append('category', values?.category)
        formData.append('description', text)
        formData.append('user_id', auth?.user_id)
        formData.append('title', values?.title)
        formData.append('image', image)
        
        if (state?.id) {
          formData.append('id', state?.id ?? '')
        }
        const response = await saveStories(formData);
        setLoading(false);
        if (response.status == 200) {
          toast.success(response?.message ?? "successfull!");
          router('/my-stories')
        } else {
          toast.error(response?.message)
        }

      } catch (error) {
        console.error(error);
        setStatus('The registration details is incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  })

  const fetchStoryDetails = () => {
    setPageLoading(true)
    getStoriesDetails(state?.id).then(res => {
      formik.setFieldValue('domain', res?.domain_id)
      formik.setFieldValue('category', res?.blog_category_id)
      formik.setFieldValue('title', res?.title)
      setText(res?.description) 
      if(quill){
        quill.clipboard.dangerouslyPasteHTML(res?.description ?? '');
      }
      setPreimage(res?.banner);
      setImage(res?.banner)
      setPageLoading(false)
    }).catch(err => {
      setPageLoading(false)
    })
  }


  useEffect(() => {
    fetchDomain();
    fetchStroycat();
    if (state?.id) {
      fetchStoryDetails()
    }
  }, [])




  return (
    <>
    <Meta title={'Add new Story'}  />

      <section className="section-b-space h-100vh">
        {/* <DashboardNavbar /> */}
        <Row className='h-100 custome_heifht'>
          <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
            <div className='col-xl-9 d-flex justify-content-center'>
              <SideBar></SideBar>
            </div>

          </Col>
          <Col lg="9" className='px-xl-4 py-4 scrol_right h-100'>
            {
              Pageloading ?
                <div className='pageLoading'>
                  <span
                    className={cn(
                      'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                    )}
                  >
                    <span className={"loading"} />
                  </span>
                </div> :
                <Col xl="11" className='h-100'>
                  <div className='h-100 '>
                    <h2>{state?.id ? "Update" : "Add New"} Story</h2>
                    <form onSubmit={formik.handleSubmit}>
                      <div className='custome_cad p-4'>
                        <Row>
                          <Col md="6">
                            <div className="form-group custome_dripo mb-3">
                              <Label className="form-label" htmlFor='dom'>
                                Domain
                              </Label>

                              <div className="custome_dripo">
                                <Select
                                  isSearchable={false}
                                  placeholder='Domain'
                                  // onChange={(e) => experienceForm.setFieldValue('start_month', e?.value)}
                                  inputId='dom'
                                  value={domainList.find(e => e?.id == formik.getFieldProps('domain').value) ?? ''}
                                  classNamePrefix="select"
                                  getOptionLabel={(e) => e?.name}
                                  getOptionValue={(e) => e?.id}
                                  onChange={(e) => formik.setFieldValue('domain', e?.id)}
                                  options={domainList}
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
                          <Col md="6">
                            <div className="form-group custome_dripo mb-3">
                              <Label className="form-label" htmlFor='cat'>
                                Category
                              </Label>
                              <div className="custome_dripo">
                                <Select
                                  isSearchable={false}
                                  placeholder='category'
                                  // onChange={(e) => experienceForm.setFieldValue('start_month', e?.value)}
                                  inputId='cat'
                                  value={category.find(e => e?.blog_category_id == formik.getFieldProps('category').value) ?? ''}
                                  classNamePrefix="select"
                                  getOptionLabel={(e) => e?.title}
                                  getOptionValue={(e) => e?.blog_category_id}
                                  onChange={(e) => formik.setFieldValue('category', e?.blog_category_id)}
                                  options={category}
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
                        </Row>
                        <div className="form-group mb-3">
                          <Label className="form-label" htmlFor="email">Title*</Label>
                          <div className="input-container mb-1">
                            <Input type="text" className="form-control"  {...formik.getFieldProps('title')} id="email" placeholder="Enter Story Title" required="" />
                          </div>
                          {formik.touched.title && formik.errors.title && (
                            <div className='fv-plugins-message-container'>
                              <div className='fv-help-block'>
                                <span role='alert' className='text-danger'>{formik.errors.title}</span>
                              </div>
                            </div>
                          )}
                        </div>
                        {/* <div className="form-group">
                              <Label className="form-label" >Youtube URL</Label>
                              <div className="input-container">
                                <Input type="email" className="form-control" id="email" placeholder="e.g. www.youtube.com/myvideo..." required="" />
                              </div>
                            </div> */}
                        <Label className="form-label" >Description</Label>
                        <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} />  
                        {/* <div>
                        <div ref={quillRef} />
                        </div> */}
                        <div className="form-group mt-3">
                          <Label className="form-label" >Upload Images</Label>
                          {
                            image ?
                              <div className='custome_iplad mt-2'>
                                <img src={Preimage} alt="" className="" />
                                <div className='deklyer_ohj' role='button' onClick={() => { setImage(); setPreimage() }}>
                                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </div>
                              </div> :
                              <div role='button' onClick={() => document.getElementById('UploadStoryFile')?.click()} className='custome_iplad bg-secondary-subtle mt-2 d-flex justify-content-center align-items-center'>
                                {/* <img src="/assets/images/mentor10.png" alt="" className="" /> */}
                                <i className="fa fa-upload text-secondary fs-4" aria-hidden="true"></i>
                                {/* <i class="fa fa-plus fs-4" aria-hidden="true"></i> */}
                              </div>
                          }
                          <input type='file' className='d-none' onChange={(e) => handleImage(e)} id='UploadStoryFile' />
                        </div>
                        <div className='d-flex align-items-center justify-content-start my-4'><button type='submit' className='border-0 btn_next me-3'>{
                          loading ? <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span> : state?.id ? "Update" : "Save"
                        }</button> <button type='button' onClick={() => {
                          formik.resetForm();
                          setText();
                          setImage();
                          setPreimage();
                        }} className='border-0 btn_cancel'>Cancel</button></div>
                      </div>
                    </form>
                  </div>
                </Col>
            }
          </Col>

        </Row>
      </section>
    </>

  )
}

export default AddNewStory