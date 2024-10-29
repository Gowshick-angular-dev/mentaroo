import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import PropTypes from 'prop-types';
// import { Editor } from 'primereact/editor';
import toast from "react-hot-toast";
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { getAccountDetails, getPdfDown, postAccount, updateAccount } from './request';
import { useAuth } from '../../Auth/core/Auth';
import cn from 'classnames';
import Meta from '../../../services/Meta';


const AccountSettings = ({ direction, ...args }) => {


    const AccoutType = [{ label: 'Current', value: 'Current' }, { label: 'Savings', value: 'Savings' }]

    const [panCard, setPancard] = useState('');
    const [IdProof, setIdProof] = useState('');
    const [GstCerti, setGstCerti] = useState('');
    const [editable, setEditable] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [accountdata, setAccountdata] = useState([])
    const [pdf, setPdf] = useState();

    const adminEmail = JSON.parse(localStorage.getItem('admin'))?.filter(e => e.key == "system_email")[0]?.value ?? '';

    const handleDownloadPdf = () => {
        getPdfDown().then(res => {
            let fileName = 'Terms_Conditions.pdf';
            setPdf(res?.data)
            fetch(res.data).then(response => response.blob())
                .then(blob => {
                    const url = window.URL.createObjectURL(blob)
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', fileName)
                    document.body.appendChild(link);
                    link.click();
                    link.remove()
                }).catch(error => {
                    console.error('Error fetching PDF: ', error);
                    window.open(res.data, "_blank");
                })
        }).catch(err => {

        })
    }

    const handlePanUpload = (e) => {
        const file = e?.target?.files[0];
        const filesFormats = ["application/pdf"];
        const isRightFormat = filesFormats.includes(file?.type);
        formik.setFieldValue('pan', file?.name)
        setPancard(file); 
        // if (isRightFormat) {
        //     formik.setFieldValue('pan', file?.name)
        //     setPancard(file)
        // } else {
        //     formik.setFieldError('pan', 'upload Pdf Format Only');
        // }
    }

    const handleGstUpload = (e) => {
        const file = e?.target?.files[0];
        const filesFormats = ["application/pdf"];
        const isRightFormat = filesFormats.includes(file?.type);
        formik.setFieldValue('gst', file?.name)
        setGstCerti(file)
        // if (isRightFormat) {
        //     formik.setFieldValue('gst', file?.name)
        //     setGstCerti(file)
        // } else {
        //     formik.setFieldError('gst', 'upload Pdf Format Only');
        // }
    }

    const handleProofUpload = (e) => {
        const file = e?.target?.files[0];
        const filesFormats = ["application/pdf"];
        const isRightFormat = filesFormats.includes(file?.type);
        formik.setFieldValue('id_proof', file?.name)
        setIdProof(file)
        // if (isRightFormat) {
        //     formik.setFieldValue('id_proof', file?.name)
        //     setIdProof(file)
        // } else {
        //     formik.setFieldError('id_proof', 'upload Pdf Format Only');
        // }
    }


    const { auth } = useAuth();

    const fetchAccountdetails = () => {
        setPageLoading(true);
        const id = auth?.user_id;
        getAccountDetails(id).then(res => {
            setAccountdata(res.data)
            formik.setFieldValue('account_name', res?.data[0]?.account_name)
            formik.setFieldValue('account_no', res?.data[0]?.account_no)
            formik.setFieldValue('caccount_no', res?.data[0]?.account_no)
            formik.setFieldValue('bank_name', res?.data[0]?.bank_name)
            formik.setFieldValue('type_of_account', res?.data[0]?.type_of_account)
            formik.setFieldValue('ifsc', res?.data[0]?.ifsc)
            formik.setFieldValue('pan', res?.data[0]?.pan)
            formik.setFieldValue('gst', res?.data[0]?.gst)
            formik.setFieldValue('id_proof', res?.data[0]?.id_proof)
            setGstCerti(res?.data[0]?.gst);
            setIdProof(res?.data[0]?.id_proof);
            setPancard(res?.data[0]?.pan);
            setPageLoading(false);
        }).catch(err => {
            setPageLoading(false);
        })
    }

    useEffect(() => {
        fetchAccountdetails();
        // handleDownloadPdf()
    }, [])


    const initialValues = {
        account_name: "",
        account_no: "",
        caccount_no: "",
        bank_name: "",
        type_of_account: "",
        ifsc: "",
        pan: "",
        gst: "",
        id_proof: ""
    }

    const accounSchema = Yup.object().shape({
        account_name: Yup.string().required("Enter Account Name"),
        account_no: Yup.string().required("Enter Account Number").min(11, 'Enter minmum 11 digit number'),
        caccount_no: Yup.string().oneOf([Yup.ref('account_no'), null], 'Account Number must be Same!').required('Enter Confirm Account Number'),
        bank_name: Yup.string().required("Enter Bank Name"),
        type_of_account: Yup.string().required("Select Account Type"),
        ifsc: Yup.string().required("Enter IFSC Code").matches('^[A-Za-z]{4}0[A-Z0-9a-z]{6}$', "Enter valid IFSC code"),
        id_proof: Yup.string(),
        // .required("Upload ID Proof(Passport, Driving License, Aadhar Card)!"),
        pan: Yup.string(),
        // .required("Upload PAN Card"),
        gst: Yup.string(),
        // .required("Upload GST Certificate"),
    })

    const [loading, setLoading] = useState(false);

    const formik = useFormik({
        initialValues,
        validationSchema: accounSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                // else if (!GstCerti) {
                //     toast.error("Upload GST Certificate")
                //     formik.setFieldError('gst', 'Upload GST Certificate')
                // } 
                if (!panCard) {
                    toast.error("Upload PAN Card")
                    formik.setFieldError('pan', 'Upload PAN Card')
                }
                else if (!IdProof) {
                    toast.error("Upload ID Proof(Passport, Driving License, Aadhar Card)!")
                    formik.setFieldError('id_proof', 'Upload ID Proof(Passport, Driving License, Aadhar Card)!')
                } else {
                    setLoading(true);
                    var formData = new FormData();
                    formData.append('account_name', values.account_name)
                    formData.append('account_no', values.account_no)
                    formData.append('bank_name', values.bank_name)
                    formData.append('type_of_account', values.type_of_account)
                    formData.append('ifsc', values.ifsc)
                    formData.append('pan', panCard)
                    formData.append('gst', GstCerti)
                    formData.append('id_proof', IdProof)
                    formData.append('user_id', auth?.user_id)
                    let response;
                    if (accountdata?.length > 0) {
                        formData.append('id', accountdata[0]?.id)
                        response = await updateAccount(formData)
                    } else {
                        response = await postAccount(formData)
                    }
                    setLoading(false);
                    if (response.status == 200) {
                        toast.success(response?.message)
                    } else {
                        toast.error(response?.message)
                    }
                }
            } catch (error) {
                setLoading(true);
            }
        }
    })
    
    return (<> 
    <Meta title={'Account Setting'}  />
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
                            <Col xl="11" className='h-100'>
                                <form onSubmit={formik.handleSubmit}>
                                    <div className='h-100 '>
                                        <h2>Bank Account Details</h2>
                                        <p className='mb-4'>Connecting to a new bank account may take a few days. You won't receive payments to the new linked account until its status is approved.</p>
                                        <div className='custome_cad p-sm-4 p-3 mb-3'>
                                            <div className='mb-3 d-flex align-items-center justify-content-between'>
                                                <h3 className='fw-500 mb-0'>Bank Transfer</h3>
                                                <div className='d-flex align-items-center'>
                                                    {/* <button type='button' className="Completed btn btn-secondary px-4 ">Active</button>
                                                <div onClick={()=> setEditable(false)} className="edit_btn ms-2 border-radius-50">
                                                    <img src="/assets/images/Icons/10.png" alt="" className="me-3 testimonial-user" />
                                                </div> */}
                                                </div>
                                            </div>
                                            <Row>
                                               <Col md="12">
                                                    <div className="form-group mb-3">
                                                        <Label className="form-label" htmlFor="name">Account Name <span className='text-danger'>*</span></Label>
                                                        <div className="input-container mb-1">
                                                            <Input type="text" disabled={editable} {...formik.getFieldProps('account_name')} className="form-control" id="name" placeholder="Name" required="" />
                                                        </div>
                                                        {formik.touched.account_name && formik.errors.account_name && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.account_name}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                               </Col>
                                               <Col md="6">
                                                    <div className="form-group mb-3">
                                                        <Label className="form-label" htmlFor="no">Account No <span className='text-danger'>*</span></Label>
                                                        <div className="input-container mb-1">
                                                            <Input type="text" disabled={editable} {...formik.getFieldProps('account_no')} maxLength={16} onChange={(e) => formik.setFieldValue('account_no', e.target?.value.replace(/[^0-9]/g, ""))} className="form-control" id="no" placeholder="**** **** ****" required="" />
                                                        </div>
                                                        {formik.touched.account_no && formik.errors.account_no && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.account_no}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                               </Col>
                                               <Col md="6">
                                                    <div className="form-group mb-3">
                                                        <Label className="form-label" htmlFor="cno">Confirm Account No <span className='text-danger'>*</span></Label>
                                                        <div className="input-container mb-1">
                                                            <Input type="text" disabled={editable} className="form-control"  {...formik.getFieldProps('caccount_no')} onChange={(e) => formik.setFieldValue('caccount_no', e.target?.value.replace(/[^0-9]/g, ""))} id="cno" placeholder="1245 25611 1452" required="" />
                                                        </div>
                                                        {formik.touched.caccount_no && formik.errors.caccount_no && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.caccount_no}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                               </Col>
                                               <Col md="12">
                                                    <div className="form-group mb-3">
                                                        <Label className="form-label" htmlFor="bname">Bank Name and Branch <span className='text-danger'>*</span></Label>
                                                        <div className="input-container mb-1">
                                                            <Input type="text" disabled={editable} className="form-control" {...formik.getFieldProps('bank_name')} id="bname" placeholder="Bank Name and Branch" required="" />
                                                        </div>
                                                        {formik.touched.bank_name && formik.errors.bank_name && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.bank_name}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                               </Col>
                                               <Col md="6">
                                                    <div className="form-group custome_dripo mb-3">
                                                        <Label className="form-label" htmlFor='dom'>
                                                            Type of Account <span className='text-danger'>*</span>
                                                        </Label>
                                                        <div className="custome_dripo">
                                                            <Select
                                                                isSearchable={false}
                                                                placeholder='Type'
                                                                isDisabled={editable}
                                                                // onChange={(e) => experienceForm.setFieldValue('start_month', e?.value)}
                                                                inputId='dom'
                                                                value={AccoutType.find(e => e.value == formik.getFieldProps('type_of_account').value) ?? ''}
                                                                classNamePrefix="select"
                                                                // getOptionLabel={(e) => e?.name}
                                                                // getOptionValue={(e) => e?.id}
                                                                onChange={(e) => formik.setFieldValue('type_of_account', e?.value)}
                                                                options={AccoutType}
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

                                                            {formik.touched.type_of_account && formik.errors.type_of_account && (
                                                                <div className='fv-plugins-message-container'>
                                                                    <div className='fv-help-block'>
                                                                        <span role='alert' className='text-danger'>{formik.errors.type_of_account}</span>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                    </div>
                                               </Col>
                                               <Col md="6">
                                                    <div className="form-group mb-3">
                                                        <Label className="form-label" htmlFor="ifsc">IFSC Code <span className='text-danger'>*</span></Label>
                                                        <div className="input-container mb-1">
                                                            <Input type="text" disabled={editable} maxLength={11} {...formik.getFieldProps('ifsc')} className="form-control" id="ifsc" placeholder="IFSC Code" required="" />
                                                        </div>
                                                        {formik.touched.ifsc && formik.errors.ifsc && (
                                                            <div className='fv-plugins-message-container'>
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.ifsc}</span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                               </Col>
                                            </Row>
                                        </div>

                                        <h2>
                                            Tax Information
                                        </h2>
                                        <p>Updating new tax information (PAN Card or GST Certificate) will take a few days. All pending payments will be withheld until approved (Grey out once uploaded or make it white once deleted with X)</p>


                                        <div className='custome_cad p-sm-4 p-3 mb-3'>
                                            <h3 className='fw-400 mb-3'>PAN Card <span className='text-danger'>*</span></h3>
                                            <div className='mb-3'>
                                                <div className="form-group mb-1 d-flex">
                                                    <div className="input-container  delete_i mb-0 col-xxl-8 col-md-6 me-2">
                                                        <Input type="text" readOnly={true} {...formik.getFieldProps('pan')} className="form-control text-truncate" placeholder="" required="" />
                                                        {
                                                            formik.getFieldProps('pan').value ?
                                                                <img role='button' onClick={() => { !editable && formik.setFieldValue('pan', ''); !editable && setPancard() }} src={`/assets/images/Mentee flow assets/Mentee Dashboard Flow/Mentor List page/Icons/__Logout.png`} alt="" className="img_deletr" />
                                                                : ''
                                                        }
                                                    </div>
                                                    <input type='file' className='d-none' onChange={(e) => handlePanUpload(e)} id='fileUploadAccount1' />
                                                        {
                                                            formik.getFieldProps('pan').value ?
                                                                <button type='button' className='btn_cancel text-secondary me-3 py-0 border-0'>Upload</button> :
                                                                <button type='button' disabled={editable} onClick={() => { formik.setFieldTouched('pan', true); document.getElementById('fileUploadAccount1')?.click() }} className='border-0 btn_next me-3 py-0'>Upload</button>
                                                        }
                                                </div>
                                                {formik.touched.pan && formik.errors.pan && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.pan}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <h3 className='fw-400 mb-3'>GST Certificate</h3>
                                            <div className='mb-3'>
                                                <div className="form-group d-flex mb-1">
                                                    <div className="input-container mb-0 delete_i   col-xxl-8 col-md-6 me-2">
                                                        <Input type="text" readOnly={true} {...formik.getFieldProps('gst')} className="form-control text-truncate" placeholder="" required="" />
                                                        {
                                                            formik.getFieldProps('gst').value ?
                                                                <img role='button' onClick={() => { !editable && formik.setFieldValue('gst', ''); !editable && setGstCerti() }} src={`/assets/images/Mentee flow assets/Mentee Dashboard Flow/Mentor List page/Icons/__Logout.png`} alt="" className="img_deletr" />
                                                                : ''
                                                        }
                                                    </div>
                                                    <input type='file' className='d-none' onChange={(e) => handleGstUpload(e)} id='fileUploadAccount2' />
                                                    {
                                                        formik.getFieldProps('gst').value ?
                                                            <button type='button' className='btn_cancel text-secondary me-3 py-0 border-0'>Upload</button> :
                                                            <button type='button' onClick={() => { formik.setFieldTouched('gst', true); document.getElementById('fileUploadAccount2')?.click() }} className='border-0 btn_next me-3 py-0'>Upload</button>
                                                    }
                                                </div>
                                                {formik.touched.gst && formik.errors.gst && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.gst}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <p>*Please upload Form GST Reg-06. For more info on how to download the form please go through our Mentor FAQs.</p>

                                        </div>


                                        <h2>
                                            ID Information  
                                        </h2>
                                        <p>Updating new ID information will take a few days. All pending payments will be withheld until approved (Grey out once uploaded or make it white once deleted with X).</p>

                                        <div className='custome_cad p-sm-4 p-3 mb-3'>
                                            <h3 className='fw-400 mb-3 '>ID Proof <span className='text-danger'>*</span> (Passport, Driving License, Aadhar Card)</h3>
                                            <div className='mb-3'>
                                                <div className="form-group d-flex mb-1">
                                                    <div className="input-container delete_i col-xxl-8 col-md-6 mb-0 me-2">
                                                        <Input type="text" readOnly={true} {...formik.getFieldProps('id_proof')} className="form-control text-truncate" placeholder="" required="" />
                                                        {
                                                            formik.getFieldProps('id_proof').value ?
                                                                <img role='button' onClick={() => { !editable && formik.setFieldValue('id_proof', ''); !editable && setIdProof() }} src={`/assets/images/Mentee flow assets/Mentee Dashboard Flow/Mentor List page/Icons/__Logout.png`} alt="" className="img_deletr" />
                                                                : ''
                                                        }                                            </div>
                                                    <input type='file' className='d-none' onChange={(e) => handleProofUpload(e)} id='fileUploadAccount3' />
                                                    {
                                                        formik.getFieldProps('id_proof').value ?
                                                            <button type='button' className='btn_cancel text-secondary me-3 py-0 border-0'>Upload</button> :
                                                            <button type='button' onClick={() => { formik.setFieldTouched('id_proof', true); document.getElementById('fileUploadAccount3')?.click() }} className='btn_next me-3 py-0 border-0'>Upload</button>
                                                    }
                                                </div>
                                                {formik.touched.id_proof && formik.errors.id_proof && (
                                                    <div className='fv-plugins-message-container'>
                                                        <div className='fv-help-block'>
                                                            <span role='alert' className='text-danger'>{formik.errors.id_proof}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className='d-flex justify-content-center mb-3'>
                                            <div className='d-flex align-items-center justify-content-start my-4'>
                                                <button type='submit' className=' border-0 btn_next me-3'>
                                                    {
                                                        loading ?
                                                            <span
                                                                className="spinner-border spinner-border-sm"
                                                                aria-hidden="true"
                                                            ></span> : "Save"
                                                    }
                                                </button>
                                                <button type='button' onClick={formik.resetForm} className='border-0 btn_cancel'>Cancel</button></div>
                                        </div>


                                        <div className='unavailable_bg d-sm-flex align-items-center w-auto py-4 mb-3' >
                                            <div className='d-flex align-items-center'>
                                                <img src={`/assets/images/instructor.png`} alt="" className="me-sm-3 img-sidebar_icon" />
                                                <h5 className='fw-bold me-3 mb-0 '>Instructor Terms And Conditions</h5></div>
                                            {/* <a href={pdf} target='_blank' download="terms"> */}
                                            <button type='button' onClick={() => handleDownloadPdf()} className="btn_pdf btn btn-secondary mt-sm-0 mt-3">
                                                <img src="/assets/images/Icons/__Pdf.png" alt="" className="img-rd me-2" />Download PDF</button>
                                            {/* </a>  */}
                                        </div>
                                        <p className=''>For any queries write to us at <a href={`mailto:${adminEmail}`}><span className="theme_color fw-bold">{adminEmail ?? ''}</span></a>. We are here to help you..</p>
                                        <p className='text-white '>sh</p>
                                    </div>
                                </form>
                            </Col>
                    }
                 </Col>
            </Row>
        </section>
    </>

    )
}

export default AccountSettings