import React, { useState } from 'react';
import { Container, Row, Col, Button, Label, Input } from 'reactstrap';
import SideBar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import toast from 'react-hot-toast';
import { ChangePassword } from './mentor/request';
import { useAuth } from '../Auth/core/Auth';
import Meta from '../../services/Meta';


const Settings = () => {

    const [passwordShow, setPasswordShow] = useState([{ id: 1, show: false, value: '' }, { id: 2, show: false, value: '' }, { id: 3, show: false, value: '' }])

    const { auth } = useAuth();

    function fn(x, ...y) {
        // y is an array
        return x * y.length
    }

    function checkPassword(str) {
        var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
        return re.test(str);
    }

    const handlSubmit = (event) => {
        event.preventDefault();
        if (passwordShow[0].value === '' || passwordShow[1].value === '' || passwordShow[2].value === '') {
            return toast("Enter your updated Passwords", { type: "error" })
        } else if (!checkPassword(passwordShow[1].value)) {
            return toast("Password must have one upper case, lower case, special character and number (length 8-12)", { type: "error" })
        } else if (passwordShow[1].value !== passwordShow[2].value) {
            return toast("Passwords do not Match", { type: "error" })
        } else {
            var formData = new FormData();
            const id = auth?.user_id;
            formData.append('current_password', passwordShow[0].value)
            formData.append('new_password', passwordShow[1].value)
            formData.append('confirm_password', passwordShow[2].value)
            formData.append('auth_token', auth?.token)
            ChangePassword(id, formData).then(res => {
                if (res.status == 200) {
                    toast.success('success');
                    setPasswordShow([{ id: 1, show: false, value: '' }, { id: 2, show: false, value: '' }, { id: 3, show: false, value: '' }])
                } else {
                    toast.error(res?.message);
                }
            }).catch(err => {
                console.log('err', err);
            })
        }
    }

    return (
        <>
            <Meta title={'Setting'} />
            <section className="section-b-space h-100vh">
                {/* <DashboardNavbar /> */}
                <Row className='h-100 custome_heifht'>
                    <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
                        <div className='col-xl-9 d-flex justify-content-center'>
                            <SideBar></SideBar>
                        </div>
                    </Col>
                    <Col lg="9" className='px-xl-4 py-4 scrol_right'>
                        {/* <form onSubmit={handlSubmit}>
                            <Col xl="11">
                                <div className='col-xl-6 col-xxl-5'>
                                    <h2 className='mb-4'>Change Your Password</h2>
                                    <div className=''>
                                        <div className="form-group">
                                            <Label className="form-label fw-600" for="oPassword"> Old Password</Label>
                                            <div className="input-container">
                                                <Input type={passwordShow[0]?.show ? "text" : "password"} value={passwordShow[0]?.value} className="form-control" id="oPassword" onChange={(e) => setPasswordShow((p) => { const arr = [...p]; arr[0].value = e.target.value; return arr })} placeholder="Enter Old Password " required="" />
                                                <img src={`${passwordShow[0]?.show ? '/assets/images/__Open eye.png' : '/assets/images/__Eye Close.png'}`} onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[0].show = !p[0].show; return arr })} alt="" className="" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <Label className="form-label fw-600" for="nPassword"> New Password</Label>
                                            <div className="input-container">
                                                <Input type={passwordShow[1]?.show ? "text" : "password"} value={passwordShow[1]?.value} className="form-control" id="nPassword" placeholder="Enter New Password" onChange={(e) => setPasswordShow((p) => { const arr = [...p]; arr[1].value = e.target.value; return arr })} required="" />
                                                <img src={`${passwordShow[1]?.show ? '/assets/images/__Open eye.png' : '/assets/images/__Eye Close.png'}`} onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[1].show = !p[1].show; return arr })} alt="" className="" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <Label className="form-label fw-600" for="cPassword"> Confirm Password</Label>
                                            <div className="input-container">
                                                <Input type={passwordShow[2]?.show ? "text" : "password"} value={passwordShow[2]?.value} className="form-control" id="cPassword" placeholder="Enter Confirm Password" onChange={(e) => setPasswordShow((p) => { const arr = [...p]; arr[2].value = e.target.value; return arr })} required="" />
                                                <img src={`${passwordShow[2]?.show ? '/assets/images/__Open eye.png' : '/assets/images/__Eye Close.png'}`} onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[2].show = !p[2].show; return arr })} alt="" className="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <Button type='submit' className='save_change_btn me-3'>Save changes</Button>
                                        <Button className='cancel_btn' onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[0].value = ''; arr[1].value = ''; arr[2].value = ''; return arr })} >cancel</Button>
                                    </div>
                                </div>
                            </Col>
                        </form> */}
                        <form onSubmit={handlSubmit}>
                            <Col xl="11">
                                <div className='col-xl-6 col-xxl-5'>
                                    <h2 className='mb-4'>Change Your Password</h2>
                                    <div className=''>
                                        <div className="form-group">
                                            <Label className="form-label fw-600" for="oPassword"> Old Password</Label>
                                            <div className="input-container">
                                                <Input type={passwordShow[0]?.show ? "text" : "password"} value={passwordShow[0]?.value} className="form-control" id="oPassword" onChange={(e) => setPasswordShow((p) => { const arr = [...p]; arr[0].value = e.target.value; return arr })} placeholder="Enter Old Password " required="" />
                                                <img src={`${passwordShow[0]?.show ? '/assets/images/__Open eye.png' : '/assets/images/__Eye Close.png'}`} onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[0].show = !p[0].show; return arr })} alt="" className="" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <Label className="form-label fw-600" for="nPassword"> New Password</Label>
                                            <div className="input-container">
                                                <Input type={passwordShow[1]?.show ? "text" : "password"} value={passwordShow[1]?.value} className="form-control" id="nPassword" placeholder="Enter New Password" onChange={(e) => setPasswordShow((p) => { const arr = [...p]; arr[1].value = e.target.value; return arr })} required="" />
                                                <img src={`${passwordShow[1]?.show ? '/assets/images/__Open eye.png' : '/assets/images/__Eye Close.png'}`} onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[1].show = !p[1].show; return arr })} alt="" className="" />
                                            </div>
                                        </div>
                                        <div className="form-group">
                                            <Label className="form-label fw-600" for="cPassword"> Confirm Password</Label>
                                            <div className="input-container">
                                                <Input type={passwordShow[2]?.show ? "text" : "password"} value={passwordShow[2]?.value} className="form-control" id="cPassword" placeholder="Enter Confirm Password" onChange={(e) => setPasswordShow((p) => { const arr = [...p]; arr[2].value = e.target.value; return arr })} required="" />
                                                <img src={`${passwordShow[2]?.show ? '/assets/images/__Open eye.png' : '/assets/images/__Eye Close.png'}`} onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[2].show = !p[2].show; return arr })} alt="" className="" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <Button type='submit' className='save_change_btn me-3'>Save changes</Button>
                                        <Button className='cancel_btn' onClick={() => setPasswordShow((p) => { const arr = [...p]; arr[0].value = ''; arr[1].value = ''; arr[2].value = ''; return arr })} >cancel</Button>
                                    </div>
                                </div>
                            </Col>
                        </form>
                    </Col>

                </Row>
            </section>
        </>

    )
}

export default Settings