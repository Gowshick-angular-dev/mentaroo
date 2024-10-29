import React, { useState, useEffect } from 'react';
import { Col, Row, Container, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionHeader, AccordionBody } from 'reactstrap';
import Slider from "react-slick";
import { Slider7 } from '../../services/script';
import { Slider2 } from '../../services/script';
import { getAboutCouter, getAboutEmpower, getAboutMentor, getAboutPlatform, getAboutVision } from './core/_request';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import Meta from '../../services/Meta';

const AboutUs = () => {
  const [open, setOpen] = useState('');
  const toggle = (id) => {
    if (open === id) {
      setOpen();
    } else {
      setOpen(id);
    }
  };

  const router = useNavigate();

  function htmlDecode(input) {
    if (input && input.includes('&lt;') && input.includes('&gt;')) {
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    } else {
      return input ?? ''
    }
  }

  const [empower, setEmpower] = useState([])
  const [counterUp, setCounterUp] = useState([])
  const [vision, setVision] = useState([])
  const [platform, setPlatform] = useState([])
  const [aboutMentor, setAboutMentor] = useState([])
  const [isloading, setloading] = useState(true)


  const fetchEmpowerList = async () => {
    setloading(true);
    getAboutEmpower().then(res => {
      setEmpower(res.data);
      setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchCounterList = async () => {
    setloading(true);
    getAboutCouter().then(res => {
      setCounterUp(res.data);
      setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchVisionList = async () => {
    setloading(true);
    getAboutVision().then(res => {
      setVision(res.data);
      setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchPlatFormList = async () => {
    setloading(true);
    getAboutPlatform().then(res => {
      setPlatform(res.data);
      setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchAboutMentorList = async () => {
    setloading(true);
    getAboutMentor().then(res => {
      setAboutMentor(res.data);
      setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchPromist = async () => {
    await Promise.all([
      fetchAboutMentorList(),
      fetchPlatFormList(),
      fetchVisionList(),
      fetchEmpowerList(),
      fetchCounterList(),
    ])
  }

  useEffect(() => {
    fetchPromist();
  }, [])





  return (
    <> 
         <Meta title={"About Us"}  />

      {
        isloading ?
          <div className='pageLoading'>
            <span
              className={cn(
                'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
              )}
            >
              <span className={"loading"} />
            </span>
          </div> :
          <div className="about_pg text-start swift-up-text">
            {
              empower?.length > 0 ?
                <>

                  <div className='position-relative '>
                    <img src={empower[0].background_image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/listpagebanner.png"} alt="" className="banner_list" />
                    <div className='set_tilte d-flex justify-content-center h-100 top-0 align-items-center bg_customedjf' >

                      <div className='col-xxl-4 col-lg-6'>
                        <h2 className='mb-3'>{empower[0]?.heading}</h2>
                        <p className='mb-3 two_line' dangerouslySetInnerHTML={{ __html: htmlDecode(empower[0]?.description) }} />
                        <div className='mb-3 d-flex justify-content-center'>
                          <button type='button' onClick={() => router(`${empower[0]?.mentor_button_url}`)} className='me-3 btn_theme px-3'>{empower[0]?.mentor_button_text}</button> <button onClick={() => router(`${empower[0]?.become_mentor_url}`)} type='button' className='btn btn_banner'>{empower[0]?.become_mentor_text}</button>
                        </div>
                      </div>

                    </div>
                  </div>
                  <div className=' pt-xl-5 pt-md-4 pt-3'>
                    <Container>
                      <Row>
                        <Col lg="6" className='pe-xl-4'>
                          <h5 className='text-center three_line' dangerouslySetInnerHTML={{ __html: htmlDecode(empower[0]?.about_content1) }} />
                        </Col>
                        <Col lg="6" className='ps-xl-4'>
                          <h5 className='text-center three_line' dangerouslySetInnerHTML={{ __html: htmlDecode(empower[0]?.about_content2) }} />
                        </Col>
                      </Row>
                    </Container>
                  </div>
                </>
                : ''
            }



            {
              counterUp?.length > 0 ?
                <div className=' py-xl-5 py-md-4 py-3'>
                  <Container>
                    <div className='position-relative'>
                      <img src={counterUp[0]?.background_image} onError={(e) => e.currentTarget.src = '/assets/images/about_cont.png'} alt="" className="image_abut_2 d-xl-block d-none" />
                      <div className='position-absolute  top-0 left-0 w-100 h-100 custome_posyith'>
                        <div className=' col-xl-5 Custome_abut_position '>
                          <h2 className='text-white mb-4 two_line'>{counterUp[0]?.heading}</h2>

                          <div className='pe-xl-5'>
                            <div className='d-flex align-items-center py-2'>
                              <h2 className='text-white mb-0 me-3 me-xl-4'>{counterUp[0]?.counterup_value1}</h2>
                              <h5 className=' text-white mb-0 col-xl-5 two_line'>
                                {counterUp[0]?.counterup_text1}
                              </h5>
                            </div>
                            <hr></hr>
                            <div className='d-flex align-items-center py-2'>
                              <h2 className='text-white mb-0 me-3 me-xl-4'>{counterUp[0]?.counterup_value2}</h2>
                              <h5 className=' text-white mb-0 col-xl-5 two_line'>
                                {counterUp[0]?.counterup_text2}
                              </h5>
                            </div>
                            <hr></hr>
                            <div className='d-flex align-items-center py-2'>
                              <h2 className='text-white mb-0 me-3 me-xl-4'>{counterUp[0]?.counterup_value3}</h2>
                              <h5 className=' text-white mb-0 col-xl-5 two_line'>
                                {counterUp[0]?.counterup_text3}
                              </h5>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </Container>
                </div> : ''

            }

            {
              vision?.length > 0 ?
                <div className='my-xl-5 my-lg-4 my-3'>
                  <Container>
                    <h2 className='text-center'>{vision[0]?.vision_title}</h2>
                    <h4 className='theme_color fw-bold text-center'>{vision[0]?.vision_text}</h4>

                    <Row className='justify-content-center mt-lg-4 mt-3'>
                      {
                        vision?.map((data, i) => (
                          <Col xxl="4" md="6" key={i} className='mb-3 d-flex align-items-center justify-content-center'>
                            <div className='bg_about_card text-center px-3'>
                              <div className='d-flex justify-content-center mb-3'>
                                <img className='icon_auth_about ' src={data?.image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" />
                              </div>
                              <h3>{data?.heading}</h3>
                              <h5 className='px-xl-3 four_line' dangerouslySetInnerHTML={{ __html: htmlDecode(data?.description) }} />
                            </div>
                          </Col>
                        ))
                      }
                      {/* <Col xxl="4" md="6" className='mb-3 d-flex align-items-center justify-content-center'>
                <div className='bg_about_card text-center px-3 '>
                  <div className='d-flex justify-content-center mb-3'>
                    <img className='icon_auth_about' src={`/assets/images/__Case studies.png`} alt="" />
                  </div>
                  <h3>Community-Centric Growth</h3>
                  <h5 className='px-xl-3'>More than a platform, we're a vibrant community where mentors and mentees connect, share experiences, and fuel holistic personal and professional growth.</h5>
                </div>
              </Col>
              <Col xxl="4" md="6" className='mb-3 d-flex align-items-center justify-content-center'>
                <div className='bg_about_card text-center px-3'>
                  <div className='d-flex justify-content-center mb-3'>
                    <img className='icon_auth_about ' src={`/assets/images/__Best practices.png`} alt="" />
                  </div>
                  <h3>Inspirational Learning</h3>
                  <h5 className='px-xl-3'>Our commitment goes beyond advice, providing comprehensive experiences for well-rounded development. We inspire growth by bringing mentors and mentees together for mutual inspiration and guidance.</h5>
                </div>
              </Col> */}
                    </Row>
                  </Container>
                </div>
                : ''
            }


            {
              platform?.length > 0 ?
                <div className=''>
                  <Container>
                    <Row className='align-items-center'>
                      <Col lg="5" >
                        <img src={platform[0]?.image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="image_abut_1 mb-3" />
                      </Col>
                      <Col lg="6" className='offset-xl-1'>
                        <div className=''>
                          <h2 className=' mb-xl-4 mb-3 two_line'>{platform[0]?.heading}</h2>
                          <h5 className='mb-3 two_line' dangerouslySetInnerHTML={{ __html: htmlDecode(platform[0]?.text1) }} />
                          <h5 className='mb-3 two_line' dangerouslySetInnerHTML={{ __html: htmlDecode(platform[0]?.text2) }} />
                        </div>

                      </Col>
                    </Row>
                  </Container>
                </div> : ''
            }

            {
              aboutMentor?.length > 0 ?
                <div className='py-xl-5 py-md-4 py-3'>
                  <Container>
                    <Row>
                      {
                        aboutMentor?.map((data, i) => (
                          <Col lg="6" className='mb-3' key={i}>
                            <div className='d-flex align-items-center'>
                              <div className='position-relative me-3 me-xl-4'>
                                <img src={data?.image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="mentor_about" />
                                <img src={`/assets/images/__Quote.png`} alt="" className="position-img" />
                              </div>
                              <div className=''>
                                <h5 className='mb-3 col-xxl-10 four_line' dangerouslySetInnerHTML={{ __html: htmlDecode(data?.description) }} />
                                <h5 className='theme_color fw-bold'>- {data?.name}, {data?.designation}</h5>
                              </div>
                            </div>
                          </Col>
                        ))
                      }
                      {/* <Col lg="6" className='mb-3'>
                            <div className='d-flex align-items-center'>
                              <div className='position-relative me-3 me-xl-4'>
                                <img src={`/assets/images/mentor11.png`} alt="" className="mentor_about" />
                                <img src={`/assets/images/__Quote.png`} alt="" className="position-img" />
                              </div>
                              <div className=''>
                                <h5 className='mb-3 col-xxl-10'>"My original plan was to enroll in a coding bootcamp, before I found out about MentorCruise. Paying $15,000 no longer seemed reasonable.</h5>
                                <h5 className='theme_color fw-bold'>- Daniel Carlman, Developer</h5>
                              </div>
                            </div>
                          </Col> */}
                    </Row>
                  </Container>
                </div> : ''
            }
          </div>
      }
    </>
  )
}

export default AboutUs;