import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Label, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import toast from 'react-hot-toast';
import moment from 'moment';
import Select from 'react-select';
import { useAuth } from '../../Auth/core/Auth';
import { DeleteSchedule, PostSchedule, Updatechedule, getSchedule } from './request';
import cn from 'classnames';
import Meta from '../../../services/Meta';


const CalenderPage = ({ direction, ...args }) => {


  const [Timeintraval, setTimeintraval] = useState([])
  const [startTime, setstartTime] = useState()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(false)
  const [endTime, setEndtime] = useState()
  const [accountInfo, setAccountInfo] = useState(false);
  const [Slots, setSlots] = useState([])
  const [mondaySlot, setMondaySlot] = useState([])
  const [tuesdaySlot, setTuesdaySlot] = useState([])
  const [wednesdaySlot, setWednesdaySlot] = useState([])
  const [thurdaySlot, setthurdaySlot] = useState([])
  const [fridaySlot, setfridaySlot] = useState([])
  const [saturdaySlot, setsaturdaySlot] = useState([])
  const [sundaySlot, setsundaySlot] = useState([])
  const [available, setAvailable] = useState([]);


  const { auth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      var formData = new FormData();
      formData.append('tutor_id', auth.user_id);
      formData.append('trail', 0);
      // formData.append('available', 1);

      const daySlots = [mondaySlot, tuesdaySlot, wednesdaySlot, thurdaySlot, fridaySlot, sundaySlot, saturdaySlot].flat(Infinity)

      daySlots.map((d, i) => {
        formData.append(`id[${i}]`, d?.id ?? '')
        formData.append(`day[${i}]`, d?.day ?? '')
        formData.append(`start_time[${i}]`, d?.from ?? "");
        formData.append(`end_time[${i}]`, d?.to ?? ''); 
        formData.append(`available[${i}]`, d?.avail ?? '');
      })

      if (Slots?.length > 0) {
        // Slots.map((e, i) => formData.append(`id[${i}]`, e?.id))
        const response = await Updatechedule(auth.user_id, formData);
      } else {
        // const response = await PostSchedule(formData);
        const response = await Updatechedule(auth.user_id, formData);
      }
      toast.success("updated")
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }

  const intraval = JSON?.parse(localStorage.getItem('admin')).find(e => e?.key == 'class_time')?.value ?? 60

  const fetchTimeintrval = (intr) => {
    const startTime = new Date(0, 0, 0, 12, 0)
    const endTime = new Date(0, 0, 0, 24, 0)
    const intraval = intr > 60 ? 60 : intr < 1 ? 1 : intr;
    const currentTime = new Date(startTime)
    const value = []
    while (currentTime < endTime) {
      const slotTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      value.push({ 'label': slotTime, 'value': slotTime })
      currentTime.setMinutes(currentTime.getMinutes() + intraval)
    }
    setTimeintraval(value)
  } 

  const handleAddone = (date) => {
    

  }


  const handleRemove = (id) => {
    DeleteSchedule(id).then(res => {
      console.log("res", res.data)
    }).catch(err => {
      console.log("err", err.message)
    })
  }

  const fetchSlots = async () => {
    setPageLoading(true)
    const id = auth.user_id;
    getSchedule(id, 1).then(res => {
      setSlots(res?.data);
      if (res.data?.length > 0) {
        res.data.map((s, i) => {
          if (s?.day === "mon") {
            setMondaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          } else if (s?.day === "tue") {
            setTuesdaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          } else if (s?.day === "wed") {
            setWednesdaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          } else if (s?.day === "thu") {
            setthurdaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          } else if (s?.day === "fri") {
            setfridaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          } else if (s?.day === "sat") {
            setsaturdaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          } else if (s?.day === "sun") {
            setsundaySlot((p) => [...p, { "id": s?.id, "from": s?.start_time, "to": s?.end_time, "day": s?.day, "avail": s?.available }])
          }
        });
        if (!res.data.some(e => e?.day === "mon")) { setMondaySlot([{}]) };
        if (!res.data.some(e => e?.day === "tue")) { setTuesdaySlot([{}]) };
        if (!res.data.some(e => e?.day === "wed")) { setWednesdaySlot([{}]) };
        if (!res.data.some(e => e?.day === "thu")) { setthurdaySlot([{}]) };
        if (!res.data.some(e => e?.day === "fri")) { setfridaySlot([{}]) };
        if (!res.data.some(e => e?.day === "sat")) { setsaturdaySlot([{}]) };
        if (!res.data.some(e => e?.day === "sun")) { setsundaySlot([{}]) };
      } else {
        setMondaySlot([{}]);
        setTuesdaySlot([{}]);
        setWednesdaySlot([{}]);
        setthurdaySlot([{}]);
        setfridaySlot([{}]);
        setsaturdaySlot([{}]);
        setsundaySlot([{}]);      
      }
      setPageLoading(false)
    }).catch(err => {
      console.log("err");
      setPageLoading(false)
    })
  }

  useEffect(() => {
    fetchTimeintrval(parseInt(intraval));
    fetchSlots()
  }, [])



  return (
    <>
    <Meta title={'Calender'}  />
        <section className="section-b-space h-100vh">
          {/* <DashboardNavbar /> */}
          <Row className='h-100 custome_heifht'>
            <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
              <div className='col-xl-9 d-flex justify-content-center'>
                <SideBar></SideBar>
              </div>
            </Col>
            
            <Col lg="9" className='px-xl-4 py-4 scrol_right'>
              <Col xl="11">
                {
                  pageLoading ?
                    <div className='pageLoading'>
                      <span
                        className={cn(
                          'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                        )}
                      >
                        <span className={"loading"} />
                      </span>
                    </div> :
                    <div className='calender_pg '>
                      <h2>Set up your available slots</h2>
                      <p>to start offering your services to mentees.</p>
                      <form onSubmit={handleSubmit}>
                        <div className='custome_cad p-4'>
                          <div className=' align-items-start d-none  calender_tbgl col-xl-8 col-10 me-2 mb-3'>
                            <div className='d-flex align-items-center me-3 mb-md-0 mb-3  mb-md-0 mb-3'>
                              <input type="checkbox" id="switch6" className="checkbox" />
                              <label htmlFor="switch6" className="toggle me-3" />
                              <h5 className='fw-600 mb-0'>SUN</h5>
                            </div>
                            <div className='unavailable_bg'>Unavailable</div>
                          </div>

                          {
                            sundaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width  align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch100" checked={data?.avail == 1 ? true : false} onChange={(e) => setsundaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch100" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>SUN</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>
                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setsundaySlot((p) =>
                                                 { const day = [...p];
                                                   const ind = Timeintraval.findIndex(v => v?.value == e.value)  
                                                   day[index].from = e.value;
                                                   day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                   day[index].day = "sun"; 
                                                   return day })}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => sundaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              isDisabled
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setsundaySlot((p) => 
                                                { const arr = [...p]; 
                                                  arr[index].to = e.value;
                                                  return arr })}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || sundaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>

                                    <div className='delete_icon ms-2 mb-2' onClick={() => {
                                      index != 0 && setsundaySlot((p) => { return p.filter((a, i) => i != index) });
                                      index != 0 && data?.id && handleRemove(data?.id)
                                    }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>

                                {
                                  (sundaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setsundaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          {
                            mondaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width  align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch1" checked={data?.avail == 1 ? true : false} onChange={(e) => setMondaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch1" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>MON</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>
                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setMondaySlot((p) => { 
                                                 const day = [...p];
                                                 const ind = Timeintraval.findIndex(v => v?.value == e.value)  
                                                 day[index].from = e.value; 
                                                 day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                  day[index].day = "mon"; return day })}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => mondaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              isDisabled
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setMondaySlot((p) => { const arr = [...p]; arr[index].to = e.value; return arr })}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || mondaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>

                                    <div className='delete_icon ms-2 mb-2' onClick={() => {
                                      index != 0 && setMondaySlot((p) => { return p.filter((a, i) => i != index) });
                                      index != 0 && data?.id && handleRemove(data?.id)
                                    }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>
                                {
                                  (mondaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setMondaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          <div className='d-flex align-items-end justify-content-md-between mb-3 d-none'>
                            <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2'>
                              <div className='d-flex align-items-center me-3 mb-md-0 mb-3'>
                                <input type="checkbox" id="switch22" className="checkbox" />
                                <label htmlFor="switch22" className="toggle me-3" />
                                <h5 className='fw-600 mb-0'>TUE</h5>
                              </div>
                              <div className='d-flex align-items-end w-100'>
                                <Row className='w-100 me-2'>
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo w-100">
                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          // onChange={(e) => setstartTime(e)}
                                          onChange={(e) => { setTuesdaySlot((p) => { const day = [...p]; day[0].from = e.value; return day }); setstartTime(e) }}
                                          // value={startTime}
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

                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo  w-100">
                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          onChange={(e) => setTuesdaySlot((p) => { const arr = [...p]; arr[0].to = e.value; return arr })}
                                          isOptionDisabled={(e) => e.value === startTime?.value || moment(e.value, 'h:mm A') < moment(startTime?.value, 'h:mm A')}
                                          theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                              ...theme.colors,
                                              primary25: '#f4f7f7',
                                              primary: '#125453',
                                              primary50: '#f4f7f7'
                                            }
                                          })}
                                        />
                                      </div>
                                    </div>
                                  </Col>
                                </Row>

                                <div className='delete_icon ms-2 mb-2'>
                                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </div>
                              </div>
                            </div>
                            {
                              !tuesdaySlot?.length > 0 &&
                              <div className='deletr_icob' role='button' onClick={() => setTuesdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                              </div>
                            }
                          </div>

                          {
                            tuesdaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch11" checked={data?.avail == 1 ? true : false} onChange={(e) => setTuesdaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch11" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>TUE</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>
                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setTuesdaySlot((p) => { 
                                                const day = [...p];
                                                const ind = Timeintraval.findIndex(v => v?.value == e.value);
                                                day[index].from = e.value;
                                                day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                day[index].day = "tue"; return day })}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => tuesdaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              isDisabled
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setTuesdaySlot((p) => { const arr = [...p]; arr[index].to = e.value; return arr })}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || tuesdaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>

                                        </div>
                                      </Col>

                                    </Row>
                                    <div className='delete_icon ms-2 mb-2' onClick={() => { index != 0 && setTuesdaySlot((p) => { return p.filter((a, i) => i != index) }); index != 0 && data?.id && handleRemove(data?.id) }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>
                                {
                                  (tuesdaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setTuesdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          <div className='d-flex align-items-end justify-content-md-between mb-3 d-none'>
                            <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                              <div className='d-flex align-items-center me-3 mb-md-0 mb-3 '>
                                <input type="checkbox" id="switch2" className="checkbox" />
                                <label htmlFor="switch2" className="toggle me-3" />
                                <h5 className='fw-600 mb-0'>WED</h5>
                              </div>
                              <div className='d-flex align-items-end w-100'>
                                <Row className='w-100 me-2'>
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo w-100">
                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          onChange={(e) => setstartTime(e)}
                                          // value={startTime}
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
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo  w-100">

                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          isOptionDisabled={(e) => e.value === startTime?.value || moment(e.value, 'h:mm A') < moment(startTime?.value, 'h:mm A')}
                                          theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                              ...theme.colors,
                                              primary25: '#f4f7f7',
                                              primary: '#125453',
                                              primary50: '#f4f7f7'
                                            }
                                          })}
                                        />
                                      </div>

                                    </div>
                                  </Col>

                                </Row>
                                <div className='delete_icon ms-2 mb-2'>
                                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </div>
                              </div>
                            </div>
                            {
                              !wednesdaySlot?.length > 0 &&
                              <div className='deletr_icob' role='button' onClick={() => setWednesdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                              </div>
                            }
                          </div>

                          {
                            wednesdaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch144" checked={data?.avail == 1 ? true : false} onChange={(e) => setWednesdaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch144" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>WED</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>
                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setWednesdaySlot((p) => { 
                                                const day = [...p]; 
                                                const ind = Timeintraval.findIndex(v => v?.value == e.value);
                                                day[index].from = e.value; 
                                                day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                day[index].day = "wed"; return day })}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => wednesdaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              isDisabled
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => { setWednesdaySlot((p) => { const arr = [...p]; arr[index].to = e.value; return arr }) }}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || wednesdaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>

                                        </div>
                                      </Col>

                                    </Row>
                                    <div className='delete_icon ms-2 mb-2' onClick={() => { index != 0 && setWednesdaySlot((p) => { return p.filter((a, i) => i != index) }); index != 0 && data?.id && handleRemove(data?.id) }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>
                                {
                                  (wednesdaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setWednesdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          <div className='d-flex align-items-end justify-content-md-between mb-3 d-none'>
                            <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                              <div className='d-flex align-items-center me-3 mb-md-0 mb-3 '>
                                <input type="checkbox" id="switch13" className="checkbox" />
                                <label htmlFor="switch13" className="toggle me-3" />
                                <h5 className='fw-600 mb-0'>THU</h5>
                              </div>
                              <div className='d-flex align-items-end w-100'>
                                <Row className='w-100 me-2'>
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo w-100">

                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          onChange={(e) => setstartTime(e)}
                                          // value={startTime}
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
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo  w-100">

                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          isOptionDisabled={(e) => e.value === startTime?.value || moment(e.value, 'h:mm A') < moment(startTime?.value, 'h:mm A')}
                                          theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                              ...theme.colors,
                                              primary25: '#f4f7f7',
                                              primary: '#125453',
                                              primary50: '#f4f7f7'
                                            }
                                          })}
                                        />
                                      </div>

                                    </div>
                                  </Col>

                                </Row>
                                <div className='delete_icon ms-2 mb-2'>
                                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </div>
                              </div>
                            </div>
                            {
                              !thurdaySlot?.length > 0 &&
                              <div className='deletr_icob' onClick={() => setthurdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                              </div>
                            }
                          </div>

                          {
                            thurdaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch464361" checked={data?.avail == 1 ? true : false} onChange={(e) => setthurdaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch464361" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>THU</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>

                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => { setthurdaySlot((p) => { 
                                                const day = [...p]; 
                                                const ind = Timeintraval.findIndex(v => v?.value == e.value)  
                                                day[index].from = e.value; 
                                                day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                day[index].day = "thu"; return day }) }}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => thurdaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              isDisabled
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setthurdaySlot((p) => { const arr = [...p]; arr[index].to = e.value; return arr })}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || thurdaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>
                                    <div className='delete_icon ms-2 mb-2' onClick={() => { index != 0 && setthurdaySlot((p) => { return p.filter((a, i) => i != index) }); index != 0 && data?.id && handleRemove(data?.id) }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>
                                {
                                  (thurdaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setthurdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          <div className='d-flex align-items-end justify-content-md-between mb-3 d-none'>
                            <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                              <div className='d-flex align-items-center me-3 mb-md-0 mb-3 '>
                                <input type="checkbox" id="switch41" className="checkbox" />
                                <label htmlFor="switch41" className="toggle me-3" />
                                <h5 className='fw-600 mb-0'>FRI</h5>
                              </div>
                              <div className='d-flex align-items-end w-100 ms-md-2'>
                                <Row className='w-100 me-2'>
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo w-100">

                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          onChange={(e) => setstartTime(e)}
                                          // value={startTime}
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
                                  <Col xs="6" className="mb-2">
                                    <div className="form-group custome_dripo  w-100">

                                      <div className="custome_dripo w-100">
                                        <Select
                                          isSearchable={false}
                                          placeholder='select'
                                          classNamePrefix="select"
                                          className='fs-6'
                                          options={Timeintraval}
                                          isOptionDisabled={(e) => e.value === startTime?.value || moment(e.value, 'h:mm A') < moment(startTime?.value, 'h:mm A')}
                                          theme={(theme) => ({
                                            ...theme,
                                            colors: {
                                              ...theme.colors,
                                              primary25: '#f4f7f7',
                                              primary: '#125453',
                                              primary50: '#f4f7f7'
                                            }
                                          })}
                                        />
                                      </div>

                                    </div>
                                  </Col>

                                </Row>
                                <div className='delete_icon ms-2 mb-2'>
                                  <i className="fa fa-trash-o" aria-hidden="true"></i>
                                </div>
                              </div>
                            </div>
                            {
                              !fridaySlot?.length > 0 &&
                              <div className='deletr_icob' role='button' onClick={() => setfridaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                              </div>
                            }
                          </div>

                          {
                            fridaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch1fgh" checked={data?.avail == 1 ? true : false} onChange={(e) => setfridaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch1fgh" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>FRI</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>
                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setfridaySlot((p) => { 
                                                const day = [...p]; 
                                                const ind = Timeintraval.findIndex(v => v?.value == e.value)  
                                                day[index].from = e.value; 
                                                day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                day[index].day = "fri";
                                                return day })}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => fridaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              isDisabled
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setfridaySlot((p) => { const arr = [...p]; arr[index].to = e.value; return arr })}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || fridaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>

                                        </div>
                                      </Col>
                                    </Row>
                                    <div className='delete_icon ms-2 mb-2' onClick={() => { index != 0 && setfridaySlot((p) => { return p.filter((a, i) => i != index) }); index != 0 && data?.id && handleRemove(data?.id) }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>
                                {
                                  (fridaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setfridaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          {
                            saturdaySlot?.map((data, index) => (
                              <div className='d-flex align-items-end justify-content-md-between mb-3' key={index}>
                                <div className='d-md-flex align-items-start  calender_tbgl col-xl-8 col-10 me-2 '>
                                  <div className={`d-flex ${index == 0 ? '' : 'invisible'} cal_width align-items-center me-3 mb-md-0 mb-3`}>
                                    <input type="checkbox" id="switch1fghdfkfjd" checked={data?.avail == 1 ? true : false} onChange={(e) => setsaturdaySlot((p) => { const day = p.map(r => ({ ...r, avail: e.target.checked ? 1 : 0 })); return day })} className="checkbox" />
                                    <label htmlFor="switch1fghdfkfjd" className="toggle me-3" />
                                    <h5 className='fw-600 mb-0'>SAT</h5>
                                  </div>
                                  <div className='d-flex align-items-end w-100'>

                                    <Row className='w-100 me-2'>
                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              onChange={(e) => setsaturdaySlot((p) => { 
                                                const day = [...p]; 
                                                const ind = Timeintraval.findIndex(v => v?.value == e.value)  
                                                day[index].from = e.value; 
                                                day[index].to = ind+1 == Timeintraval?.length ? Timeintraval[0]?.value :  Timeintraval[ind+1]?.value;
                                                day[index].day = "sat"; return day })}
                                              value={Timeintraval.find(e => e.value == data?.from)}
                                              isOptionDisabled={(e) => saturdaySlot.find(p => p.from === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>

                                      <Col xs="6" className="mb-2">
                                        <div className="form-group custome_dripo  w-100">
                                          <div className="custome_dripo w-100">
                                            <Select
                                              isSearchable={false}
                                              placeholder='select'
                                              isDisabled
                                              classNamePrefix="select"
                                              className='fs-6'
                                              options={Timeintraval}
                                              // isDisabled={!data?.from}
                                              onChange={(e) => setsaturdaySlot((p) => { const arr = [...p]; arr[index].to = e.value; return arr })}
                                              value={Timeintraval.find(e => e.value == data?.to)}
                                              isOptionDisabled={(e) => e.value === data?.from || moment(e.value, 'h:mm A') < moment(data?.from, 'h:mm A') || saturdaySlot.find(p => p.to === e.value)}
                                              theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                  ...theme.colors,
                                                  primary25: '#f4f7f7',
                                                  primary: '#125453',
                                                  primary50: '#f4f7f7'
                                                }
                                              })}
                                            />
                                          </div>
                                        </div>
                                      </Col>
                                    </Row>

                                    <div className='delete_icon ms-2 mb-2' onClick={() => { index != 0 && setsaturdaySlot((p) => { return p.filter((a, i) => i != index) }); index != 0 && data?.id && handleRemove(data?.id) }}>
                                      <i className="fa fa-trash-o" aria-hidden="true"></i>
                                    </div>
                                  </div>
                                </div>
                                {
                                  (saturdaySlot?.length - 1) === index &&
                                  <div className='deletr_icob' onClick={() => setsaturdaySlot((p) => { const arr = [...p, {}]; return arr })}>
                                    <img src="/assets/images/Icons/__Add.png" alt="" className="" />
                                  </div>
                                }
                              </div>
                            ))
                          }

                          <div className='d-none align-items-start  calender_tbgl col-xl-8 col-10 me-2 mb-3'>
                            <div className='d-flex align-items-center me-3 mb-md-0 mb-3 '>
                              <input type="checkbox" id="switch5" className="checkbox" />
                              <label htmlFor="switch5" className="toggle me-3" />
                              <h5 className='fw-600 mb-0'>SAT</h5>
                            </div>
                            <div className='unavailable_bg '>Unavailable</div>
                          </div>

                          <button type='submit' className='border-0 btn_next  mt-4'> {loading ? <span
                            className="spinner-border spinner-border-sm"
                            aria-hidden="true"
                          ></span> : "Update"}</button>
                        </div>
                      </form>
                    </div>
                }
              </Col>
            </Col>
          </Row>
        </section>
    </>
  )
}

export default CalenderPage