import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Label, Input, Col, Button } from "reactstrap";
import Select from 'react-select';
import {
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup'
import { useFormik } from 'formik';
import { getIntrest, getJobTitle, getPackages, getSkills } from '../core/Auth_request';
import { getCompanies, getPrograms } from '../../pages/core/_request';
import Meta from '../../../services/Meta';

const MentorApplyFrom2 = ({ Formvalue, setFormvalue, setStep, direction, ...args }) => {

    const options = [
        { value: 'option1', label: 'Admission Strategy ' },
        { value: 'option2', label: 'Career Guidance ' },
        { value: 'option3', label: 'Exam Study Plan ' },
        { value: 'option3', label: 'General Mentorship  ' },
    ];

    const [selectedOptions, setSelectedOptions] = useState([]);

    const handleSelectChange = (selectedItems) => {
        setSelectedOptions(selectedItems);
        formik.setFieldValue('offered', selectedItems.value)
    };
    const router = useNavigate();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const [dropdownOpen1, setDropdownOpen1] = useState(false);
    const toggle1 = () => setDropdownOpen1((prevState) => !prevState);
    const [dropdownOpen2, setDropdownOpen2] = useState(false);
    const toggle2 = () => setDropdownOpen2((prevState) => !prevState);
    const [dropdownOpen3, setDropdownOpen3] = useState(false);
    const toggle3 = () => setDropdownOpen3((prevState) => !prevState);

    const fullList = ['Javascript', 'Machine Learning', 'Web Development', 'Product Managers', 'Product Design', 'Web Design', 'Entrepreneurship', 'UX Research']
    const [interestList, setInterestList] = useState([])
    const [SkillList, setSkillList] = useState([])
    const [selectedList, setSelectedList] = useState([])
    const [domailList, setdomainList] = useState([])
    const [jobTitle, setJobTitle] = useState([])
    const [program, setProgram] = useState([])
    const [Price, setPrice] = useState([])
    const [sprogram, setsProgram] = useState([])
    const [packages, setPackages] = useState([])
    const [companies, setcompanies] = useState([])

    const handleSearch = (key) => {
        key === '' ? setInterestList(SkillList) : setInterestList(SkillList?.filter(d => d?.name?.toLowerCase().includes(key.toLowerCase())))
    }

    const [isloading, setloading] = useState(true)


    const fetchSkills = async () => {
        setloading(true);
        getSkills().then(res => {
            setSkillList(res.data);
            setInterestList(res.data)
            setSelectedList(res.data.filter((e, i) => Formvalue?.skill?.includes(e?.id)))
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchPackeges = async () => {
        setloading(true);
        getPackages().then(res => {
            setPackages(res)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchCompanies = async () => {
        setloading(true);
        getCompanies().then(res => {
            setcompanies(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchJobs = async () => {
        setloading(true);
        getJobTitle().then(res => {
            setJobTitle(res.data);
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchPrograms = async () => {
        setloading(true);
        getPrograms().then(res => {
            setProgram(res.data);
            setsProgram(res?.data?.filter(e => Formvalue?.offered.includes(e?.id)) ?? [])
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    const fetchDomains = async () => {
        setloading(true);
        getIntrest().then(res => {
            setdomainList(res.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    useEffect(() => {
        fetchSkills();
        fetchDomains();
        fetchJobs();
        fetchPrograms();
        fetchCompanies()
        fetchPackeges()

        if (Formvalue) {
            Object.keys(Formvalue).map((k, v) => {
                formik.setFieldValue(k, v);
            });
        }

        if (Formvalue?.programs) {
            setPrice(Formvalue?.programs ?? [])
        }


    }, [])

    let initialValues = {
        job_title: '',
        company: '',
        domain_expert: '',
        experience: '',
        skill: '',
        offered: '',
        bio: ''
    }

    const aboutSchema = Yup.object().shape({
        job_title: Yup.string(),
        // .required('Select Your Job Title'),
        company: Yup.string().required('Enter Your Company Name'),
        domain_expert: Yup.string(),
        experience: Yup.string(),
        skill: Yup.string(),
        offered: Yup.string(),
        bio: Yup.string(),
    })

    const [bio, setbio] = useState('')

    const formik = useFormik({
        initialValues,
        validationSchema: aboutSchema,
        onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
            try {
                // router('/mentorApplyForm-3')
                setFormvalue((p) => ({
                    ...p,
                    "job_title": values.job_title,
                    "company": values.company,
                    "domain_expert": values.domain_expert,
                    "skill": selectedList.map(e => e?.id),
                    "offered": sprogram.map(e => e?.id),
                    // "bio": values.bio,
                    "bio": bio ?? '',
                    "experience": values.experience,
                    "programs": Price
                }))
                setStep(3)
                // console.log(values)
            } catch (error) {
                console.log("err", error.message)
            }
        }
    })



    return (
        <div>
            <Meta title={'Apply as a mentor'} />
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
                                                <div className='me-2 inner_text'>2</div>
                                                <p className='mb-0'>About You</p>
                                            </div>
                                        </Col>
                                        <Col className='ps-0'>
                                            <div className='d-flex align-items-center mentor-tab_head_design'>
                                                <div className='me-2 inner_text'>3</div>
                                                <p className='mb-0'>Your Motivation</p>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='tab_body p-4'>

                                    <form onSubmit={formik.handleSubmit} className=''>
                                        <Row>
                                            <Col md="6">
                                                <div className="form-group custome_dripo mb-3">
                                                    <Label className="form-label" for="jobTitle">
                                                        Job title*
                                                    </Label>
                                                    <div className="custome_dripo">
                                                        <Select
                                                            isSearchable={false}
                                                            placeholder='Select'
                                                            inputId='jobTitle'
                                                            classNamePrefix="select"
                                                            options={jobTitle}
                                                            value={jobTitle.find(e => e?.id == (formik.getFieldProps('job_title').value || Formvalue?.job_title))}
                                                            getOptionLabel={(e) => e?.name}
                                                            getOptionValue={(e) => e?.id}
                                                            onChange={(e) => formik.setFieldValue('job_title', e?.id)}
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
                                                        {
                                                            formik.touched.job_title && formik.errors.job_title && (
                                                                <div className='fv-plugins-message-container ' >
                                                                    <div className='fv-help-block'>
                                                                        <span role='alert' className='text-danger '>{formik.errors.job_title}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </Col>

                                            <Col md="6">
                                                <div className="form-group mb-3">
                                                    <Label className="form-label" htmlFor="experienceYear">Company</Label>
                                                    <div className="input-container mb-1">
                                                        <Select
                                                            isSearchable={false}
                                                            placeholder='select'
                                                            classNamePrefix="select"
                                                            inputId='experienceYear'
                                                            options={companies}
                                                            value={companies.find(e => e?.id == (formik.getFieldProps('company').value || Formvalue?.company))}
                                                            getOptionLabel={(e) => e?.name}
                                                            getOptionValue={(e) => e?.id}
                                                            onChange={(e) => formik.setFieldValue('company', e?.id)}
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
                                                    {
                                                        formik.touched.company && formik.errors.company && (
                                                            <div className='fv-plugins-message-container ' >
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger '>{formik.errors.company}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            </Col>

                                            <Col md="6">
                                                <div className="form-group custome_dripo mb-3">
                                                    <Label className="form-label" htmlFor="domainExpertise">
                                                        Domain Expertise
                                                    </Label>
                                                    <div className="custome_dripo">
                                                        <Select
                                                            isSearchable={false}
                                                            placeholder='select'
                                                            classNamePrefix="select"
                                                            inputId='domainExpertise'
                                                            options={domailList}
                                                            value={domailList.find(e => e?.id == (formik.getFieldProps('domain_expert').value || Formvalue?.domain_expert))}
                                                            getOptionLabel={(e) => e?.name}
                                                            getOptionValue={(e) => e?.id}
                                                            onChange={(e) => formik.setFieldValue('domain_expert', e?.id)}
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
                                                        {
                                                            formik.touched.domain_expert && formik.errors.domain_expert && (
                                                                <div className='fv-plugins-message-container ' >
                                                                    <div className='fv-help-block'>
                                                                        <span role='alert' className='text-danger '>{formik.errors.domain_expert}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </Col>

                                            <Col md="6">
                                                <div className="form-group custome_dripo mb-3">
                                                    <Label className="form-label" htmlFor="company" >
                                                        Years of Experience
                                                    </Label>
                                                    <div className="input-container">
                                                        <Input type="text" className="form-control" {...formik.getFieldProps('experience')} id="company" placeholder="" required="" />
                                                        {
                                                            formik.touched.experience && formik.errors.experience && (
                                                                <div className='fv-plugins-message-container ' >
                                                                    <div className='fv-help-block'>
                                                                        <span role='alert' className='text-danger '>{formik.errors.experience}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>

                                                </div>
                                            </Col>

                                            <Col xs="12" className='custome_profile_right remove_shadow'>
                                                <div className="form-group custome_dripo mb-3">
                                                    <Label className="form-label" for="Skills_for">
                                                        Skills
                                                    </Label>
                                                    <div className="multi_dropdown ">
                                                        <div className="form-group has-search mb-3 px-3">
                                                            <span className="fa fa-search form-control-feedback"></span>
                                                            <input type="text" onChange={(e) => handleSearch(e.target.value)} id='Skills_for' className="form-control" placeholder="Search" />
                                                        </div>
                                                        <div className='custome_dropdown'>
                                                            <Row className='px-3 d-none'>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte avtive-sect'>

                                                                        <h5 className='me-2'>Javascript</h5><img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>Machine Learning</h5>
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>Web Development</h5>
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>Product Managers</h5>
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>Product Design</h5>
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>Web Design</h5>
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>UX Research</h5>
                                                                    </div>
                                                                </Col>
                                                                <Col sm="6 " xxl="3" lg="4" className='mb-3'>
                                                                    <div className='custome-selcte'>
                                                                        <h5>Entrepreneurship</h5>
                                                                    </div>
                                                                </Col>
                                                            </Row>

                                                            <Row className='px-3'>
                                                                {interestList?.length > 0 ?
                                                                    interestList?.map((data, index) => (
                                                                        <Col sm="6 " xxl="3" lg="4" className='mb-3' key={index}>
                                                                            <div role='button' className={`custome-selcte ${selectedList.find(e => e == data) ? 'avtive-sect' : ''}`}
                                                                                onClick={() => setSelectedList(selectedList.find(e => e == data) ? selectedList?.filter(e => e != data) : [...selectedList, data])}
                                                                            >
                                                                                <h5 className='me-2 '>{data?.name}</h5>
                                                                                {
                                                                                    selectedList.find(e => e == data) &&
                                                                                    <img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />
                                                                                }
                                                                            </div>
                                                                        </Col>
                                                                    )) : <Col xs="12" className='mb-3 text-center' >
                                                                        <span> No Data Found</span>
                                                                    </Col>
                                                                }
                                                            </Row>
                                                        </div>
                                                    </div>
                                                </div>

                                                <p>Comma-separated list of your Service (keep it below 10).</p>
                                                <div className='d-flex flex-wrap  mt-3'>
                                                    {
                                                        formik.touched.skill && formik.errors.skill && (
                                                            <div className='fv-plugins-message-container ' >
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger '>{formik.errors.skill}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                    {
                                                        selectedList.map((data, index) => (
                                                            <div className='d-flex align-items-center customet-sg mb-3' key={index}><h5 className='mb-0 me-3'>{data?.name} </h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} alt="" role='button' className="img-rd" onClick={() => setSelectedList(selectedList.filter(e => e != data))} /> </div>
                                                        ))
                                                    }
                                                    {/* <div className='d-flex customet-sg mb-3'><h5 className='mb-0 me-3'>Javascript </h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} alt="" className="img-rd" /> </div>
                                                        <div className='d-flex customet-sg mb-3'><h5 className='mb-0 me-3'>Machine Learning </h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} alt="" className="img-rd" /> </div>
                                                        <div className='d-flex customet-sg mb-3'><h5 className='mb-0 me-3'>Web Development  </h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} alt="" className="img-rd" /> </div> */}
                                                </div>




                                                <div className='my-4'>
                                                    <Label className="form-label" htmlFor="Offered">Programs Offered</Label>
                                                    <div className='multi_select_cu my-2'>
                                                        <Select
                                                            isMulti
                                                            //   options={options}
                                                            options={program}
                                                            // defaultValue={{ label: 'Programs', value: '1' }}
                                                            getOptionLabel={(value) => value?.title}
                                                            getOptionValue={(value) => value?.id}
                                                            inputId='Offered'
                                                            value={sprogram}
                                                            onChange={(e) => {
                                                                var obj = sprogram.filter(p => !e.find(l => l?.id == p?.id))
                                                                if (obj?.length > 0) {
                                                                    setPrice(Price.map(h => h.filter(k => k.program_is != obj[0]?.id)))
                                                                }
                                                                setsProgram(e)
                                                            }}
                                                            theme={(theme) => ({
                                                                ...theme,
                                                                colors: {
                                                                    ...theme.colors,
                                                                    primary25: '#f4f7f7',
                                                                    primary: '#125453',
                                                                    primary50: '#f4f7f7'
                                                                },
                                                            })}
                                                            classNamePrefix="select"
                                                        />
                                                        {
                                                            formik.touched.offered && formik.errors.offered && (
                                                                <div className='fv-plugins-message-container ' >
                                                                    <div className='fv-help-block'>
                                                                        <span role='alert' className='text-danger '>{formik.errors.offered}</span>
                                                                    </div>
                                                                </div>
                                                            )
                                                        }
                                                    </div>
                                                    <p>Comma-separated list of your Service (keep it below 10).</p>
                                                </div>
                                                {
                                                    sprogram?.length > 0 ?
                                                        sprogram?.map((data, index) => (
                                                            <div className='custome_dripo_bvhdfx' key={index}>
                                                                <h6 className='mb-3 fw-600'>{data?.title}</h6>
                                                                <Row className=''>
                                                                    {
                                                                        packages.slice(0, index == 0 ? packages?.length : 3 ).map((pac, i) => (
                                                                            <Col md={ i==3 ? '4': "4"} key={i}>
                                                                                <div className="form-group custome_dripo mb-3">
                                                                                    <Label className={`form-label  ${i==3 ? 'fw-bold' : ''}`} htmlFor={`1${i}`} >
                                                                                        {pac?.package_name} {i==3  ? 'Session' : `(Sessions ${data?.packages ? + JSON.parse(data?.packages ?? {})?.find(y => y?.package_id == pac?.id)?.sessions ? JSON.parse(data?.packages ?? {})?.find(y => y?.package_id == pac?.id)?.sessions  : "0" : '0'})`}
                                                                                    </Label>
                                                                                    <div className="input-container">
                                                                                        <Input type="text" value={Price[index]?.[i]?.price ?? ''} className="form-control" onChange={(e) => {
                                                                                            setPrice((p) => {
                                                                                                const val = [...p];
                                                                                                if (!val[index]) {
                                                                                                    val[index] = []; // Create inner array if not exists
                                                                                                }
                                                                                                // val[index] = {"price":e.target.value,"package":pac?.id} 
                                                                                                val[index][i] = {
                                                                                                    "price": e.target?.value.replace(/[^0-9]/g, ""),
                                                                                                    // "price": e.target?.value,
                                                                                                    "package": pac?.id,
                                                                                                    "program_is": data?.id
                                                                                                }
                                                                                                return val
                                                                                            })
                                                                                        }} id={`1${i}`} placeholder="price" />
                                                                                    </div>
                                                                                </div>
                                                                            </Col>
                                                                        ))
                                                                    }
                                                                </Row>
                                                            </div>
                                                        )) : ''
                                                }

                                                <div className="form-group custome_dripo mb-3">
                                                    <Label className="form-label" for="Bio">Your Bio (1000 Characters Maximum)</Label>
                                                    <textarea className="form-control mb-0" value={bio}
                                                        onChange={(e) => setbio(e.target.value)}
                                                        // {...formik.getFieldProps('bio')}
                                                        placeholder=""
                                                        id="Bio" rows="6"></textarea>
                                                    {
                                                        formik.touched.bio && formik.errors.bio && (
                                                            <div className='fv-plugins-message-container ' >
                                                                <div className='fv-help-block'>
                                                                    <span role='alert' className='text-danger'>{formik.errors.bio}</span>
                                                                </div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                                <p>{1000 - bio.length} Characters Remaining.</p>
                                            </Col>
                                            <Col xs="12">
                                                <div className='d-flex align-items-center justify-content-center'>
                                                    <button type='button' onClick={() => setStep(1)} className='btn_back border-0 me-2'>Back</button>
                                                    <button type='submit' className='border-0 ms-2 btn_next'>Next</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
};

export default MentorApplyFrom2;
