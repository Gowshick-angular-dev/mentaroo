import React, { useState, useEffect, forwardRef } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import PropTypes from 'prop-types';
// import { Editor } from 'primereact/editor';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { getPrograms } from '../../pages/core/_request';
import { getPackages } from '../../Auth/core/Auth_request';
import Meta from '../../../services/Meta';
import * as XLSX from 'xlsx';
import { getPayoutRevenu, getWabinar, postWebinar } from './request';
import moment from 'moment';
import toast from 'react-hot-toast';
import { useAuth } from '../../Auth/core/Auth';


const Payout = ({ direction, ...args }) => {

    const [startdate, setStartDate] = useState()
    const [enddate, setEndDate] = useState()
    const [webdate, setWebDate] = useState()
    const [webtime, setWebtime] = useState()
    const [offered, setOffered] = useState()
    const [plan, setPlan] = useState()
    const [url, setUrl] = useState('')
    const [title, setTitle] = useState('')
    const [program, setProgram] = useState([])
    const [packages, setPackages] = useState([])

    const {auth} = useAuth() 

    const fetchPrograms = async () => {
        getPrograms().then(res => {
            setProgram(res.data);
            
        }).catch(e => {
            console.log(e)
        })
    }   

    const createDateWithTime = (timeStr) => {
        const [hours, minutes, seconds] = timeStr.split(':');
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date;
      };
      

    useEffect(()=> {
        getWabinar(auth?.user_id).then(res => {
            setTitle(res?.data?.text);
            setUrl(res?.data?.url)
            setWebDate(res?.data?.date)
            setWebtime(createDateWithTime(res?.data?.time))
        }).catch(err => {
            console.log('err',err.message);
            
        })
    },[auth?.user_id])

    const handlePostWebinar = (e) => { 
        e.preventDefault();
        const start = moment(webdate, "dd/MM/yyyy").format('DD-MM-yyyy')
        const time = moment(webtime).format('hh:mm A')
        var body = new FormData(); 
        body.append('text',title)
        body.append('date',webdate)
        body.append('time',time)
        body.append('url',url)
        body.append('tutor_id',auth?.user_id)
        postWebinar(body).then(res => {
            toast.success(res?.message)
        }).catch(err => {
            console.log('err',err.message)
        })
    }

    const fetchPackeges = async () => {
        getPackages().then(res => {
            setPackages(res)
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        if (Boolean(!startdate)) {
            setEndDate()
        }
    }, [startdate])

    useEffect(() => {
        fetchPrograms();
        fetchPackeges();
    }, []) 

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

    const handleReport = (event) => {
        event.preventDefault()
        const start = moment(startdate, "dd/MM/yyyy").format('DD-MM-yyyy')
        const end = moment(enddate, "dd/MM/yyyy").format('DD-MM-yyyy')
        getPayoutRevenu(start, end, offered?.id, plan?.id).then(res => {
            if(res?.data?.length) {
                const workbook = XLSX.utils.book_new(); 
                let sheetData = []; 
                  res?.data?.map((elem,i) => {
                      sheetData.push({ "SNO":i+1, "Title": elem?.title , "Amount" : elem?.price, "Booking Date" : formatUnixTimestamp(elem?.date_added)  })
                  })    
                const sheet = XLSX.utils.json_to_sheet(sheetData);
                XLSX.utils.book_append_sheet(workbook, sheet, 'Revenue-Report');    
                XLSX.writeFile(workbook, 'Revenue-Report.xlsx');
            }else {
                toast.error('No Data Found!')
            }
        }).catch(err => {
            console.log("err",err.message);
        })
    }

    const CustomDateinput = forwardRef(({ disable, ids, date, value, onClick }, ref) => {
        return <div className="input-container w-100" onClick={onClick} ref={ref}>
            <Input type="text" value={value} readOnly={true} className="form-control" disabled={disable} id={ids} placeholder="Select Date" required="" />
            <img src={`/assets/images/__Calender gray.png`} alt="calender" onClick={onClick} className="" />
        </div>
    })  


    

    return (<>
        <Meta title={'Payout'}  />
        <section className="section-b-space h-100vh">
            {/* <DashboardNavbar /> */}
            <Row className='h-100 custome_heifht'>
                <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
                    <div className='col-xl-9 d-flex justify-content-center'>
                        <SideBar></SideBar>
                    </div>
                </Col>

                <Col lg="9" className='px-xl-4 py-4 scrol_right h-100'> 
                   
                    <Col xl="11" className='h-100 '>
                        <div className=' mb-4'>
                            <h2>Download Revenue Report</h2>
                            <div className='d-flex align-items-center'>
                                <p className='fw-bold me-3 text-dark'>• Personal bookkeeping</p>
                                <p className='fw-bold text-dark'>• Tax returns</p>
                            </div>

                            <form onSubmit={handleReport}>
                                <div className='custome_cad p-4 border_dathfh'>
                                    <Row>
                                        <Col md="6" xl="3">
                                            <div className="form-group">
                                                <Label className="form-label" for="s_date">
                                                    Start Date
                                                </Label>
                                                <div className="custome_dripo payout_s">
                                                    <DatePicker selected={startdate} className="p-2 rounded-5 w-100" onChange={(date) => setStartDate(date)} dateFormat="dd/MM/yyyy" customInput={<CustomDateinput ids={'s_date'} />} isClearable={true} />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md="6" xl="3">
                                            <div className="form-group">
                                                <Label className="form-label" for="e_date">
                                                    End Date
                                                </Label>
                                                <div className="custome_dripo payout_s">
                                                    <DatePicker selected={enddate} minDate={startdate} disabled={Boolean(!startdate)} className="p-2 rounded-5 w-100" onChange={(date) => setEndDate(date)} dateFormat="dd/MM/yyyy" id='e_date' customInput={<CustomDateinput disable={Boolean(!startdate)} ids={'e_date'} />} isClearable={true} />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md="6" xl="3">
                                            <div className="form-group custome_dripo mb-3">
                                                <Label className="form-label" htmlFor="Offered">
                                                    Program Offered
                                                </Label>
                                                <div className="custome_dripo payout_s">
                                                    <Select
                                                        isSearchable={false}
                                                        placeholder='All'
                                                        classNamePrefix="select"
                                                        inputId='Offered'
                                                        options={program}
                                                        getOptionLabel={(value) => value?.title}
                                                        getOptionValue={(value) => value?.id}
                                                        value={offered}
                                                        onChange={(e) => setOffered(e)}
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

                                        <Col md="6" xl="3">
                                            <div className="form-group custome_dripo mb-3">
                                                <Label className="form-label" htmlFor="plans">
                                                    Plan
                                                </Label>
                                                <div className="custome_dripo payout_s">
                                                    <Select
                                                        isSearchable={false}
                                                        placeholder='All'
                                                        classNamePrefix="select"
                                                        inputId='plans'
                                                        options={packages}
                                                        getOptionLabel={(value) => value?.package_name}
                                                        getOptionValue={(value) => value?.id}
                                                        value={plan}
                                                        onChange={(w) => setPlan(w)}
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
                                    <div className='d-flex align-items-center justify-content-start my-4'><button type='submit' className='border-0 btn_next me-3'>Download Report</button></div>
                                </div>
                            </form>

                        </div> 

                        <div className=' mb-3'>
                            <h2>Post Webinar</h2>
                            {/* <div className='d-flex align-items-center'>
                                <p className='fw-bold me-3 text-dark'>• Personal bookkeeping</p>
                                <p className='fw-bold text-dark'>• Tax returns</p>
                            </div> */}

                            <form onSubmit={handlePostWebinar}>
                                <div className='custome_cad p-4 border_dathfh'>
                                    <Row>
                                        <Col md="6" xl="3">
                                          <div className="form-group mb-3">
                                              <Label className="form-label" htmlFor="title1">Title</Label>
                                              <div className="input-container mb-1">
                                                <Input type="text" className="form-control" value={title}  id="title1" onChange={(e)=> setTitle(e.target.value)} placeholder="Enter Webinar Title" required="" />
                                              </div>
                                           </div>
                                        </Col>

                                        <Col md="6" xl="3">
                                            <div className="form-group">
                                                <Label className="form-label" for="w_date">
                                                    Date
                                                </Label>
                                                <div className="custome_dripo payout_s">
                                                    <DatePicker selected={webdate} minDate={new Date} className="p-2 rounded-5 w-100" onChange={(date) => setWebDate(date)} dateFormat="dd/MM/yyyy" id='w_date' customInput={<CustomDateinput  ids={'w_date'} />} isClearable={true} />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md="6" xl="3">
                                        <div className="form-group">
                                                <Label className="form-label" for="T_date">
                                                    Time
                                                </Label>
                                                <div className="custome_dripo payout_s">
                                                    <DatePicker selected={webtime}  timeIntervals={60}  showTimeSelectOnly showTimeSelect timeCaption="Time" dateFormat="h:mm aa" minDate={new Date} className="p-2 rounded-5 w-100" onChange={(date) => setWebtime(date)} id='t_date' customInput={<CustomDateinput  ids={'t_date'} />} isClearable={true} />
                                                </div>
                                            </div>
                                        </Col>

                                        <Col md="6" xl="3">
                                        <div className="form-group mb-3">
                                              <Label className="form-label" htmlFor="url">Webinar Url</Label>
                                              <div className="input-container mb-1">
                                                <Input type="text" value={url} className="form-control"  id="url" onChange={(e)=> setUrl(e.target.value)} placeholder="Enter Webinar Url" required="" />
                                              </div>
                                           </div>
                                        </Col>
                                    </Row>
                                    <div className='d-flex align-items-center justify-content-start my-4'><button type='submit' className='border-0 btn_next me-3'>Submit</button></div>
                                </div>
                            </form>

                        </div>
                    </Col> 

                </Col>

            </Row>
        </section>
    </>)
}

export default Payout