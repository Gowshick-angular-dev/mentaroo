import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { getDomains, getStoriesDetails, getStoryCat } from '../core/_request';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
import cn from 'classnames';
import DOMPurify from 'dompurify';
import Meta from '../../../services/Meta';

const StoriesDetail = () => {

  const [isloading, setloading] = useState(true)
  const [Stories, setStories] = useState({})
  const [templete, setTemplete] = useState();
  const { state } = useLocation()
  const { slug } = useParams();
  const router = useNavigate();

  function formatUnixTimestamp(unixTimestamp) {
    // Convert the Unix timestamp to milliseconds by multiplying by 1000
    const milliseconds = unixTimestamp * 1000;
    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);
    // Get the day, month, and year components from the date object
    const day = date.getDate();
    // JavaScript months are zero-based, so we need to add 1
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    // Concatenate the components to form the desired format
    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
  }

  const [category, setcategory] = useState([])
  const [domains, setDomains] = useState([])

  const handleCopyClipBoard = () => {
    const value = state?.id ? `${window?.location?.href}/${state?.id}` : window?.location?.href;
    navigator.clipboard.writeText(`${value}`).then(() => {
      document.getElementById('copyClipboard')?.classList.remove('d-none')
      document.getElementById('copyClipboard')?.classList.add('d-block')

      setTimeout(() => {
        document.getElementById('copyClipboard')?.classList.remove('d-block')
        document.getElementById('copyClipboard')?.classList.add('d-none')
      }, 1500)
    }).catch(err => console.log("err", err.message))
  }


  const fetchCategory = async () => {
    // setloading(true);
    getStoryCat().then(res => {
      setcategory(res);
      // setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchStoryDetails = () => {
    setloading(true)
    var id = state?.id ?? slug;
    getStoriesDetails(id).then(res => {
      setStories(res);
      setloading(false)
    }).catch(err => setloading(false))
  }


  const fetchDomains = async () => {
    getDomains().then(res => {
      setDomains(res.data);
    }).catch(e => {
      console.log(e)
    })
  }

  useEffect(() => {
    var id = state?.id ?? slug;
    if (id) {
      fetchStoryDetails();
    } else {
      router('/stories')
    }
    fetchCategory();
    fetchDomains();
  }, [state?.id])

  function htmlDecode(input) {
    if (input && input.includes('&lt;') && input.includes('&gt;')) {
      var e = document.createElement('div');
      e.innerHTML = input;
      return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
    } else {
      return input ?? ''
    }
  }





  return (
    <> 

             <Meta title={Stories?.title ?? "Stories"}  />
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
          </div> : Object.keys(Stories).length > 0 ?
            <section className="jurny_sectoion mb-4 text-start">
              <Container className='text-common my-4 stories'>
                <Row className='position-relative'>
                  <Col xl="8">
                    <div className='ms-xxl-5'>
                      <h2 className='mb-3 mt-3 mt-xl-4'>{Stories?.title}</h2>
                      <div className='d-flex align-items-center'>
                        <div className="d-flex align-items-center">
                          <img src={Stories?.user_image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="stories-drtail_img me-2" />
                          <p className="mb-0 text-dark fw-bold">{Stories?.user_name}</p>
                        </div>
                        <div className="d-flex align-items-center px-2">
                          {Stories?.blog_category_name ? <div className='boredr-deneral'></div> : ''}
                          <p className="mb-0 theme_color fw-bold px-2">{Stories?.blog_category_name}</p>
                          <div className='boredr-deneral'></div>
                        </div>
                        <div className="d-flex align-items-center">
                          <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                          <p className="mb-0">{formatUnixTimestamp(Stories?.added_date)}</p>
                        </div>
                      </div>
                      <div className='position_stort'>
                        <div className='mb_custome position-relative'>
                          <div className='image_stories_iconshate' title='copy' onClick={() => handleCopyClipBoard()}>
                            <a>
                              <img src={`/assets/images/storiesdetail/__Copy link.png`} alt="" className="" />
                            </a>
                          </div>
                          <div id="copyClipboard" className="d-none bg-secondary user-select-none text-light px-3 py-1 rounded-3 position-absolute top-100 end-0">copied!</div>
                        </div>
                        <div className='mb_custome'>
                          {/* <div className='image_stories_iconshate' onClick={() => window.open(JSON.parse(Stories?.social_links ?? '')?.facebook ?? '', "_blank")}> */}
                          <div className='image_stories_iconshate' onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`, '_blank')}>
                            <a>
                              <img src={`/assets/images/storiesdetail/__facebook.png`} alt="" className="" />
                            </a>
                          </div>
                        </div> 

                        <div className='mb_custome'>
                          {/* <div className='image_stories_iconshate' onClick={() => window.open(JSON.parse(Stories?.social_links)?.twitter.startsWith('https') ? JSON.parse(Stories?.social_links)?.twitter : JSON.parse(Stories?.social_links)?.twitter ? 'https://' + JSON.parse(Stories?.social_links)?.twitter : '', "_blank")}> */}
                          <div className='image_stories_iconshate' onClick={() => window.open(`https://www.instagram.com/?url=${window.location.href}`, '_blank')}>
                            <a>
                              <img src={`/assets/images/storiesdetail/__insta-143.png`} alt="" className="" />
                            </a>
                          </div>
                        </div>

                        <div className='mb_custome'>
                          {/* <div className='image_stories_iconshate' onClick={() => window.open(JSON.parse(Stories?.social_links)?.linkedin.startsWith('https') ? JSON.parse(Stories?.social_links)?.linkedin : JSON.parse(Stories?.social_links)?.linkedin ? 'https://' + JSON.parse(Stories?.social_links)?.linkedin : '', "_blank")} > */}
                          <div className='image_stories_iconshate' onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`, '_blank') } >
                            <a>
                              <img src={`/assets/images/storiesdetail/__linkedin.png`} alt="" className="" />
                            </a>
                          </div>
                        </div> 
                      </div>

                      <img src={Stories?.banner} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="image_stories_detail mb-3 mb-xl-4 mt-3" />
                        {/* <h3 className='mb-3'>Mentorship Is Guidance Along The Way</h3>
                        <p>Joris was looking for guidance and feedback along the way, having a mentor to review the progress helped him a lot to stay focused and motivated, prioritization of topics to study, and finally support with landing a challenging job in the blockchain space.</p>
                        <p>MentorCruise has been a crucial part of Joris' journey, helping him to make a difficult career jump without any prior experience in the blockchain space. Joris has worked with several mentors on MentorCruise, including and predominantly Rob Hitchens, who has supported him on the first steps of developing smart contracts with Solidity.</p>
                        <p>Most parts of the mentorship were completed asynchronously. During the months with Rob, they just had the need for a handful of video calls, with Joris working daily on his progress and Rob being there when needed.</p>
                        <p>The beauty of mentorship is that the journey is entirely personal. Mentors look at the situation of a mentee with fresh eyes every time and can plan out a roadmap based on all circumstances. For many, this is where the value of other education paths stops.</p>
                        <p>It wasn't long before, with Rob's guidance and feedback, Joris was able to land a job as a Web3 front-end developer in a very promising DeFi startup called Keyring Network. In this role, he is responsible for the front-end development of Keyring Network, which has been a great challenge.</p>
                        <p>MentorCruise and Rob have helped Joris to reach his goals by providing guidance and feedback, prioritizing topics to study, and connecting him with others who have similar goals. Joris has attended two hackathons and has won prizes at both.</p>
                        <p>Joris would recommend mentorship to others as a way to accelerate the learning process. He believes that the right mentor can be a really useful companion no matter where you want to go.</p> */}
                        {/* <p>{Stories?.description}</p> */}
                        {/* <iframe className='vedio_play mb-3' src="https://www.youtube.com/embed/tgbNymZ7vqY?autoplay=1&mute=1"></iframe> */}
                        {/* <p>Crafting the perfect pitch deck is both an art and a science. It's not just about presenting facts; it's about telling a story and resonating with your audience. Every slide, every word, should be intentional and serve a purpose.</p>
                        <p>Avoid common pitfalls, stay authentic, and always aim for clarity. Remember, at the heart of every successful pitch is a genuine connection with your audience.</p>
                        <p>So, focus on that connection, be transparent, and let your passion shine through. With the right approach, your pitch deck can open doors and set you on the path to success.</p> */}
                        {/* <div  dangerouslySetInnerHTML={{__html:Stories?.description}}>
                              </div> */} 
                      <div dangerouslySetInnerHTML={{ __html: htmlDecode(Stories?.description) }} />                      
                    </div>
                  </Col> 

                  <Col>
                    <div className=' py-3 mb-3'>
                      {
                        category?.length > 0 ?
                          <div className='sidebaer_dc mb-3'>
                            <div className='sidebaer_dc_inner p-3'>
                              <h3 className='mb-0'>Categories</h3>
                            </div>
                            <div className='py-3'>
                              {
                                category?.map((d, i) => (
                                  <Link to={'/stories'} state={{ catId: d?.blog_category_id }}  key={i}>
                                    <p className={`mb-0 ${Stories?.blog_category_id == d?.blog_category_id ? 'text_color active fw-bold' : ' text-dark'}`}>{d?.title}</p>
                                  </Link>
                                ))
                              }
                              {/* <p className="mb-0 text-dark active">General</p>
                          <p className="mb-0 text-dark">Inspiring Stories</p>
                          <p className="mb-0 text-dark">Day In The Life Of</p>
                          <p className="mb-0 text-dark">Know Your Mentor</p> */}
                            </div>
                          </div> : ''
                      }
                      {
                        domains?.length > 0 ?
                          <div className='sidebaer_dc'>
                            <div className='sidebaer_dc_inner p-3'>
                              <h3 className='mb-0'>Domain</h3>
                            </div>
                            <div className='py-3'>
                              {
                                domains?.map((d, i) => (
                                  <Link to={'/stories'} state={{ domId: d?.id }} key={i} >
                                    <p className={`mb-0 ${Stories?.domain_id == d?.id ? 'text_color active fw-bold' : ' text-dark'} `}  >{d?.name}</p>
                                  </Link>
                                ))
                              }
                              {/* <p className="mb-0 text-dark">Front End</p>
                          <p className="mb-0 text-dark">App Developer</p>
                          <p className="mb-0 text-dark">UX Design</p>
                          <p className="mb-0 text-dark">Web Design </p> */}
                            </div>
                          </div> : ""
                      }
                    </div>
                    {
                      Stories?.related_stories?.length > 0 ?
                        <div className=' py-3'>
                          <div className=''>
                            <h3 className='mb-4'>You May Also Be Interested In</h3>
                            {
                              Stories?.related_stories.map((data, i) => (
                                <Link to={`/stories_detail`} state={{ id: data?.blog_id }} onClick={() => {
                                  window.scroll(0, 0)
                                }} key={i}>
                                  <div className='mb-3 sidebar_stroryt' >
                                    <p className='mb-2 two_line text_hover'>{data?.title}</p>
                                    <div className="d-flex align-items-center">
                                      <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                      <h6 className="mb-0">{formatUnixTimestamp(data?.added_date)}</h6>
                                    </div>
                                  </div>
                                </Link>
                              ))
                            }
                            {/* <div className='mb-3 sidebar_stroryt'>
                          <p className='mb-2 two_line'>Passing The Torch #09: The Future of Marketing and Al, with Mike...</p>
                          <div className="d-flex align-items-center">
                            <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                            <h6 className="mb-0">24 Dec 2022</h6>
                          </div>
                        </div>
                        <div className='mb-3 sidebar_stroryt'>
                          <p className='mb-2 two_line'>Case Study: How to validate a startup idea using a pre-launch...</p>
                          <div className="d-flex align-items-center">
                            <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                            <h6 className="mb-0">03 Mar 2023</h6>
                          </div>
                        </div>
                        <div className='mb-3 sidebar_stroryt'>
                          <p className='mb-2 two_line'>Passing The Torch #09: The Future of Marketing and Al, with Mike...</p>
                          <div className="d-flex align-items-center">
                            <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                            <h6 className="mb-0">24 Dec 2022</h6>
                          </div>
                        </div> */}
                          </div>
                        </div> : ''
                    }
                  </Col> 
                
                </Row>
              </Container>
            </section> :
            <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
              <img src='/assets/nodata.png' className='w-50' />
            </div>
      }
    </>
  )
}

export default StoriesDetail;