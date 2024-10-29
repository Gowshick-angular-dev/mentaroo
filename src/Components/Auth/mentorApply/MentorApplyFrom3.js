import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Label, Input, Col, Button } from "reactstrap";
import Select from 'react-select';
import toast from "react-hot-toast";
import { Link } from 'react-router-dom';

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { MentorRegister, MentorSaveProgram, getOptinal } from '../core/Auth_request';
import { useNavigate } from 'react-router-dom';
import Meta from '../../../services/Meta';

const MentorApplyFrom3 = ({setStep,setFormvalue,Formvalue, direction, ...args }) => {

  const router = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const [dropdownOpen1, setDropdownOpen1] = useState(false);
  const toggle1 = () => setDropdownOpen1((prevState) => !prevState);

  const [dropdownOpen2, setDropdownOpen2] = useState(false);
  const toggle2 = () => setDropdownOpen2((prevState) => !prevState);

  const [dropdownOpen3, setDropdownOpen3] = useState(false);
  const toggle3 = () => setDropdownOpen3((prevState) => !prevState);
  const [isloading, setloading] = useState(true)
  const [optins, setOptions] = useState([])
  const [motiv, setMotive] = useState('');
  const [selectAbout, setSelectAbout] = useState();
  const [isLoading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false)



  const fetchOptions = async () => {
    setloading(true);
    getOptinal().then(res => {
      setOptions(res.data)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  useEffect(() => {
    fetchOptions();
  }, [])

  const handleRegister = () => {
    try {
      setLoading(true);
      var formData = new FormData()
      formData.append("first_name", Formvalue?.values?.full_name ?? '')
      formData.append("last_name", "" ?? '')
      formData.append("email", Formvalue?.values?.email_address ?? '')
      formData.append("password", Formvalue?.values?.password ?? '')
      formData.append("phone", Formvalue?.values?.phone_number ?? '')
      formData.append("facebook_link", '')
      formData.append("twitter_link", Formvalue?.values?.instagram ?? '')
      formData.append("linkedin_link", Formvalue?.values?.linkedin ?? '')
      formData.append("biography", Formvalue?.bio ?? '')
      formData.append("country", Formvalue?.values?.country ?? '')
      formData.append("state", Formvalue?.values?.state ?? '')
      formData.append("city", Formvalue?.values?.city ?? '')
      formData.append("personal_website", Formvalue?.values?.website ?? '')
      formData.append("time_zone", Formvalue?.values?.time_zone ?? '')
      formData.append("job_title", Formvalue?.job_title ?? '')
      formData.append("company", Formvalue?.company ?? '')
      formData.append("domain_expertise", Formvalue?.domain_expert ?? '')
      formData.append("year_of_experience", Formvalue?.experience ?? '')
      formData.append("why_want_be_mentor", Formvalue?.motive ?? motiv  ?? '')
      formData.append("how_hear_about_us", Formvalue?.aboutId ?? selectAbout ?? '')
      formData.append("image", Formvalue?.image ?? '')

      if (Formvalue?.skill?.length > 0) {
        for (var i = 0; i < Formvalue?.skill?.length; i++) {
          formData.append(`skills[${i}]`, Formvalue?.skill[i])
        }
      }

      if (Formvalue?.offered?.length > 0) {
        for (var i = 0; i < Formvalue?.offered?.length; i++) {
          formData.append(`offered[${i}]`, Formvalue?.offered[i])
        }
      }


      MentorRegister(formData).then(res => {
        setLoading(false);
        if (res.status == 200) {
          var formD = new FormData()
          formD.append(`mentor_id`, res?.user_id)
          if (Formvalue?.programs?.length > 0) {
            Formvalue?.programs?.map((v, i) => {
              v.map((d, j) => {
                formD.append(`program_id[${i}]`, d?.program_is)
                formD.append(`package_id[${j}]`, d?.package)
                formD.append(`price[${i}][${j}]`, d?.price)
              })
            })
          }
          MentorSaveProgram(formD).then(res => {
            toast.success(res?.message ?? "success")
            router('/login')
          });
        } else {
          toast.error(res.message)
        }
      })
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }




  return (
    <div>
       <Meta title={'Apply as a mentor'}  />
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
                        <div className='me-2 inner_text green'>1</div>
                        <p className='mb-0'>Profile Information</p>
                      </div>
                    </Col>
                    <Col className='px-0 '>
                      <div className='d-flex align-items-center mentor-tab_head_design_yellow justify-content-center'>
                        <div className='me-2 inner_text green'>2</div>
                        <p className='mb-0'>About You</p>
                      </div>
                    </Col>
                    <Col className='ps-0'>
                      <div className='d-flex align-items-center mentor-tab_head_design_yellow'>
                        <div className='me-2 inner_text'>3</div>
                        <p className='mb-0'>Your Motivation</p>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div className='tab_body p-4'>

                  <div className=''>
                    <Row>



                      <Col xs="12" className=''>

                        <div className="form-group custome_dripo mb-3">
                          <Label className="form-label" for="want_mentor">Why do want to mentor?(Not publicly visible)*</Label>
                          <textarea className="form-control mb-0" value={motiv || Formvalue?.motive}  placeholder=""
                            id="want_mentor" onChange={(e) => {setMotive(e.target.value); setFormvalue((p)=> ({...p, "motive": e.target.value}))}} rows="6">
                          </textarea>
                        </div>

                      </Col>
                      <Col xs="12">
                        <div className="form-group custome_dripo mb-3">
                          <Label className="form-label" htmlFor="about_us">
                            How did you hear about us(Optional)
                          </Label>
                          <div className="custome_dripo">

                            <Select
                              isSearchable={false}
                              placeholder='Youtube'
                              inputId='about_us'
                              options={optins}
                              value={optins.find(e => e?.id == (selectAbout || Formvalue?.aboutId))}
                              onChange={(e) => {setSelectAbout(e?.id); setFormvalue((p)=> ({...p, "aboutId":e?.id})) }}
                              getOptionLabel={(e) => e?.title}
                              getOptionValue={(e) => e?.id}
                              classNamePrefix="select"
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
                        <label className="checkbox-container my-4 ">I agree with <Link to={`/termsService`} className='theme_color fw-bold' >Terms and conditions</Link>
                          <input type="checkbox" value={terms} onChange={(e) => setTerms(e.target.checked)} />
                          <span className="checkmark"></span>
                        </label>
                      </Col>
                      <Col xs="12">
                        <div className='d-flex align-items-center justify-content-center'>
                          {/* <Link href='/dashboard' className='btn_next mt-4'>Submit</Link></div> */}
                          <button type='button' onClick={()=> setStep(2)} className='btn_back border-0 mt-4 me-2'>Back</button>
                          {
                          !terms ?
                          <button type='button' className=" btn_back border-0 mt-4 ms-2 "> Submit</button> : isLoading ? (
                              <button type="button" className="border-0 btn_next mt-4">
                                <span
                                  className="spinner-border spinner-border-sm"
                                  aria-hidden="true"
                                ></span>
                                <span role="status">Loading...</span>
                              </button>
                            ) : (  
                              <button type='button' onClick={() => handleRegister()} className='border-0 ms-2 btn_next mt-4'>Submit</button>
                            )
                          }
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default MentorApplyFrom3;
