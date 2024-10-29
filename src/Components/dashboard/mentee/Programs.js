import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { getLearnGoal, getMyProgram, postGoals, postReview } from './request';
import { useAuth } from '../../Auth/core/Auth';
import cn from 'classnames';
import dayjs from 'dayjs';
import Meta from '../../../services/Meta';
import toast from 'react-hot-toast';


const MyProgram = (...args) => {

    const [modal, setModal] = useState(false);
    const [modal1, setModal1] = useState(false);
    const [currentMentor, setcurrentMentor] = useState('');
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [myPrograms, setMyPrograms] = useState([]);
    const [currentStatus, setCurrentStatsus] = useState("no");
    const [rating, setRating] = useState(1);
    const [review, setreview] = useState('');  
    const [LGoals, setLGoals] = useState([]); 
    const [LGoalsAns, setLGoalsAns] = useState([]); 
    const [session, setSession] = useState(); 


    const handleMyPrograms = () => {
        setLoading(true)
        const id = auth?.user_id;
        getMyProgram(id).then((res) => {
            setMyPrograms(res.data);
            setLoading(false)
        }).catch((err) => {
            console.log('err', err.message);
            setLoading(false)
        })
    } 

    const fetchGoals = () => {
        getLearnGoal().then(res => {
            setLGoals(res.data)
            setLoading(false)
        }).catch(err => {
            console.log('err',err.message);
            setLoading(false)
        }) 
    } 

     const postGoalAnswser = (e) => { 
         e.preventDefault(); 
         var formdata = new FormData(); 
           LGoalsAns.map((res, i) => {
             formdata.append(`question[${i}]`,res?.id )
             formdata.append(`answer[${i}]`,res?.ans)
            })
            formdata.append('user_id', auth?.user_id);
            formdata.append('booking_id',session?.id ?? ''); 
         postGoals(formdata).then(res => {
             togglePopup()
             toast.success(res?.message ?? "SuccessFull!");
             setLGoalsAns([]);
         }).catch(err => {
             console.log('err', err.message);
         })
     }


    const handlePostReview = (e) => {
        e.preventDefault();  
        if(!review) {
        return toast.error("Please Write Something!")
        }  

        var formData = new FormData(); 
        formData.append('user_id',auth?.user_id);
        formData.append('tutor_id',currentMentor?.id ?? '');
        formData.append('review',review,);
        formData.append('rating',rating,);
        formData.append('status',"1");
        
        postReview(formData).then(res => {
            toast.success(res?.message ?? "Review posted successfully")
            setModal1(false)
            setreview('');
            setRating(1);
        }).catch(err => {
            console.log("err", err.message);
            toast.error(err?.message ?? "something went Wrong!")
        })
    } 


    useEffect(() => {
        handleMyPrograms();
        fetchGoals(); 
    }, [])

    const toggle = (tab) => {
        if (currentActiveTab !== tab) {
            setCurrentActiveTab(tab);
        }
        // if (tab === '1') {
        //     setShowPopup(true);
        // } else {
        //     setShowPopup(false);
        // }
    };

    const togglePopup1 = () => {
        setModal1(!modal1);
        // setShowPopup1(false);
    };

    const togglePopup = () => {
        setModal(!modal);
        // setShowPopup(false);
    }; 


    return (<>
        <Meta title={'My Program'} />
        <section className="section-b-space h-100vh">
            {/* <DashboardNavbar /> */}
            <Row className='h-100 custome_heifht'>
                <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
                    <div className='col-xl-9 d-flex justify-content-center'>
                        <SideBar></SideBar>
                    </div>
                </Col>

                <Col lg="9" className='px-xl-4 py-4 scrol_right h-100'>
                    <Col xl="11" className='h-100'>
                        {
                            loading ?
                                <div className='pageLoading'>
                                    <span
                                        className={cn(
                                            'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                                        )}
                                    >
                                        <span className={"loading"} />
                                    </span>
                                </div>
                                :
                                myPrograms.length > 0 ?
                                    <div className='h-100'>
                                        <h2 className='mb-4'>My Programs</h2>
                                        <div className='tab_my_program'>
                                            <Nav tabs className="mt-xl-5 mt-lg-4 mt-3 ">
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active:
                                                                currentActiveTab === '1'
                                                        })}
                                                        onClick={() => { toggle('1'); setCurrentStatsus('no') }}
                                                    >
                                                        Current
                                                    </NavLink>
                                                </NavItem>

                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({
                                                            active:
                                                                currentActiveTab === '2'
                                                        })}
                                                        onClick={() => { toggle('2'); setCurrentStatsus('yes') }}
                                                    >
                                                        Past
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>

                                            <Modal className='cutome_popup ' isOpen={modal1} toggle={togglePopup1} centered={true}  {...args}>
                                                <ModalBody className='p-4 '> 
                                                <form onSubmit={handlePostReview}>
                                                    <div className='px-2 position-relative'>
                                                        <h2 className='text-center mt-3 fw-bold'>Review your mentor</h2>
                                                        
                                                        <div className='pt-3'>
                                                            <div className="form-group">
                                                                <Label className="form-label fw-600" for="Mname">Mentor Name</Label>
                                                                <div className="input-container"><Input type="text"  readOnly={true} disabled value={currentMentor?.first_name ?? ''} className="form-control" id="Mname" placeholder="" required="" /></div>
                                                            </div>

                                                            <div className="form-group">
                                                                <Label className="form-label fw-600" htmlFor="rating">  Select the star rating  </Label>
                                                                <div className='d-flex align-items-center mb-3 mb-xl-4'>
                                                                    {rating > 0 ? <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(1)} /> :
                                                                        <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(1)} />
                                                                    }
                                                                    {rating > 1 ? <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(2)} /> :
                                                                        <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(2)} />
                                                                    }
                                                                    {rating > 2 ? <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(3)} /> :
                                                                        <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(3)} />
                                                                    }
                                                                    {rating > 3 ? <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(4)} /> :
                                                                        <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(4)} />
                                                                    }
                                                                    {rating > 4 ? <img src={`/assets/images/homepg/icons/__star.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(5)} /> :
                                                                        <img src={`/assets/images/homepg/icons/graystar.png`} alt="" className="me-2 me-lg-3 start-icon-big" onClick={() => setRating(5)} />
                                                                    }
                                                                </div>
                                                            </div>

                                                            <div className="form-group">
                                                                <Label className="form-label fw-600" htmlFor="dws">Write a review</Label>
                                                                <div className="input-container">
                                                                    <textarea 
                                                                        id='dws'
                                                                        className="form-control"
                                                                        placeholder="Type here.."
                                                                        value={review}
                                                                        onChange={(e)=> setreview(e.target.value)}
                                                                        rows={8} // Adjust the number of columns as needed
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='d-flex justify-content-center'><button type='submit' className='btn_theme py-3 px-5 mb-lg-4 mb-3 mt-3'>Submit</button></div>
                                                        <div className="model_close_icon" onClick={togglePopup1}> <img src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /> </div>
                                                    </div>
                                                </form>
                                                </ModalBody>
                                            </Modal>

                                            <Modal className='cutome_popup ' isOpen={modal} toggle={togglePopup} centered={true}  {...args}>
                                                <ModalBody className='p-4 '>
                                                    <div className='px-2 position-relative'>
                                                        <h2 className='text-center mt-3 fw-bold'>{auth?.first_name ?? ''}</h2>
                                                        <h3 className='text-center fw-bold'>I'd like to know more about you...</h3>

                                                        <form onSubmit={postGoalAnswser}>
                                                            <div className='pt-3'>
                                                                {
                                                                    LGoals?.map((data, i) => (
                                                                        <div className="form-group" key={i}>
                                                                        <Label className="form-label fw-600" htmlFor={`text122&${i}`}>{data?.questions ?? ''}</Label>
                                                                        <div className="input-container"><Input type="text" className="form-control" onChange={(e) =>         
                                                                            setLGoalsAns((p) => { 
                                                                                const val = [...p]  
                                                                                if (!val[i]) {
                                                                                    val[i] = {} ; // Create inner array if not exists
                                                                                }
                                                                                val[i].id = data?.id
                                                                                val[i].ans = e.target.value 
                                                                                return val; 
                                                                            })} id={`text122${i}`}placeholder="Type your answer" required="" /></div>
                                                                    </div>
                                                                    )) 
                                                                }

                                                                {/* <div className="form-group">
                                                                    <Label className="form-label fw-600" htmlFor='text12678'>Are there any specific topics or areas you'd like to avoid in your mentorship discussions?</Label>
                                                                    <div className="input-container"><Input type="text" className="form-control" id="text12678" placeholder="Type your answer" required="" /></div>
                                                                </div> */}
                                                            </div>

                                                        <div className='d-flex justify-content-center'><button type='submit' className='btn_theme py-3 px-5 mb-lg-4 mb-3 mt-3 '>Submit</button></div>
                                                        
                                                        </form>

                                                        <div className="model_close_icon" onClick={togglePopup}> <img src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /> </div>
                                                    </div>

                                                </ModalBody>
                                            </Modal>

                                            <TabContent activeTab={currentActiveTab}>
                                                <TabPane tabId={currentActiveTab}>
                                                    {
                                                        myPrograms?.filter(e => e.past == currentStatus)?.length > 0 ?
                                                            <Row className='my-4 '>
                                                                {
                                                                    myPrograms?.filter(e => e.past == currentStatus)?.map((data, index) => (
                                                                        <Col xxl="4" md="6" className='mb-3' key={index}>
                                                                            <div className='box_empty'>
                                                                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                                    {currentStatus == "yes" ? <button className='Completed text-truncate'>Completed</button> : <button className='ongoing'>Ongoing</button>} <h5 className='text-gray one_line fw-bold mb-0'>{data?.valid_until}</h5>
                                                                                </div>

                                                                                <div className='d-flex align-items-center mb-3'>
                                                                                    <img src={data?.tutor_basic_details?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/UserProfile.png"} alt="" className="list_img_gd_11 me-2" />
                                                                                    <p className='mb-0 one_line'>{data?.tutor_basic_details?.first_name ?? ""}</p>
                                                                                </div>
                                                                                <h5 className='text-dark fw-bold'>{data?.title}</h5>
                                                                                {
                                                                                    currentStatus == "yes" ?
                                                                                        <div className='d-flex justify-content-end'><button className='btn_theme px-3 py-2 ' onClick={()=> {togglePopup1(); setcurrentMentor(data?.tutor_basic_details)}}>Review your mentor</button></div> :
                                                                                        <div className='d-flex'> <button className='btn_learn_goal px-1 py-2 w-50 me-2' onClick={()=> {togglePopup(); setSession(data)}}>Learning Goals</button> <Link to={'/sessions'} state={{ id: data?.id, program: data?.title, mentor: data?.tutor_basic_details?.id }} className='w-50'><button className='btn_theme px-1 py-2 w-100'>View Session</button></Link></div>
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                    ))
                                                                }

                                                                {/* <Col xxl="4" md="6" className='mb-3'>
                                                                            <div className='box_empty'>
                                                                                <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                                    <button className='extended'>Extended</button> <h5 className='text-gray fw-bold mb-0'>Valid until 3 Mar</h5>
                                                                                </div>
                                                                                <div className='d-flex align-items-center mb-3'>
                                                                                    <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                                    <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                                </div>
                                                                                <h5 className='text-dark fw-bold'>Admission Strategy</h5>

                                                                                <div className='d-flex'> <button className='btn_learn_goal px-1 py-2 w-50 me-2' onClick={togglePopup}>Learning Goals</button> <Link to={'/sessions'} className='w-50'><button className='btn_theme px-1 py-2 w-100'>View Session</button></Link></div>

                                                                            </div>
                                                                        </Col>*/}
                                                            </Row> :
                                                            <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                                                <img src='/assets/nodata.png' className='w-50' />
                                                            </div>
                                                    }
                                                </TabPane>

                                                {/* <TabPane tabId="2">
                                                    <Row className='my-4 '>
                                                        <Col xxl="4" md="6" className='mb-3'>
                                                                    <div className='box_empty'>
                                                                        <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                            <button className='Completed'>Completed</button> <h5 className='text-gray fw-bold mb-0'>Valid until 20 Dec</h5>
                                                                        </div>
                                                                        <div className='d-flex align-items-center mb-3'>
                                                                            <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                            <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                        </div>
                                                                        <h5 className='text-dark fw-bold'>Admission Strategy</h5>

                                                                        <div className='d-flex justify-content-end'><button className='btn_theme px-3 py-2 ' onClick={togglePopup1}>Review your mentor</button></div>

                                                                    </div>
                                                                </Col>

                                                        <Col xxl="4" md="6" className='mb-3'>
                                                                        <div className='box_empty'>
                                                                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                                                                <button className='under_review'>Refunded</button> <h5 className='text-gray fw-bold mb-0'>Valid until 20 Dec</h5>
                                                                            </div>
                                                                            <div className='d-flex align-items-center mb-3'>
                                                                                <img src="/assets/images/UserProfile.png" alt="" className="list_img_gd_11 me-2" />
                                                                                <p className='mb-0'>Vignesh Anbazhagan</p>
                                                                            </div>
                                                                            <h5 className='text-dark fw-bold'>Career Guidance</h5>

                                                                            <div className='d-flex justify-content-end'><button className='btn_theme px-3 py-2 ' onClick={togglePopup1}>Review your mentor</button></div>

                                                                        </div>
                                                                    </Col>  
                                                        <Col sm='12'>
                                                            <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                                                <img src='/assets/nodata.png' className='w-100' />
                                                            </div>
                                                        </Col>


                                                    </Row>
                                                </TabPane> */}
                                            </TabContent>
                                        </div>
                                    </div>
                                    :
                                    <div className='h-100'>
                                        <h2 className='mb-4'>My Programs</h2>
                                        <div className='text-center my-3 box_empty'>
                                            <h3 className='mb-3 text-center pt-4'>No Programs Yet</h3>
                                            <p className='mb-3 text-center'>As soon as you find a suitable Mentor and book your first Session, you'll see it here</p>
                                            <Link to={'/mentor'}>
                                                <button onMouseOver={() => document.getElementById('imagehoverChange').src = "/assets/images/menteedashBoard/__gray search.png"} onMouseOut={() => document.getElementById('imagehoverChange').src = "/assets/images/menteedashBoard/__white Search.png"} className='btn_theme px-3 py-2 mb-4'>  <img id='imagehoverChange' src={`/assets/images/menteedashBoard/__white Search.png`} alt="" className="search_img me-2" /> Find a mentor</button>
                                            </Link>
                                        </div>
                                    </div>
                        }
                    </Col>
                </Col>
            </Row>
        </section>
    </>
    )
}

export default MyProgram