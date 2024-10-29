import React, { useEffect, useRef, useState } from 'react';
import { Container, Row, Col, Button, Label, Input } from 'reactstrap';
import SideBar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import { Link } from 'react-router-dom';
import { getLastMessages, getuserAginsChatlist, myMessangersUser, sendMessage, sendReplayMessage } from './requests';
import { useAuth } from '../Auth/core/Auth';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom'
import Meta from '../../services/Meta';




const MyMessage = () => {

    // const [userList, setUserList] = useState([{ id: 1, name: 'Vignesh Anbazhagan', img: '/assets/images/mentor1.png', notify: 1 }, { id: 2, name: 'Niharika Arora', img: '/assets/images/mentor5.png', notify: 1 }, { id: 3, name: 'Prashanth Chidambaram', img: '/assets/images/mentor2.png', notify: 1 }, { id: 4, name: 'Sandhiya', img: '/assets/images/mentor4.png', notify: 1 }])
    const [userList, setUserList] = useState([])

    // const [Chatslist, setChatsList] = useState([{ id: 1, msg: 'Good Morning', file: '' }, { id: 1, msg: 'What does this dummy text mean?', file: '' }, { id: 2, msg: 'Good Night', file: '' }])
    const [Chatslist, setChatsList] = useState([])
    const [openChat, setChatbox] = useState()
    const [textMsg, setTextMsg] = useState('')
    const [fileschat, setfileschat] = useState();
    const [loading, setLoading] = useState(false);
    const [bodyLoader, setBodyloader] = useState(false);  
    const [permission, setPermission] = useState(Notification.permission);   
    
    useEffect(() => {
        // Request permission when component mounts
        Notification.requestPermission().then(status => {
          setPermission(status);
          console.log(`Notification permission status: ${status}`);
        }).catch(error => {
          console.error(`Error requesting notification permission: ${error}`);
        }); 

      }, [permission]);  


      const generateNotification = async(msg) => {
        const newNotification = `${msg}`;
        if (permission === "granted") {  
            try {
               const notification = new Notification(newNotification);
            //    console.log(`Notification created: ${notification}`);
            } catch (error) {
                console.error(`Error creating notification: ${error}`);
                alert(error.message);
            }
        }
      };

    const { auth, currentUser } = useAuth();

    const router = useNavigate();

    const handleChanalsList = (thread) => {
        const id = auth?.user_id;
        setLoading(true)
        myMessangersUser(id).then(res => {
            setUserList(res?.data);
            if (res?.data?.length > 0) { 
                if(thread) {
                    setChatbox(res?.data.find(e => e?.thread_code == thread) ?? res?.data[0]);
                    fetchChatList(thread ?? res?.data[0]?.thread_code);
                }else {

                    setChatbox(res?.data[0]);
                    fetchChatList(res?.data[0]?.thread_code);
                }
            }
            setLoading(false)
        }).catch(err => {
            console.log('err', err.message)
            setLoading(false)
        })
    } 

    const handleChanalsList2 = (thread) => {
        const id = auth?.user_id;
        myMessangersUser(id).then(res => {
            setUserList(res?.data);
            if (res?.data?.length > 0) { 
                if(thread) {
                    setChatbox(res?.data.find(e => e?.thread_code == thread) ?? res?.data[0]);
                    fetchChatList(thread ?? res?.data[0]?.thread_code);
                }else {

                    setChatbox(res?.data[0]);
                    fetchChatList(res?.data[0]?.thread_code);
                }
            }
            setBtnloader(false); 
        }).catch(err => {
            console.log('err', err.message) 
            setBtnloader(false); 
        })
    }

    const fetchChatList = (thread_code) => {
        setBodyloader(true)
        getuserAginsChatlist(thread_code ?? '').then(res => {
            setChatsList(res?.data)
            setBodyloader(false)
            setTimeout(() => {
                scrollToBottom();
            }, 100);
        }).catch(err => {
            console.log('err', err)
            setChatsList([])
            setBodyloader(false)
        })
    }

    const fetchLastMessage = (thread) => {
        if (thread) {
            getLastMessages(thread).then(res => {
                if (!Chatslist.some(e => e?.message_id === res?.data?.message_id)) {
                    setChatsList((p) => [...p, res?.data]) 
                    generateNotification(res?.data?.message ?? ''); 
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                }
            }).catch(err => {
                console.log('err', err.message);
            })
        }
    }

    useEffect(() => {
        if (openChat) {
            const timeoutId = setInterval(() => {
                fetchLastMessage(openChat?.thread_code ?? '');
            }, 2000);;
            // const fetchData = async () => {
            //   await fetchLastMessage(openChat?.thread_code);
            //   timeoutId = setTimeout(fetchData, 2000); // Adjust timeout as needed
            // };
            // fetchData();
            return () => clearInterval(timeoutId); // Cleanup on unmount
        }
    }, [Chatslist]); 

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
        const hours = date.getHours(); 
        const min = date.getMinutes(); 
        // Concatenate the components to form the desired format
        const formattedDate = `${day} ${month} ${year},${hours}:${min}`;
        return formattedDate;
    }

    const lastMessageRef = useRef(null);

    const createNewMessage = () => { 
        if(!btnLoader){
            var formData = new FormData();
            setBtnloader(true); 
            formData.append('message', textMsg ?? '')
            formData.append('user_id', auth.user_id ?? '')
            formData.append('receiver', openChat?.id ?? '')
            sendMessage(formData).then(res => {
                handleChanalsList2(res?.data) 
                setTextMsg(''); 
                setfileschat('');
                // fetchChatList(res?.data)
            }).catch(err => {
                console.log("err", err.message) 
                setBtnloader(false); 
            })
        }
    }
    
    const [btnLoader, setBtnloader] = useState(false); 

    const handleSendMessage = () => { 
        if(!btnLoader){
            var formData = new FormData();
            formData.append('message', textMsg ?? '')
            formData.append('user_id', auth.user_id ?? '')
            const thread = openChat?.thread_code ?? '';
            if (textMsg.trim()) {
                setBtnloader(true); 
                sendReplayMessage(thread, formData).then(res => { 
                    // fetchChatList()
                    setBtnloader(false);
                    // fetchLastMessage(res?.data)
                    setTextMsg(''); 
                    setfileschat('');
                    setTimeout(() => {
                        scrollToBottom();
                    }, 100);
                }).catch(err => {
                    setBtnloader(false);
                    console.log('err', err)
                })
            }
        }
    }

    useEffect(() => {
        handleChanalsList();
    }, [])

    const handlefiles = (e) => {
        try {
            const files = e.target.files[0]
            setfileschat(URL.createObjectURL(files))
        } catch (error) {
            console.error('err', error.message)
        }
    }

    const scrollToBottom = () => {
        const element = document.getElementById('ChatConverstations');
        if (element) {
            element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' });
        } else {
            console.error('Element not found');
        }
    }

    return (<>
    <Meta title={'Message'}  />

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
                                </div> : userList?.length > 0 ?
                                    <div className='h-100'>
                                        <h2 className='mb-4'>{"My Messages"}</h2>
                                        <Row className='h-100'>

                                            <Col xl="4" className='h-100'>
                                                <div className='message_left py-3 h-90'>
                                                    {
                                                        userList?.map((data, index) => (
                                                            <div role='button' id='disableDiv' style={data?.msgStatus == 0 ? { pointerEvents: "none", opacity: "0.4" } : {}} className={`d-flex align-items-center hover_bg py-2 px-3 ${data?.id === openChat?.id ? 'chat_active_bg' : ''}`} key={index} onClick={() => { setChatbox(data); fetchChatList(data?.thread_code); }}>
                                                                <img src={data?.image ?? ''} alt="" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} className="meesae_hgsd me-3" />
                                                                <p className='mb-0 fw-600 text-dark'>{data?.first_name}</p>
                                                                {/* <div className='w-mesesde'>
                                                                    2
                                                                </div> */}
                                                            </div>
                                                        ))
                                                    }
                                                </div>
                                            </Col> 

                                            <Col xl="8" className='d-xl-block d-none'>
                                                {
                                                    // Chatslist?.length > 0 ? 
                                                    <div className='message_right h-90 position-relative' >
                                                        <div className='message_right_head d-flex align-items-center justify-content-between position-sticky w-100 top-0'>
                                                            <div className='d-flex align-items-center hover_bg py-2 px-3'>
                                                                <img src={openChat?.image ?? ''} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="meesae_hgsd me-3" />
                                                                <p className='mb-0 fw-600 text-dark'>{openChat?.first_name}</p>
                                                            </div> 

                                                            <div>  
                                                            <div className="btn-group dropend d-none">
                                                                {/* <button type="button" className="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                                                Dropend
                                                                </button> */} 
                                                                <i role='button' className="fa fa-ellipsis-v me-2" data-bs-toggle="dropdown" aria-expanded="false"></i>
                                                                    <ul className="dropdown-menu">
                                                                    <li role='button' className='dropdown-item w-100'>Block</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='message_right_body d-flex align-items-end'>
                                                            <div className='w-100 px-3 chat_boxs'>
                                                                {
                                                                    bodyLoader ?
                                                                        <div className='pageLoading'>
                                                                            <span
                                                                                className={cn(
                                                                                    'd-flex h-100h w-100 flex-column align-items-center justify-content-center'
                                                                                )}
                                                                            >
                                                                                <span className={"loading"} />
                                                                            </span>
                                                                        </div> : 
                                                                        <div className='overflow-auto pb-5' id='ChatConverstations' style={{ maxHeight: '570px' }}>
                                                                            {
                                                                                Chatslist?.map((data, i) => (
                                                                                    data?.sender == auth?.user_id ?
                                                                                        <div className='d-flex justify-content-end mt-2' key={i}>
                                                                                            <div>
                                                                                                 {data?.file && <img src={data?.file} className='rounded' style={{ width: '100px' }} />}
                                                                                                 {data?.message && <p className='bg_text_mesage pt-0 mb-0'>
                                                                                                    <h6 className='mb-0'>you</h6> 
                                                                                                    <span>{data.message}</span>
                                                                                                    </p>}
                                                                                                 <div className='text-end w-100'> 
                                                                                                 <span className='mb-2'>{formatUnixTimestamp(data?.timestamp)}</span>
                                                                                                </div>    
                                                                                            </div>
                                                                                        </div> :
                                                                                        <div className='d-flex justify-content-start mt-2' key={i}>
                                                                                            <div>
                                                                                                {data.file && <img src={data.file} className='rounded' style={{ width: '100px' }} />}
                                                                                                {data.message && <p className='bg_text_mesage2 pt-1 mb-0'>
                                                                                                      {
                                                                                                        data?.senderName ? 
                                                                                                        <h6 className='mb-0'>{data?.senderName}</h6> : ''
                                                                                                      }
                                                                                                    <span>{data.message}</span></p>}
                                                                                                <div className='text-start w-100'> 
                                                                                                <span className='mb-2'>{formatUnixTimestamp(data?.timestamp)}</span>
                                                                                                </div>  
                                                                                            </div>
                                                                                        </div>
                                                                                ))
                                                                            }
                                                                        </div>
                                                                }

                                                                <form className='position-sticky' style={{ bottom: '16px' }} onSubmit={(e) => { e.preventDefault();  Chatslist?.length > 0 ? handleSendMessage() : createNewMessage() }}>
                                                                    {
                                                                        fileschat &&
                                                                        <div className='mb-2 position-relative' style={{ width: '75px' }}>
                                                                            <img src={fileschat} className='w-100 rounded start-0 top-0 ' />
                                                                            <i role='button' className="fa fa-trash text-danger position-absolute bg-primary-subtle p-1 rounded-circle bottom-100 start-100" onClick={() => setfileschat('')} aria-hidden="true"></i>
                                                                        </div>
                                                                    } 
                                                                    <div className='message-input-control mb-3 '>
                                                                        <input type='text' value={textMsg} onChange={(e) => setTextMsg(e.target.value)} placeholder='Enter Your Message here' className='w-100'></input>
                                                                        <div className='d-flex align-items-center'>
                                                                            <img src={`/assets/images/__attach.png`} onClick={() => document.getElementById('attechedopenfile')?.click()} role='button' alt="" className="send-attach me-3" />
                                                                            <input type='file' id='attechedopenfile' onChange={handlefiles} className='d-none' />
                                                                            <div className='send_isigv ' role='button'  onClick={() => {  Chatslist?.length > 0 ? handleSendMessage() : createNewMessage()  }}>
                                                                                {/* <img src={`/assets/images/__Send.png`} alt="" className="me-" />   */} 
                                                                                { 
                                                                                 btnLoader ? 
                                                                                   <span className="spinner-border ms-2  text-light spinner-border-sm" aria-hidden="true"></span>
                                                                                : <img src={`/assets/images/__Send.png`} alt="" className="me-" />
                                                                                } 
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <button type='submit' className='d-none' />
                                                                </form>

                                                                {/* <form className='position-sticky' style={{ bottom: '16px' }} onSubmit={(e) => { e.preventDefault(); setChatsList((p) => [...p, { id: openChat?.id, msg: textMsg, file: fileschat ?? '' }]); setTextMsg(''); setfileschat(''); scrollToBottom() }}>
                                                                        {
                                                                            fileschat &&
                                                                            <div className='mb-2 position-relative' style={{ width: '75px' }}>
                                                                                <img src={fileschat} className='w-100 rounded start-0 top-0 ' />
                                                                                <i role='button' className="fa fa-trash text-danger position-absolute bg-primary-subtle p-1 rounded-circle bottom-100 start-100" onClick={() => setfileschat('')} aria-hidden="true"></i>
                                                                            </div>
                                                                        }
                                                                        <div className='message-input-control mb-3 '>
                                                                            <input type='text' value={textMsg} onChange={(e) => setTextMsg(e.target.value)} placeholder='Enter Your Message here' className='w-100'></input>
                                                                            <div className='d-flex align-items-center'>
                                                                                <img src={`/assets/images/__attach.png`} onClick={() => document.getElementById('attechedopenfile')?.click()} role='button' alt="" className="send-attach me-3" />
                                                                                <input type='file' id='attechedopenfile' onChange={handlefiles} className='d-none' />
                                                                                <div className='send_isigv' role='button' onClick={() => { setChatsList((p) => [...p, { id: openChat?.id, msg: textMsg, file: fileschat ?? '' }]); setTextMsg(''); setfileschat(''); scrollToBottom() }}>
                                                                                    <img src={`/assets/images/__Send.png`} alt="" className="me-" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <button type='submit' className='d-none' />
                                                                    </form> */}

                                                            </div>
                                                        </div>
                                                    </div>
                                                    // : 
                                                    // <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                                    //     <img src='/assets/noMsg.png' className='w-50' />
                                                    // </div>
                                                }
                                            </Col>
                                        </Row>
                                    </div> :
                                    <div className='h-100'>
                                        <h2 className='mb-4'>My Messages</h2>
                                        <div className='text-center my-3 box_empty'>
                                            <h3 className='mb-3 text-center pt-4'>No Message Yet</h3>
                                            {
                                                currentUser === 'mentee' ?
                                                    <>
                                                        <p className='mb-3 text-center'>We will notify you when when you have new message</p>
                                                            <Link to={'/mentor'}>
                                                                <button onMouseOver={() => document.getElementById('imagehoverChange').src = "/assets/images/menteedashBoard/__gray search.png"} onMouseOut={() => document.getElementById('imagehoverChange').src = "/assets/images/menteedashBoard/__white Search.png"} className='btn_theme px-3 py-2 mb-4'>
                                                                    <img id='imagehoverChange' src={`/assets/images/menteedashBoard/__white Search.png`} alt="" className="search_img me-2" /> Find a mentor
                                                                </button>
                                                            </Link>
                                                    </> :
                                                    <p className='mb-3 text-center'>We will notify you when when you have new message</p>
                                            }
                                        </div>
                                    </div>
                        }
                    </Col>
                </Col>

                {/* <Col lg="9" className='px-xl-4 py-4 scrol_right h-100'>
                    <Col xl="11" className='h-100'>
                        <div className='h-100'>

                            <h2 className='mb-4'>My Messages</h2>

                            <Row className='h-100'>
                                <Col xl="4" className='h-100  '>
                                    <div className='message_left py-3 h-90'>

                                        <div className='d-xl-flex d-none align-items-center hover_bg py-2 px-3'>

                                            <img src={`/assets/images/mentor1.png`} alt="" className="meesae_hgsd active_mes me-3" />
                                            <p className='mb-0 fw-600 text-dark'>Vignesh Anbazhagan</p>
                                        </div>

                                        <div className='d-flex d-xl-none  align-items-center hover_bg py-2 px-3'>

                                            <img src={`/assets/images/mentor1.png`} alt="" className="meesae_hgsd active_mes me-3" />
                                            <Link to={'/message-detail'}>  <p className='mb-0 fw-600 text-dark'>Vignesh Anbazhagan</p></Link>
                                        </div>

                                        <div className='d-flex align-items-center hover_bg py-2 px-3'>
                                            <img src={`/assets/images/mentor5.png`} alt="" className="meesae_hgsd me-3" />
                                            <p className='mb-0 fw-600 text-dark'> Niharika Arora</p>
                                        </div>

                                        <div className='d-flex align-items-center hover_bg py-2 px-3'>

                                            <img src={`/assets/images/mentor2.png`} alt="" className="meesae_hgsd me-3" />
                                            <p className='mb-0 fw-600 text-dark'>Prashanth Chidambaram</p>
                                            <div className='w-mesesde'>
                                                2
                                            </div>
                                        </div>

                                        <div className='d-flex align-items-center hover_bg py-2 px-3 inactive_msg'>
                                            <img src={`/assets/images/mentor4.png`} alt="" className="meesae_hgsd me-3" />
                                            <p className='mb-0 fw-600 text-dark'>Sandhiya</p>
                                        </div>

                                    </div>
                                </Col>
                                <Col xl="8" className='d-xl-block d-none'>
                                    <div className='message_right h-90'>
                                        <div className='message_right_head'>
                                            <div className='d-flex align-items-center hover_bg py-2 px-3'>
                                                <img src={`/assets/images/mentor1.png`} alt="" className="meesae_hgsd me-3" />
                                                <p className='mb-0 fw-600 text-dark'>Vignesh Anbazhagan</p>
                                            </div>
                                        </div>
                                        <div className='message_right_body d-flex align-items-end'>

                                            <div className='w-100 px-3'>


                                                <div className='d-flex justify-content-end'>
                                                    <p className='bg_text_mesage'>Good Morning</p>
                                                </div>

                                                <div className='d-flex justify-content-end'>
                                                    <p className='bg_text_mesage'>What does this dummy text mean?</p>
                                                </div>

                                                <div className='message-input-control mb-3'>
                                                    <input placeholder='Enter Your Message here'></input>
                                                    <div className='d-flex align-items-center'>
                                                        <img src={`/assets/images/__attach.png`} alt="" className="send-attach me-3" />
                                                        <div className='send_isigv '>
                                                            <img src={`/assets/images/__Send.png`} alt="" className="me-" />
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                        </div>

                    </Col>
                    </Col> */}
            </Row>

        </section>
    </>
    )
}

export default MyMessage