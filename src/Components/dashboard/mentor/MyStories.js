import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import PropTypes from 'prop-types';
import { deleteStories, myStoriesList } from './request';
import { useAuth } from '../../Auth/core/Auth';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import "primereact/resources/themes/lara-light-cyan/theme.css";
import toast from 'react-hot-toast';
import Meta from '../../../services/Meta';



const MyStories = ({ direction, ...args }) => {

    const [loading, setLoading] = useState(false)
    const [Stories, setStories] = useState([])
    const { auth } = useAuth();

    const [visible, setVisible] = useState(false);
    const [currentStoryID, setCurrentStoryID] = useState('');

    const reject = () => {

    }

    const router = useNavigate();

    function formatUnixTimestamp(unixTimestamp) {
        const milliseconds = unixTimestamp * 1000;
        const date = new Date(milliseconds);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate;
    }


    const fetchStories = () => {
        setLoading(true)
        const id = auth?.user_id;
        myStoriesList(id).then(res => {
            setLoading(false)
            setStories(res.data)
        }).catch(err => {
            setLoading(false)
        })
    }

    const accept = () => {
        DeleteStories(currentStoryID)
    }

    const DeleteStories = (id) => {
        deleteStories(id).then(res => {
            fetchStories()
            toast.success('Removed Successfull');
        }).catch(err => console.log("err", err.message))
    }

    useEffect(() => {
        fetchStories()
    }, [])


    return (
        <> 
    <Meta title={'My Stories'}  />

            <ConfirmDialog group="declarative" visible={visible} acceptClassName='p-button-danger rounded' rejectClassName='primeBtn rounded me-2' onHide={() => setVisible(false)} message="Do you want to delete this story?"
                header="Delete Confirmation" icon="fa fs-5 text-danger fa-exclamation-triangle" accept={accept} reject={reject} />
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
                            loading ?
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
                                        <div className='d-flex align-items-center justify-content-between'>
                                            <div className=''>
                                                <h2>My Stories</h2>
                                                <p>What are you waiting for? Share your thoughts, experiences and expertise with your audience</p>
                                            </div>
                                            <Link to={'/story-form'}><button className='text-nowrap px-2 p-1 btn_theme'>Add New Story</button></Link>
                                        </div>
                                        {
                                            Stories?.length > 0 ?
                                                <Row>
                                                    {
                                                        Stories?.map((data, i) => (
                                                            <Col md="6" xl="4" key={i} className='mb-3'>
                                                                <div className="inner_stories custome_cad m-0">
                                                                    <h5 className="mb-1 fw-bold one_line">{data?.title}</h5>
                                                                    <div className="d-flex align-items-center mb-3">
                                                                        <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                                                        <p className="mb-0">{formatUnixTimestamp(data?.added_date)}</p>
                                                                    </div>
                                                                    <img src={data?.banner} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="image_stories mb-3" />
                                                                    <div className='d-flex align-items-center justify-content-end'>
                                                                        <div onClick={() => router('/story-form', { state: { id: data?.blog_id } })} className='edit_btn ms-2'> <img src="/assets/images/Icons/10.png" alt="" className="me-3 testimonial-user" /></div>
                                                                        <div onClick={() => { setVisible(true); setCurrentStoryID(data?.blog_id) }} className='edit_btn ms-2' > <img src="/assets/images/Icons/11.png" alt="" className="me-3 testimonial-user" /></div>
                                                                        <div onClick={() => router('/stories_detail', { state: { id: data?.blog_id } })} className='edit_btn ms-2'> <img src="/assets/images/Icons/12.png" alt="" className="me-3 testimonial-user" /></div>
                                                                    </div>
                                                                </div>
                                                            </Col>
                                                        ))
                                                    }
                                                    {/* <Col md="6" xl="4" className='mb-3'>
                                                            <div className="inner_stories custome_cad m-0">
                                                                <h5 className="mb-1 fw-bold">How to Prepare for Exams: A Step-by-Step Guide by EXPRTO Mentors</h5>
                                                                <div className="d-flex align-items-center mb-3">
                                                                    <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                                                    <p className="mb-0">08 Nov 2023</p>
                                                                </div>
                                                                <img src={`/assets/images/homepg/stories/story1.jpg`} alt="" className="image_stories mb-3" />
                                                                <div className='d-flex align-items-center justify-content-end'>
                                                                    <div className='edit_btn ms-2'> <img src="/assets/images/Icons/10.png" alt="" className="me-3 testimonial-user" /></div>
                                                                    <div className='edit_btn ms-2'> <img src="/assets/images/Icons/11.png" alt="" className="me-3 testimonial-user" /></div>
                                                                    <div className='edit_btn ms-2'> <img src="/assets/images/Icons/12.png" alt="" className="me-3 testimonial-user" /></div>
                                                                </div>
                                                            </div>
                                                        </Col> */}
                                                </Row> :
                                                <div className='d-flex justify-content-center align-items-center'>
                                                    <img src='/assets/nodata.png' className='w-50 noimgradius' />
                                                </div>
                                        }
                                    </div>
                                </Col>
                        }
                    </Col>
                </Row>
            </section>
        </>
    )
}

export default MyStories