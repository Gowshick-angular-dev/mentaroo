import React, { useState, useEffect } from 'react';
import { Container, Row, Col, button, Label, Input, TabContent, TabPane, Nav, NavItem, NavLink, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SideBar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, } from 'reactstrap';
import Select from 'react-select';
import toast from "react-hot-toast";
// import { useAuth } from './core/Auth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { updateProfile, getCourse, getProfile, getMentorProfile, updateMentorProfile, postExperiance, postEducation, getUniversity, getDeletePackage } from './requests';
import PhoneInput from "react-phone-input-2";
import { MentorSaveProgram, getCity, getCountry, getGoals, getIntrest, getJobTitle, getPackages, getSituation, getSkills, getState, getTimeZone } from '../Auth/core/Auth_request';
import { getCompanies, getPrograms } from '../pages/core/_request';
import { useAuth } from '../Auth/core/Auth';
import moment from 'moment';
import cn from 'classnames';
import Meta from '../../services/Meta';
import { InputNumber } from 'primereact/inputnumber';


const EditMyProfile = ({ direction, ...args }) => {

  const options = [
    { value: 'option1', label: 'Admission Strategy ' },
    { value: 'option2', label: 'Career Guidance ' },
    { value: 'option3', label: 'Exam Study Plan ' },
    { value: 'option3', label: 'General Mentorship  ' },
  ];

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [intrests, setIntrests] = useState([]);
  const [intrests2, setIntrests2] = useState([]);
  const [companies, setcompanies] = useState([]);
  const [intrestsSelected, setIntrestsSelected] = useState([]);
  const [intrestsSelected2, setIntrestsSelected2] = useState([]);
  const [loading, setLoading] = useState(false);
  const [Pageloading, setPageLoading] = useState(false);
  const [search, setSearch] = useState('');


  const handleSelectChange = (selectedItems) => {
    setSelectedOptions(selectedItems);
  };

  const [modal, setModal] = useState(false);
  const [modal1, setModal1] = useState(false);
  const [showPopup1, setShowPopup1] = useState(false);
  const [image, setImage] = useState();
  const [preImag, setPreImg] = useState();

  const { currentUser, auth, saveAuth } = useAuth();

  const [currentActiveTab, setCurrentActiveTab] = useState('1');
  const [showPopup, setShowPopup] = useState(false);


  const toggle = (tab) => {
    if (currentActiveTab !== tab) {
      setCurrentActiveTab(tab);
    }
    if (tab === '1') {
      setShowPopup(true);
      setShowPopup1(true);
    } else {
      setShowPopup(false);
      setShowPopup1(false);
    }
  };


  const handleImage = (e) => {
    let file = e.target.files[0]
    const fileExtension = file.name.split(".").at(-1);
    const allowedFileTypes = ["jpg", "png"];
    if (allowedFileTypes?.includes(fileExtension)) {
      setPreImg(URL.createObjectURL(e.target.files[0]))
      setImage(e.target.files[0])
    } else {
      toast.error(`File does not support. Files type must be ${allowedFileTypes.join(", ")}`)
    }
  }

  const togglePopup1 = () => {
    setModal1(!modal1);
    setShowPopup1(false);
  };

  const togglePopup = () => {
    setModal(!modal);
    setShowPopup(false);
  };


  const [selectedOption, setSelectedOption] = useState(
    localStorage.getItem('selectedOption') || 'mentee'
  );

  const [interestList, setInterestList] = useState([])
  const [selectedList, setSelectedList] = useState([])
  const [course, setCourse] = useState([]);
  const [situation, setSituation] = useState([]);
  const [goals, setGoals] = useState([]);
  const [timeZone, setTimeZone] = useState([]);
  const [domailList, setdomainList] = useState([])
  const [jobTitle, setJobTitle] = useState([])
  const [program, setProgram] = useState([])
  const [SkillList, setSkillList] = useState([])
  const [sprogram, setsProgram] = useState([])
  const [packages, setPackages] = useState([])
  const [Price, setPrice] = useState([])
  const [workingStatus, setWorkingStatus] = useState(false)
  const [educationgStatus, setEducationgStatus] = useState(false)
  const [selectSit, setselectSit] = useState([]);
  const [selectGoal, setSelectGoal] = useState([]);
  const [selectZone, setSelectZone] = useState([]);
  const [country, setCountry] = useState([]);
  const [State, setState] = useState([]);
  const [city, setCity] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [exId, setExid] = useState(null);
  const [university, setUniversity] = useState([]);

  const fetchSkills = async (skill) => {
    getSkills().then(res => {
      setSkillList(res.data);
      setInterestList(res.data);
      if (skill?.length > 0) {
        setSelectedList(res.data.filter((e) => skill?.includes(e.id)));
      }
    }).catch(e => {
      console.log(e)
    })
  }

  const fetchPackeges = async () => {
    getPackages().then(res => {
      setPackages(res)
    }).catch(e => {
      console.log(e)
    })
  }

  const fetchUinverSity = async () => {
    getUniversity().then(res => {
      setUniversity(res?.data)
    }).catch(e => {
      console.log(e)
    })
  }


  const months = [{ label: 'Jun', value: 'Jun' }, { label: 'Jul', value: 'Jul' }, { label: 'Aug', value: 'Aug' }, { label: 'Sep', value: 'Sep' }, { label: 'Oct', value: 'Oct' }, { label: 'Nov', value: 'Nov' }, { label: 'Dec', value: 'Dec' }, { label: 'Jan', value: 'Jan' }, { label: 'Feb', value: 'Feb' }, { label: 'Mar', value: 'Mar' }, { label: 'Apr', value: 'Apr' }, { label: 'May', value: 'May' }];

  function generateYearsArray(start, end) {
    const years = [];
    for (let year = start; year <= end; year++) {
      years.push({ label: `${year}`, value: year });
    }
    return years;
  }

  let ExperienceIntialValues = {
    title: '',
    company_name: '',
    college_name: '',
    start_month: '',
    start_year: '',
    end_month: '',
    end_year: '',
    description: ''
  }

  const ExperienceSchema = Yup.object().shape({
    title: Yup.string().required('Enter Your Job Title'),
    company_name: Yup.string(),
    college_name: Yup.string(),
    start_month: Yup.string(),
    start_year: Yup.string(),
    end_month: Yup.string(),
    end_year: Yup.string(),
    description: Yup.string()
  })

  const experienceForm = useFormik({
    initialValues: ExperienceIntialValues,
    validationSchema: ExperienceSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      try {
        setLoading(true)
        var currentMonth = moment(new Date()).format("MMM")
        var CurrentYaer = moment(new Date()).format("YYYY")
        var formData = new FormData()

        formData.append("title", values.title);
        formData.append('company_name', values.company_name);
        formData.append('start_date', values.start_month + ' ' + values.start_year);
        formData.append('end_date', workingStatus ? "Present" : values.end_month + ' ' + values.end_year);
        formData.append('description', values.description);
        formData.append('mentor_id', auth?.user_id);
        formData.append('id', exId ?? '');

        const response = await postExperiance(formData);
        setLoading(false)
        if (response.status == 200) {
          setModal(false);
          toast.success(response?.message ?? 'successfull');
          MentorProfile();
          setExid(null)
          resetForm()
        } else {
          toast.error(response?.message ?? '');
        }
      } catch (error) {
        console.error("err", error.message);
        setLoading(false)
      }
    }
  })

  const educationForm = useFormik({
    initialValues: ExperienceIntialValues,
    validationSchema: ExperienceSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm }) => {
      try {
        setLoading(true)
        var currentMonth = moment(new Date()).format("MMM")
        var CurrentYaer = moment(new Date()).format("YYYY")
        var formData = new FormData()
        formData.append("education", values.title);
        formData.append('university', values.company_name);
        formData.append('start_year', values.start_month + ' ' + values.start_year);
        formData.append('end_year', workingStatus ? "Present" : values.end_month + ' ' + values.end_year);
        formData.append('education_description', values.description);
        formData.append('mentor_id', auth?.user_id);
        formData.append('id', exId ?? '');

        const response = await postEducation(formData);
        setLoading(false)
        if (response.status == 200) {
          setModal1(false);
          toast.success(response?.message ?? '');
          MentorProfile();
          setExid(null)
          resetForm()
        } else {
          toast.error(response?.message ?? '');
        }
      } catch (error) {
        console.error("err", error.message);
        setLoading(false)
      }
    }
  })


  const handleSearch = (key) => {
    key === '' ? setCourse(intrests) : setCourse(intrests?.filter(d => d?.name?.toLowerCase()?.includes(key?.toLowerCase())))
  }

  const handleSearch2 = (key) => {
    key === '' ? setcompanies(intrests2) : setcompanies(intrests2?.filter(d => d?.name?.toLowerCase()?.includes(key?.toLowerCase())))
  }

  const handleSearch3 = (key) => {
    key === '' ? setInterestList(SkillList) : setInterestList(SkillList?.filter(d => d?.name?.toLowerCase()?.includes(key.toLowerCase())))
  }


  const fetchCountry = async () => {
    getCountry().then(res => {
      setCountry(res.data)
    }).catch(e => {
      console.log(e)
    })
  }

  const fetchState = async (id) => {
    getState(id).then(res => {
      setState(res.data)
    }).catch(e => {
      console.log(e)
    })
  }


  const fetchCity = async (id) => {
    getCity(id).then(res => {
      setCity(res.data)
    }).catch(e => {
      console.log(e)
    })
  }

  const UserProfileData = async () => {
    setPageLoading(true);
    getProfile().then(res => {
      formik.setFieldValue("first_name", res?.first_name ?? '')
      formik.setFieldValue("email", res?.email ?? '')
      formik.setFieldValue("phone", res?.phone ?? '')
      setselectSit(res?.current_situation ?? "")
      setSelectGoal(res?.career_goal ?? "")
      setSelectZone(res?.time_zone ?? "")
      setIntrestsSelected(res?.topic_of_interest?.split(',') ?? [])
      setIntrestsSelected2(res?.dream_companies?.split(',') ?? [])
      setImage(res?.image);
      setPreImg(res?.image)
      setPageLoading(false);
    }).catch(err => {
      setPageLoading(false);
    })
  }

  const MentorProfile = async () => {
    setPageLoading(true);
    getMentorProfile().then(res => {
      fetchState(res?.country ?? '');
      fetchCity(res?.state ?? '');
      MentorForm.setFieldValue("first_name", res?.first_name ?? '')
      MentorForm.setFieldValue("country", res?.country ?? '')
      MentorForm.setFieldValue("state", res?.state ?? '')
      MentorForm.setFieldValue("city", res?.city ?? '')
      MentorForm.setFieldValue("email_address", res?.email ?? '')
      MentorForm.setFieldValue("biography", res?.biography ?? '') 
      MentorForm.setFieldValue("phone", res?.phone ?? '')
      MentorForm.setFieldValue("instagram", res?.twitter ?? '')
      MentorForm.setFieldValue("website", res?.personal_website ?? '')
      MentorForm.setFieldValue("company", res?.company ?? '')
      MentorForm.setFieldValue("linkedin", res?.linkedin ?? '')
      MentorForm.setFieldValue("experience", res?.year_of_experience ?? '')
      MentorForm.setFieldValue("time_zone", res?.time_zone ?? '')
      MentorForm.setFieldValue("domain_expert", res?.domain_expertise ?? '')
      MentorForm.setFieldValue("job_title", res?.job_title ?? '')
      MentorForm.setFieldValue("image", image ?? '');
      setbio(res?.biography ?? ''); 
      setExperience(res?.experience);
      setEducation(res?.education)
      setImage(res?.image);
      setPreImg(res?.image);
      const skill = res?.skills?.split(',');
      fetchSkills(skill);
      const prgramId = res?.programs?.map(e => e?.program_id)
      fetchPrograms(prgramId); 
      const groupedArray = res?.programs?.reduce((acc, obj) => {
        const index = obj.program_id - 1; // Adjusting index since proId starts from 4
        if (!acc[index]) {
          acc[index] = [];
        }
        acc[index].push(obj);
        return acc;
      }, []);
      setPrice(groupedArray?.filter(e => e != []) ?? [])
      setPageLoading(false);
    }).catch(err => {
      setPageLoading(false);
    })
  }

  const getCoursesList = async () => {
    getIntrest().then(res => {
      setCourse(res.data);
      setIntrests(res.data);
    }).catch(err => {
      console.log(err)
    })
  }

  const getCompaniesList = async () => {
    getCompanies().then(res => {
      setcompanies(res.data)
      setIntrests2(res.data);
    }).catch(err => {
      console.log(err)
    })
  }

  const getSituationList = async () => {
    getSituation().then(res => {
      setSituation(res.data);
    }).catch(err => {
      console.log(err)
    })
  }

  const getGoalsList = async () => {
    getGoals().then(res => {
      setGoals(res.data);
    }).catch(err => {
      console.log(err)
    })
  }

  const getTimeZoneList = async () => {
    getTimeZone().then(res => {
      setTimeZone(res.data);
    }).catch(err => {
      console.log(err)
    })
  }

  const initialValues = {
    first_name: '',
    email: '',
    phone: '',
    time_zone: '',
    current_situation: '',
    career_goal: '',
    topic_of_interest: '',
    dream_companies: '',
  }

  const taskSaveSchema = Yup.object().shape({
    first_name: Yup.string().required('Enter Your Name'),
    email: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter a valid email').required('Enter Your Email'),
  })

  const initialValue = {
    first_name: '',
    email_address: '',
    phone: "",
    instagram: '',
    state: "",
    country: '',
    city: '',
    linkedin: '',
    biography: '',
    website: '',
    company: '',
    experience: '',
    time_zone: '',
    domain_expert: '',
    job_title: ''
  }

  const MentorSchema = Yup.object().shape({
    first_name: Yup.string().required('Enter Your Name'),
    email_address: Yup.string().matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,'Enter a valid email').required('Enter Your Email'),
  })
  
  const [bio,setbio] = useState('') 


  const MentorForm = useFormik({
    initialValues: initialValue,
    validationSchema: MentorSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm, setErrors }) => {
      setLoading(true);
      try {  

        if(!values.first_name || !values.email_address  || !values.country || !image || !values.state || !values.city ) {
          toast.error("Please Fill All Required!"); 
          setLoading(false);
          window.scrollTo(0, 0);
          window.history.scrollRestoration = 'manual';
         return toggle('1'); 
        }else if(!values.company || !values.job_title || !values.experience || selectedList.length == 0 || !bio || !values.domain_expert ) {
          toast.error("Please Fill All Required!"); 
          setLoading(false);
          window.scrollTo(0, 0);
          window.history.scrollRestoration = 'manual';
          return toggle('2'); 
        }

        var formData = new FormData();
        formData.append("first_name", values.first_name ?? '')
        formData.append("last_name", '')
        formData.append("email", values.email_address ?? '')
        formData.append("twitter_link", values.instagram ?? '')
        formData.append("linkedin_link", values.linkedin ?? '')
        // formData.append("biography", values.biography ?? '')
        formData.append("biography", bio ?? '')
        formData.append("auth_token", localStorage.getItem('token') ?? '')
        formData.append("country", values.country ?? '')
        formData.append("state", values.state ?? '')
        formData.append("city", values.city ?? '')
        formData.append("company", values.company ?? "")
        formData.append("time_zone", values.time_zone ?? '')
        formData.append("personal_website", values.website ?? '')
        formData.append("domain_expertise", values.domain_expert ?? '')
        formData.append("year_of_experience", values.experience ?? '')
        formData.append("job_title", values.job_title ?? '')
        formData.append("phone", values.phone ?? '')
        formData.append("image", image)

        if (selectedList.length > 0) {
          selectedList.map((v, i) => {
            formData.append(`skills[${i}]`, v.id ?? '');
          })
        }

        const respnse = await updateMentorProfile(formData)
        var formD = new FormData()
        formD.append(`mentor_id`, auth?.user_id)
        if (Price?.length > 0) {
          Price?.map((v, i) => {
            v.map((d, j) => {
              formD.append(`program_id[${i}]`, d?.program_id)
              formD.append(`package_id[${j}]`, d?.package_id)
              formD.append(`price[${i}][${j}]`, d?.price ?? 0)
            })
          })
        }
        const res = await MentorSaveProgram(formD)
        toast.success("updated Successfull")
        setLoading(false);
        saveAuth({ ...auth, first_name: values.first_name, email: values.email_address })
      } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  })


  const formik = useFormik({
    initialValues,
    validationSchema: taskSaveSchema,
    onSubmit: async (values, { setStatus, setSubmitting, resetForm, setErrors }) => {
      setLoading(true);
      try {
        var formData = new FormData()
        formData.append("first_name", values.first_name)
        formData.append("last_name", '')
        formData.append("email", values.email)
        formData.append("auth_token", localStorage.getItem('token'))
        formData.append("phone", values.phone)
        formData.append("current_situation", selectSit ?? values.current_situation)
        formData.append("time_zone", selectZone ?? values.time_zone)
        formData.append("career_goal", selectGoal ?? values.career_goal)
        formData.append("image", image)

        if (intrestsSelected.length > 0) {
          intrestsSelected.map((s, i) => {
            formData.append(`topic_of_interest[${i}]`, s)
          })
        }

        if (intrestsSelected2.length > 0) {
          intrestsSelected2.map((s, i) => {
            formData.append(`dream_companies[${i}]`, s)
          })
        }

        const response = await updateProfile(formData);
        setLoading(false);
        if (response?.status == "failed") {
          return toast.error(response?.error_reason)
        }
        toast.success("updated Successfull")
        const careerGoal = goals.find(e => e?.id == selectGoal ?? values.career_goal) ?? {};
        saveAuth({ ...auth, first_name: response?.first_name, email: response?.email, career_goal: careerGoal })
      } catch (error) {
        console.error(error)
        setStatus('The registration details is incorrect');
        setSubmitting(false);
        setLoading(false);
      }
    }
  })


  const fetchJobs = async () => {
    getJobTitle().then(res => {
      setJobTitle(res.data);
    }).catch(e => {
      console.log(e)
    })
  }

  const fetchPrograms = async (prgramId) => {
    getPrograms().then(res => {
      setProgram(res.data);
      if (prgramId?.length > 0) {
        setsProgram(res?.data.filter(e => prgramId?.includes(e?.id)))
      }
    }).catch(e => {
      console.log(e)
    })
  }

  const fetchDomains = async () => {
    getIntrest().then(res => {
      setdomainList(res.data)
    }).catch(e => {
      console.log(e)
    })
  }


  useEffect(() => {
    if (currentUser == 'mentor') {
      MentorProfile();
      fetchCountry();
      // fetchSkills();
      fetchPackeges();
      fetchUinverSity()
      fetchJobs();
      // fetchPrograms();
      fetchDomains();
    } else {
      getCoursesList();
      getSituationList();
      UserProfileData();
      getGoalsList();
    }
    getTimeZoneList();
    getCompaniesList();
  }, [])


  useEffect(() => {
    const storedSelectedOption = localStorage.getItem('selectedOption');
    if (storedSelectedOption) {
      setSelectedOption(storedSelectedOption);
    }
  }, []);



  return (
    <> 
    <Meta title={'Profile'}  />

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
              Pageloading ? <div className='pageLoading'>
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
                    {currentUser === 'mentee' ? (
                      <form onSubmit={formik.handleSubmit}>
                        <div className=''>
                          <h2 className='mb-4'>My Profile</h2>
                          <Row>
                            <Col xxl="3" xl="4">
                              <div className='text-center custome_profile py-4 px-xxl-4 mb-4'>
                                <img src={preImag ?? ''} alt="" onError={(e) => e.currentTarget.src = '/assets/images/UserProfile.png'} className="me-2" />
                                <h5 className='fw-600'>Profile image</h5>
                                <p>Image must be .jpg or.png with minimum size of 160x160 pixels</p>
                                <button type='button' onClick={() => document.getElementById('OpenEditFiles')?.click()}>Upload photo</button>
                                <input type='file' onChange={(e) => handleImage(e)} className='d-none' id='OpenEditFiles' />
                              </div>
                            </Col>
                            <Col xl="8" >
                              <div className='custome_profile_right mb-3'>
                                <Row>
                                  <Col md="6">
                                    <div className="form-group mb-3">
                                      <Label className="form-label" htmlFor='pName'>Name</Label>
                                      <div className="input-container mb-1">
                                        <Input type="text" className="form-control" id='pName' {...formik.getFieldProps('first_name')} />
                                      </div>
                                      {formik.touched.first_name && formik.errors.first_name && (
                                        <div className='fv-plugins-message-container'>
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger'>{formik.errors.first_name}</span>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </Col>

                                  <Col md="6">
                                    <div className="form-group mb-3">
                                      <Label className="form-label" htmlFor='pEmail'>Email Address</Label>
                                        <div className="input-container mb-1">
                                          <Input type="text" readOnly={true} className="form-control" id='pEmail' {...formik.getFieldProps('email')} />
                                        </div>
                                        {formik.touched.email && formik.errors.email && (
                                          <div className='fv-plugins-message-container'>
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger'>{formik.errors.email}</span>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </Col>

                                  <Col md="6">
                                    <div className="form-group">
                                      <Label className="form-label" htmlFor="p_number">
                                        Phone Number
                                      </Label>
                                      <PhoneInput
                                        country={"in"}
                                        countryCodeEditable={false}
                                        inputProps={{
                                          id: "p_number",
                                        }}
                                        value={formik.getFieldProps('phone').value ?? ''}
                                        placeholder="9176-5432-1023"
                                        onChange={(phone) =>
                                          formik.setFieldValue("phone", phone)
                                        }
                                        className="mb-1"
                                      />
                                      {formik.touched.phone_number &&
                                        formik.errors.phone_number && (
                                          <div className="fv-plugins-message-container ">
                                            <div className="fv-help-block">
                                              <span role="alert" className="text-danger ">
                                                {formik.errors.phone_number}
                                              </span>
                                            </div>
                                          </div>
                                        )}
                                    </div>
                                  </Col>

                                  <Col md="6">
                                    <div className="form-group custome_dripo mb-3">
                                      <Label className="form-label" htmlFor="current_sit"> Current situation</Label>
                                      <div className="custome_dripo">
                                        <Select
                                          isSearchable={false}
                                          placeholder='Select any one'
                                          classNamePrefix="select"
                                          inputId='current_sit'
                                          value={situation.find(e => e?.id == selectSit) ?? ''}
                                          options={situation}
                                          getOptionLabel={(e) => e?.name}
                                          getOptionValue={(e) => e?.id}
                                          onChange={(v) => { formik.setFieldValue("current_situation", v?.id); setselectSit(v?.id) }}
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

                                  <Col md="6">
                                    <div className="form-group custome_dripo mb-3">
                                      <Label className="form-label" htmlFor="Career_Goal"> Career Goal </Label>
                                      <div className="custome_dripo">
                                        <Select
                                          isSearchable={false}
                                          placeholder='Select any one'
                                          classNamePrefix="select"
                                          inputId='Career_Goal'
                                          value={goals.find(e => e?.id == selectGoal) ?? ''}
                                          options={goals}
                                          getOptionLabel={(e) => e?.name}
                                          getOptionValue={(e) => e?.id}
                                          onChange={(v) => { formik.setFieldValue("career_goal", v?.id); setSelectGoal(v?.id) }}
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

                                  <Col md="6">
                                    <div className="form-group custome_dripo mb-3">
                                      <Label className="form-label" htmlFor="Timezone222"> Timezone </Label>
                                      <div className="custome_dripo">
                                        <Select
                                          isSearchable={false}
                                          placeholder='Select any one'
                                          classNamePrefix="select"
                                          inputId='Timezone222'
                                          value={timeZone.find(e => e.id == selectZone) ?? ''}
                                          options={timeZone}
                                          getOptionLabel={(e) => e?.name}
                                          getOptionValue={(e) => e?.id}
                                          onChange={(v) => { formik.setFieldValue("time_zone", v?.id); setSelectZone(v?.id) }}
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

                                  <div className="form-group custome_dripo mb-3">
                                    <Label className="form-label" htmlFor="topicsOfIntrest">
                                      Topics of Interest
                                    </Label>
                                    <div className="multi_dropdown ">
                                      <div className="form-group has-search mb-3 px-md-3">
                                        <span className="fa fa-search form-control-feedback"></span>
                                        <input type="search" className="form-control"  id='topicsOfIntrest' placeholder="Search" value={search} onChange={(e) => {
                                          setSearch(e.target?.value);
                                          handleSearch(e.target?.value);
                                        }} />
                                      </div>
                                      <div className='custome_dropdown'>
                                        <Row className='px-md-3'>
                                          {course?.map((int, i) => {
                                            return (
                                              <Col xs="6 " xxl="3" lg="4" className='mb-3 cursor_pointer' key={i} onClick={() => {
                                                if (intrestsSelected.includes(int?.id)) {
                                                  setIntrestsSelected((pre) => pre.filter(element => element !== int?.id));
                                                } else {
                                                  setIntrestsSelected((pre) => [...pre, int?.id]);
                                                }
                                                setSearch('');
                                              }}>
                                                <div className={`custome-selcte ${intrestsSelected?.includes(int?.id) && 'avtive-sect'}`}>
                                                  <h5 className='me-2'>{int?.name}</h5>
                                                  {intrestsSelected?.includes(int?.id) && <img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />}
                                                </div>
                                              </Col>
                                            )
                                          })}
                                        </Row>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="form-group custome_dripo mb-3">
                                    <Label className="form-label" htmlFor="dreamsCom">
                                      Dream companies
                                    </Label>
                                    <div className="multi_dropdown ">
                                      <div className="form-group has-search mb-3 px-md-3">
                                        <span className="fa fa-search form-control-feedback"></span>
                                        <input type="search" id='dreamsCom'  onChange={(e) => handleSearch2(e.target?.value)} className="form-control" placeholder="I Would Like To Work For...." />
                                      </div>
                                      <div className='custome_dropdown'>
                                        <Row className='px-md-3'>
                                          {companies?.map((int, i) => {
                                            return (
                                              <Col xs="6 " xxl="3" lg="4" key={i} className='mb-3 cursor_pointer' onClick={() => {
                                                if (intrestsSelected2?.includes(int?.id)) {
                                                  setIntrestsSelected2((pre) => pre.filter(element => element !== int?.id));
                                                } else {
                                                  setIntrestsSelected2((pre) => [...pre, int?.id]);
                                                }
                                              }}>
                                                <div className={`custome-selcte ${intrestsSelected2?.includes(int?.id) && 'avtive-sect'}`}>
                                                  <h5 className='me-2'>{int?.name}</h5>
                                                  {intrestsSelected2?.includes(int?.id) && <img src={`/assets/images/homepg/Login-Register-flow/check.png`} alt="" className="img-rd" />}
                                                </div>
                                              </Col>
                                            )
                                          })}
                                        </Row>
                                      </div>
                                    </div>


                                  </div>

                                  <div className="mt-4">
                                    <button type='submit' disabled={loading} className="save_change_btn  me-3 btn">
                                      {
                                        loading ? <span
                                          className="spinner-border spinner-border-sm"
                                          aria-hidden="true"
                                        ></span> : "Update"
                                      }
                                    </button>
                                    <button type='button' onClick={() => {
                                      formik.resetForm(); setIntrestsSelected2([]); setSelectZone();
                                      setIntrestsSelected([]); setselectSit(); setSelectGoal(); setImage(); setPreImg()
                                    }} className="cancel_btn btn btn-secondary">cancel</button>
                                  </div>
                                </Row>
                              </div>
                            </Col>
                          </Row></div>
                      </form>
                    ) : (
                      <div className='tab_my_program custome_bxcvdWf pb-5'>
                        <h2 className='mb-4'>Edit My Profile</h2>
                        <Nav tabs className="mt-3 custome_screy mb-4">
                          <NavItem>
                            <NavLink 
                              className={classnames({
                                active:
                                  currentActiveTab === '1'
                              })}
                              onClick={() => { toggle('1'); }}
                            >
                              Profile Information
                            </NavLink>
                          </NavItem>
                          <NavItem>
                            <NavLink
                              className={classnames({
                                active:
                                  currentActiveTab === '2'
                              })}
                              onClick={() => { toggle('2'); }}
                            >
                              About You
                            </NavLink>
                          </NavItem>

                          <NavItem>
                            <NavLink
                              className={classnames({
                                active:
                                  currentActiveTab === '3'
                              })}
                              onClick={() => { toggle('3'); }}
                            >
                              Your Experience & Education
                            </NavLink>
                          </NavItem>
                        </Nav>

                        <Modal className='cutome_popup ' isOpen={modal} toggle={togglePopup} centered={true}  {...args}>
                          <ModalBody className='p-4'>
                            <form onSubmit={experienceForm.handleSubmit}>
                              <div className='px-2 position-relative'>
                                <h2 className='mt-3 fw-bold'>{exId != null ? "Update" : "Add"}  Experience</h2>
                                <p className='fw-600'>* Indicates required</p>

                                <div className='pt-3'>
                                  <div className="form-group mb-3">
                                    <Label className="form-label fw-600" htmlFor="TitleE">Title*</Label>
                                    <div className="input-container mb-1"><Input type="text" className="form-control" {...experienceForm.getFieldProps('title')} id="TitleE" placeholder="Software Development Engineer" required="" /></div>
                                    {
                                      experienceForm.touched.title && experienceForm.errors.title && (
                                        <div className='fv-plugins-message-container ' >
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger '>{experienceForm.errors.title}</span>
                                          </div>
                                        </div>
                                      )
                                    }
                                  </div>

                                  <div className="form-group custome_dripo mb-3">
                                    <Label className="form-label" htmlFor="company3">
                                      Company Name *
                                    </Label>
                                    <div className="custome_dripo">

                                      {/* <Select
                                  isSearchable={false}
                                  placeholder='Ex. Microsoft'
                                  onChange={(e) => experienceForm.setFieldValue('company_name', e?.id)}
                                  classNamePrefix="select"
                                  inputId='company3'
                                  options={companies}
                                  getOptionLabel={(e)=> e?.name}
                                  getOptionValue={(e)=> e?.id}
                                  theme={(theme) => ({
                                    ...theme,
                                    colors: {
                                      ...theme.colors,
                                      primary25: '#f4f7f7',
                                      primary: '#125453',
                                      primary50: '#f4f7f7'
                                    },
                                  })}
                                /> */}

                                      <div className="input-container mb-1"><Input type="text" className="form-control" {...experienceForm.getFieldProps('company_name')} id="company3" placeholder="Enter Company Name" required="" /></div>
                                    </div>
                                    {
                                      experienceForm.touched.company_name && experienceForm.errors.company_name && (
                                        <div className='fv-plugins-message-container ' >
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger '>{experienceForm.errors.company_name}</span>
                                          </div>
                                        </div>
                                      )
                                    }
                                  </div>

                                  <div className='mb-2 '>
                                    <input type="checkbox" id="vehicle1" checked={workingStatus} onChange={(e) => setWorkingStatus(e.target.checked)} name="vehicle1" className='' />
                                    <label htmlFor="vehicle1" className='ms-2'> I am currently working in this role </label>
                                  </div>


                                  <Label className="form-label" htmlFor="sDate">
                                    Start Date
                                  </Label>

                                  <Row>
                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={false}
                                            placeholder='Month'
                                            onChange={(e) => experienceForm.setFieldValue('start_month', e?.value)}
                                            inputId='sDate'
                                            value={months.find(e => e.value == experienceForm.getFieldProps('start_month').value) ?? ''}
                                            classNamePrefix="select"
                                            options={months}
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
                                          experienceForm.touched.start_month && experienceForm.errors.start_month && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{experienceForm.errors.start_month}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </Col>

                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">

                                          <Select
                                            isSearchable={false}
                                            placeholder='Year'
                                            classNamePrefix="select"
                                            onChange={(e) => experienceForm.setFieldValue('start_year', e?.value)}
                                            value={generateYearsArray(1997, new Date().getFullYear()).find(e => e.value == experienceForm.getFieldProps('start_year').value) ?? ''}
                                            options={generateYearsArray(1997, new Date().getFullYear())}
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

                                  <Label className="form-label" htmlFor="eDate">
                                    End Date
                                  </Label>

                                  <Row>
                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">

                                          <Select
                                            isSearchable={false}
                                            placeholder='Month'
                                            onChange={(e) => experienceForm.setFieldValue('end_month', e?.value)}
                                            value={months.find(e => e.value == experienceForm.getFieldProps('end_month').value) ?? ''}
                                            inputId='eDate'
                                            classNamePrefix="select"
                                            options={months}
                                            isDisabled={workingStatus}
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
                                          experienceForm.touched.end_month && experienceForm.errors.end_month && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{experienceForm.errors.end_month}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </Col>

                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={false}
                                            placeholder='Year'
                                            classNamePrefix="select"
                                            onChange={(e) => experienceForm.setFieldValue('end_year', e?.value)}
                                            isDisabled={workingStatus}
                                            value={generateYearsArray(1997, new Date().getFullYear()).find(e => e.value == experienceForm.getFieldProps('end_year').value) ?? ''}
                                            options={generateYearsArray(1997, new Date().getFullYear())}
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


                                  <div className="form-group">
                                    <Label className="form-label" htmlFor="description">Description</Label>
                                    <textarea className="form-control mb-1" {...experienceForm.getFieldProps('description')} placeholder="Write Description..."
                                      id="description" rows="4"></textarea>
                                    {
                                      experienceForm.touched.description && experienceForm.errors.description && (
                                        <div className='fv-plugins-message-container ' >
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger '>{experienceForm.errors.description}</span>
                                          </div>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>

                                <div className='d-flex align-items-center justify-content-start m-4'><button type="submit" className='border-0 btn_next me-3'>{
                                  loading ? <span
                                    className="spinner-border spinner-border-sm"
                                    aria-hidden="true"
                                  ></span> :
                                    exId != null ? "Update" : "Save"
                                }</button> <button type='button' onClick={experienceForm.resetForm} className='border-0 btn_cancel'>Cancel</button></div>
                                <div role='button' className="model_close_icon" onClick={togglePopup}> <img id='cancelHoverId' src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /></div>
                              </div>
                            </form>
                          </ModalBody>
                        </Modal>

                        <Modal className='cutome_popup ' isOpen={modal1} toggle={togglePopup1} centered={true}  {...args}>
                          <ModalBody className='p-4 '>
                            <form onSubmit={educationForm.handleSubmit}>
                              <div className='px-2 position-relative'>
                                <h2 className=' mt-3 fw-bold'>{exId != null ? "Update" : "Add"} Education</h2>
                                <p className='fw-600'>* Indicates required</p>

                                <div className='pt-3'>
                                  <div className="form-group mb-3">
                                    <Label className="form-label fw-600" htmlFor="TitleE">Title*</Label>
                                    <div className="input-container mb-1"><Input type="text" className="form-control" {...educationForm.getFieldProps('title')} id="TitleE" placeholder="Bachelor's degree Field Of Study Computer" required="" /></div>
                                    {
                                      educationForm.touched.title && educationForm.errors.title && (
                                        <div className='fv-plugins-message-container ' >
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger '>{educationForm.errors.title}</span>
                                          </div>
                                        </div>
                                      )
                                    }
                                  </div>

                                  <div className="form-group custome_dripo mb-3">
                                    <Label className="form-label" htmlFor="company3">
                                      College Name/ University Name *
                                    </Label>
                                    <div className="custome_dripo">
                                      <Select
                                        isSearchable={false}
                                        placeholder='Ex. Moscow State Linguistic University'
                                        onChange={(e) => educationForm.setFieldValue('company_name', e?.id)}
                                        classNamePrefix="select"
                                        value={university.find(e => e?.id == educationForm.getFieldProps('company_name').value) ?? ''}
                                        inputId='company3'
                                        options={university}
                                        getOptionLabel={(e) => e?.name}
                                        getOptionValue={(e) => e?.id}
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


                                  <div className='mb-2 '>
                                    <input type="checkbox" id="vehicle1" checked={workingStatus} onChange={(e) => setWorkingStatus(e.target.checked)} name="vehicle1" className='' />
                                    <label htmlFor="vehicle1" className='ms-2'> I am currently Studying </label>
                                  </div>


                                  <Label className="form-label" htmlFor="sDate">
                                    Start Date
                                  </Label>

                                  <Row>
                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={false}
                                            placeholder='Month'
                                            onChange={(e) => educationForm.setFieldValue('start_month', e?.value)}
                                            inputId='sDate'
                                            value={months.find(e => e.value == educationForm.getFieldProps('start_month').value) ?? ''}
                                            classNamePrefix="select"
                                            options={months}
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
                                          educationForm.touched.start_month && educationForm.errors.start_month && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{educationForm.errors.start_month}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </Col>

                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">

                                          <Select
                                            isSearchable={false}
                                            placeholder='Year'
                                            classNamePrefix="select"
                                            onChange={(e) => educationForm.setFieldValue('start_year', e?.value)}
                                            value={generateYearsArray(1997, new Date().getFullYear()).find(e => e.value == educationForm.getFieldProps('start_year').value) ?? ''}
                                            options={generateYearsArray(1997, new Date().getFullYear())}
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

                                  <Label className="form-label" htmlFor="eDate">
                                    End Date
                                  </Label>

                                  <Row>
                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">

                                          <Select
                                            isSearchable={false}
                                            placeholder='Month'
                                            onChange={(e) => educationForm.setFieldValue('end_month', e?.value)}
                                            value={months.find(e => e.value == educationForm.getFieldProps('end_month').value) ?? ''}
                                            inputId='eDate'
                                            classNamePrefix="select"
                                            options={months}
                                            isDisabled={workingStatus}
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
                                          educationForm.touched.end_month && educationForm.errors.end_month && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{educationForm.errors.end_month}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </Col>

                                    <Col lg="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={false}
                                            placeholder='Year'
                                            classNamePrefix="select"
                                            onChange={(e) => educationForm.setFieldValue('end_year', e?.value) ?? ''}
                                            isDisabled={workingStatus}
                                            value={generateYearsArray(1997, new Date().getFullYear()).find(e => e.value == educationForm.getFieldProps('end_year').value) ?? ''}
                                            options={generateYearsArray(1997, new Date().getFullYear())}
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


                                  <div className="form-group">
                                    <Label className="form-label" htmlFor="description">Description</Label>
                                    <textarea className="form-control mb-1" {...educationForm.getFieldProps('description')} placeholder="Write Description..."
                                      id="description" rows="4"></textarea>
                                    {
                                      educationForm.touched.description && educationForm.errors.description && (
                                        <div className='fv-plugins-message-container ' >
                                          <div className='fv-help-block'>
                                            <span role='alert' className='text-danger '>{educationForm.errors.description}</span>
                                          </div>
                                        </div>
                                      )
                                    }
                                  </div>
                                </div>

                                <div className='d-flex align-items-center justify-content-start m-4'><button type="submit" className='border-0 btn_next me-3'>{
                                  loading ? <span
                                    className="spinner-border spinner-border-sm"
                                    aria-hidden="true"
                                  ></span> :
                                    exId != null ? "Update" : "Save"}</button> <button type='button' onClick={educationForm.resetForm} className='border-0 btn_cancel'>Cancel</button></div>
                                <div role='button' className="model_close_icon" onClick={togglePopup1}> <img id='cancelHoverId' src={`/assets/images/cancel.png`} alt="" className="img_popuphgsd" /></div>
                              </div>
                            </form>
                          </ModalBody>

                        </Modal>

                        <form onSubmit={MentorForm.handleSubmit}>
                          <TabContent activeTab={currentActiveTab}>
                            <TabPane tabId="1">
                              <div className='tab_body p-4 mt-3 custome_cad col-xl-10'>
                                <div className=''>
                                  <Row>
                                    <Col xs="12">
                                      <div className="form-group ">
                                        <Label className="form-label" htmlFor="upload">Photo <span className='text-danger'>*</span></Label>
                                        <div className='d-flex align-items-center mb-3'>
                                          <img src={preImag ?? ""} alt="" onError={(e) => e.currentTarget.src = `/assets/images/UserProfile.png`} className="photo_upload_img me-3" />
                                          <div role='button' onClick={() => document.getElementById('OpenEditFiles2')?.click()} className='photo_upload d-flex align-items-center'>
                                            <img src={`/assets/images/Icons/9.png`} alt="" className="img-rd me-2" />
                                            <p className='mb-0'>Upload Photo</p>
                                          </div>
                                          <input type='file' onChange={(e) => handleImage(e)} className='d-none' id='OpenEditFiles2' />
                                        </div>
                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group mb-3">
                                        <Label className="form-label" htmlFor="fnume">Full Name <span className='text-danger'>*</span></Label>
                                        <div className="input-container mb-1">
                                          <Input type="text" className="form-control" {...MentorForm.getFieldProps('first_name')} id="fnume" placeholder="Enter Full Name" required="" />
                                          <img src={`/assets/images/homepg/Login-Register-flow/__Name.png`} alt="" className="" />
                                        </div>
                                        {MentorForm.touched.first_name && MentorForm.errors.first_name && (
                                          <div className='fv-plugins-message-container ' >
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger '>{MentorForm.errors.first_name}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group mb-3">
                                        <Label className="form-label" htmlFor="email46464"> Email Address <span className='text-danger'>*</span></Label>
                                        <div className="input-container mb-1">
                                          <Input type="text" readOnly={true} className="form-control" {...MentorForm.getFieldProps('email_address')} id="email46464" placeholder="Email Address" required="" />
                                          <img src={`/assets/images/homepg/Login-Register-flow/__email.png`} alt="" className="" />
                                        </div>
                                        {MentorForm.touched.email_address && MentorForm.errors.email_address && (
                                          <div className='fv-plugins-message-container ' >
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger '>{MentorForm.errors.email_address}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group">
                                        <Label className="form-label" htmlFor="p_number">
                                          Phone Number <span className='text-danger'>*</span>
                                        </Label>
                                        <PhoneInput
                                          country={'in'} 
                                          countryCodeEditable={false}
                                          inputProps={{
                                            id: 'p_number',
                                            name: 'phone_number'
                                          }}
                                          value={MentorForm.getFieldProps('phone').value}
                                          className='mb-1'
                                          placeholder=''
                                          onChange={phone => MentorForm.setFieldValue('phone', phone)}
                                        />

                                        {MentorForm.touched.phone && MentorForm.errors.phone && (
                                          <div className='fv-plugins-message-container ' >
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger '>{MentorForm.errors.phone}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="country">
                                          Country <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={true}
                                            placeholder='Country'
                                            inputId='country'
                                            value={country.find(e => e?.id == MentorForm.getFieldProps('country').value) ?? ''}
                                            classNamePrefix="select"
                                            options={country}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={e => { MentorForm.setFieldValue('country', e?.id); fetchState(e?.id) }}
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
                                          {MentorForm.touched.country && MentorForm.errors.country && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{MentorForm.errors.country}</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="state">
                                          State <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={true}
                                            placeholder='State'
                                            classNamePrefix="select"
                                            inputId='state'
                                            value={State.find(e => e.id == MentorForm.getFieldProps('state').value) ?? ''}
                                            options={State}
                                            getOptionLabel={(e) => e?.state_name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={(e) => { MentorForm.setFieldValue('state', e?.id); fetchCity(e?.id) }}
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
                                          {MentorForm.touched.state && MentorForm.errors.state && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{MentorForm.errors.state}</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="city">
                                          City <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={true}
                                            placeholder='City'
                                            classNamePrefix="select"
                                            inputId='city'
                                            value={city.find(e => e.id == MentorForm.getFieldProps('city').value) ?? ''}
                                            options={city}
                                            getOptionLabel={(e) => e?.city_name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={(e) => { MentorForm.setFieldValue('city', e?.id) }}
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
                                          {MentorForm.touched.city && MentorForm.errors.city && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{MentorForm.errors.city}</span>
                                              </div>
                                            </div>
                                          )}
                                        </div>

                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group mb-3">
                                        <Label className="form-label" htmlFor="website">Personal Website(optional)</Label>
                                        <div className="input-container mb-1">
                                          <Input type="text" className="form-control" {...MentorForm.getFieldProps('website')} id="website" placeholder="Personal Website" required="" />
                                        </div>
                                        {MentorForm.touched.website && MentorForm.errors.website && (
                                          <div className='fv-plugins-message-container ' >
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger '>{MentorForm.errors.website}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group mb-3">
                                        <Label className="form-label" htmlFor="linkedin">Linkedin</Label>
                                        <div className="input-container mb-1">
                                          <Input type="text" className="form-control" {...MentorForm.getFieldProps('linkedin')} id="linkedin" placeholder="Linkedin" required="" />
                                        </div>
                                        {MentorForm.touched.linkedin && MentorForm.errors.linkedin && (
                                          <div className='fv-plugins-message-container ' >
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger '>{MentorForm.errors.linkedin}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Col>
                                    <Col md="6">
                                      <div className="form-group mb-3">
                                        <Label className="form-label" htmlFor="instagram">Instagram (Optional)</Label>
                                        <div className="input-container mb-1">
                                          <Input type="text" className="form-control" {...MentorForm.getFieldProps("instagram")} id="instagram" placeholder="Instagram" required="" />
                                        </div>
                                        {MentorForm.touched.instagram && MentorForm.errors.instagram && (
                                          <div className='fv-plugins-message-container ' >
                                            <div className='fv-help-block'>
                                              <span role='alert' className='text-danger '>{MentorForm.errors.instagram}</span>
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    </Col>

                                    <Col xs="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="timeZone">
                                          Select your time zone
                                        </Label>
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={true}
                                            placeholder='select'
                                            classNamePrefix="select"
                                            inputId='timeZone'
                                            value={timeZone.find(e => e?.id == MentorForm.getFieldProps('time_zone').value) ?? ''}
                                            options={timeZone}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={(e) => MentorForm.setFieldValue('time_zone', e?.id)}
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
                                          MentorForm.touched.time_zone && MentorForm.errors.time_zone && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{MentorForm.errors.time_zone}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                        </div>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </TabPane>

                            <TabPane tabId="2">
                              <div className='tab_body p-4 mt-3 custome_cad col-xl-10'>
                                <div className=''>
                                  <Row>
                                    <Col md="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="jobTitle">
                                          Job title <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={true}
                                            placeholder='Select'
                                            inputId='jobTitle'
                                            classNamePrefix="select"
                                            value={jobTitle.find(e => e?.id == MentorForm.getFieldProps('job_title').value) ?? ''}
                                            options={jobTitle}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={(e) => MentorForm.setFieldValue('job_title', e?.id)}
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
                                            MentorForm.touched.job_title && MentorForm.errors.job_title && (
                                              <div className='fv-plugins-message-container ' >
                                                <div className='fv-help-block'>
                                                  <span role='alert' className='text-danger '>{MentorForm.errors.job_title}</span>
                                                </div>
                                              </div>
                                            )
                                          }
                                        </div>
                                      </div>
                                    </Col>

                                    <Col md="6">
                                      <div className="form-group mb-3">
                                        <Label className="form-label" htmlFor="experienceYear">Company <span className='text-danger'>*</span></Label>
                                        <div className="input-container mb-1">
                                          <Select
                                            isSearchable={true}
                                            placeholder='select'
                                            classNamePrefix="select"
                                            inputId='experienceYear'
                                            value={companies.find(e => e?.id == MentorForm.getFieldProps('company').value) ?? ''}
                                            options={companies}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={(e) => MentorForm.setFieldValue('company', e?.id)}
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
                                          MentorForm.touched.company && MentorForm.errors.company && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger '>{MentorForm.errors.company}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                    </Col>

                                    <Col md="6">
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="domainExpertise">
                                          Domain Expertise <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="custome_dripo">
                                          <Select
                                            isSearchable={true}
                                            placeholder='select'
                                            classNamePrefix="select"
                                            inputId='domainExpertise'
                                            value={domailList.find(e => e?.id == MentorForm.getFieldProps("domain_expert").value) ?? ''}
                                            options={domailList}
                                            getOptionLabel={(e) => e?.name}
                                            getOptionValue={(e) => e?.id}
                                            onChange={(e) => MentorForm.setFieldValue('domain_expert', e?.id)}
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
                                            MentorForm.touched.domain_expert && MentorForm.errors.domain_expert && (
                                              <div className='fv-plugins-message-container ' >
                                                <div className='fv-help-block'>
                                                  <span role='alert' className='text-danger '>{MentorForm.errors.domain_expert}</span>
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
                                          Years of Experience <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="input-container">
                                          <Input type="text" className="form-control" {...MentorForm.getFieldProps('experience')} id="company" placeholder="" required="" />
                                        </div>

                                      </div>
                                    </Col>

                                    <Col xs="12" className='custome_profile_right remove_shadow'>
                                      <div className="form-group custome_dripo mb-3">
                                        <Label className="form-label" htmlFor="Skills_for">
                                          Skills <span className='text-danger'>*</span>
                                        </Label>
                                        <div className="multi_dropdown ">
                                          <div className="form-group has-search mb-3 px-3">
                                            <span className="fa fa-search form-control-feedback"></span>
                                            <input type="text" onChange={(e) => handleSearch3(e.target.value)} id='Skills_for' className="form-control" placeholder="Search" />
                                          </div> 
                                          <div className='custome_dropdown'>
                                            <Row className='px-3'>
                                              {interestList?.length > 0 ?
                                                interestList?.map((data, index) => (
                                                  <Col sm="6 " xxl="3" lg="4" className='mb-3' key={index}>
                                                    <div role='button' className={`custome-selcte ${selectedList.find(e => e == data) ? 'avtive-sect' : ''}`}
                                                      onClick={() => setSelectedList(selectedList?.includes(data) ? selectedList?.filter(e => e != data) : [...selectedList, data])}
                                                    >
                                                      <h5 className='me-2 '>{data?.name}</h5>
                                                      {
                                                        selectedList?.includes(data) &&
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
                                          selectedList.map((data, index) => (
                                            <div className='d-flex align-items-center customet-sg mb-3' key={index}><h5 className='mb-0 me-3'>{data?.name} </h5><img src={`/assets/images/homepg/Login-Register-flow/__Cancel.png`} alt="" role='button' className="img-rd" onClick={() => setSelectedList(selectedList.filter(e => e != data))} /> </div>
                                          ))
                                        }
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
                                            onChange={async (e) => {
                                              var obj = sprogram.filter(p => !e.find(l => l?.id == p?.id))
                                              if (obj?.length > 0) {
                                                setPrice(Price.map(h => h.filter(k => k.program_id != obj[0]?.id)))
                                                const res = await getDeletePackage(obj[0]?.id, auth?.user_id);
                                                MentorProfile();
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
                                                        <Label className={`form-label ${i==3 ? 'fw-bold' : ''}`} htmlFor={`1${i}`} >
                                                          {pac?.package_name} {i==3  ? 'Session' : `(Sessions ${data?.packages ? + JSON.parse(data?.packages ?? {})?.find(y => y?.package_id == pac?.id)?.sessions ? JSON.parse(data?.packages ?? {})?.find(y => y?.package_id == pac?.id)?.sessions  : "0" : '0'})`}
                                                        </Label>
                                                        <div className="input-container">
                                                          <Input type="text" value={Price[index]?.[i]?.price ?? ''} className="form-control" onChange={(e) => {
                                                            setPrice((p) => {
                                                              const val = [...p];
                                                              if (!val[index]) {
                                                                val[index] = []; // Create inner array if not exists
                                                              }

                                                              val[index][i] = {
                                                                "price": e.target?.value.replace(/[^0-9]/g, ""),
                                                                // "price": e.target?.value,
                                                                "package_id": pac?.id,
                                                                "program_id": data?.id
                                                              }
                                                              return val
                                                            })
                                                          }} id={`1${i}`} placeholder="price" /> 
                                                            {/* <InputNumber  value={Price[index]?.[i]?.price ?? ''} onValueChange={(e) => {
                                                              setPrice((p) => {
                                                                const val = [...p];
                                                                if (!val[index]) {
                                                                  val[index] = []; // Create inner array if not ex  ists
                                                                }
                                                                val[index][i] = {
                                                                  // "price": e.target?.value.replace(/[^0-9]/g, ""),
                                                                  "price": e.value,
                                                                  "package_id": pac?.id,
                                                                  "program_id": data?.id
                                                                }
                                                                return val
                                                              })
                                                           }} mode="currency" currency="INR" inputId={`1${i}`} placeholder="price" currencyDisplay="code" locale="en-IN" /> */}
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
                                        <Label className="form-label" htmlFor="Bio">Your Bio <span className='text-danger'>*</span> (1000 Characters Maximum)</Label>
                                        <textarea className="form-control mb-0" value={bio} onChange={(e)=> setbio(e.target.value)}  
                                        //  {...MentorForm.getFieldProps('biography')} 
                                         placeholder=""
                                          id="Bio"  maxLength={1000}  rows="6"></textarea>
                                        {
                                          MentorForm.touched.biography && MentorForm.errors.biography && (
                                            <div className='fv-plugins-message-container ' >
                                              <div className='fv-help-block'>
                                                <span role='alert' className='text-danger'>{MentorForm.errors.biography}</span>
                                              </div>
                                            </div>
                                          )
                                        }
                                      </div>
                                      <p>{1000 - bio.length} Characters Remaining.</p>
                                    </Col>

                                    <Col xs="12">
                                    </Col>
                                  </Row>
                                </div>
                              </div>
                            </TabPane>

                            <TabPane tabId="3">
                              <div className='col-xl-10'>
                                <div className='tab_body mt-3 '>
                                  <div className=''>
                                    <div className="detail_poject mt-3 p-0">
                                      <div className="my-3 d-flex align-items-center justify-content-between"><h3 className="mb-0">Experience</h3> <button type='button' className='btn_yellow' onClick={() => { togglePopup(); setExid(null); setWorkingStatus(false); experienceForm.resetForm() }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square me-1" viewBox="0 0 16 16">
                                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                        </svg> ADD</button></div>
                                      {
                                        experience.length > 0 ?
                                          <div className="d-flex custome_cad p-sm-3 p-2">
                                            <div className="w-100">

                                              {
                                                experience.map((e, i) => (
                                                  <div className='d-flex' key={i}>
                                                    <div className="d-flex justify-content-between w-100 custome_botrder position-relative mb-3 me-3">
                                                      <div className="">
                                                        <h3>{e?.company_name}</h3>
                                                        <h5>{e?.title}</h5>
                                                        <div className="d-flex align-items-center">
                                                          <p className="mb-0">{e?.start_date} - {e?.end_date}</p>
                                                          {/* <span className="divider_hj mx-3"></span> */}
                                                          {/* <a className="theme_color fw-bold">Meesho.com</a> */}
                                                        </div>
                                                        <p className='two_line'>{e?.description}.</p>
                                                      </div>
                                                      <img src={``} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="brand_img_detail" />
                                                    </div>
                                                    <div className='edit_btn' onClick={() => {
                                                      setExid(e?.id); togglePopup();
                                                      if (e?.end_date === "Present") {
                                                        setWorkingStatus(true);
                                                      } else {
                                                        setWorkingStatus(false);
                                                      }
                                                      var date = e?.start_date.split(' ');
                                                      var date2 = e?.end_date.split(' ');
                                                      experienceForm.setFieldValue('title', e?.title);
                                                      experienceForm.setFieldValue('description', e?.description);
                                                      experienceForm.setFieldValue('company_name', e?.company_name);
                                                      experienceForm.setFieldValue('start_month', date[0]);
                                                      experienceForm.setFieldValue('start_year', date[1]);
                                                      experienceForm.setFieldValue('end_month', date2[0]);
                                                      experienceForm.setFieldValue('end_year', date2[1]);
                                                    }}><img src="/assets/images/Icons/10.png" alt="" className="me-3 testimonial-user" /></div>
                                                  </div>
                                                ))
                                              }


                                              {/* <div className='d-flex'>
                                                    <div className="d-flex justify-content-between w-100  custome_botrder position-relative mb-3 me-3">
                                                      <div className="">
                                                        <h3 >Deloitte Digital</h3>
                                                        <h5>Senior Manager, Digital Experience</h5>
                                                        <div className="d-flex align-items-center">
                                                          <p className="mb-0">May 2011 - February 2020</p>
                                                          <span className="divider_hj mx-3"></span>
                                                          <a className="theme_color fw-bold">deloitte.com</a>
                                                        </div>
                                                        <p>Built the product and design orgs for Deloitte Digital from 8 to 1000 in the span of 8 years.</p>
                                                      </div>
                                                      <img src={`/assets/images/3.png`} alt="" className="brand_img_detail" />
                                                    </div>
                                                    <div className='edit_btn'> <img src="/assets/images/Icons/10.png" alt="" className="me-3 testimonial-user" /></div>
                                                </div> */}
                                            </div>
                                          </div> : ''
                                      }
                                    </div>

                                    <div className="detail_poject mt-3 p-0">
                                      <div className="my-3 d-flex align-items-center justify-content-between"><h3 className="mb-0">Education</h3> <button type='button' className='btn_yellow' onClick={() => {
                                        togglePopup1();
                                        educationForm.resetForm();
                                        setExid(null);
                                        setWorkingStatus(false);
                                      }}> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square me-1" viewBox="0 0 16 16">
                                          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z" />
                                          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                                        </svg> ADD</button></div>
                                      {
                                        education.length > 0 ?
                                          <div className="d-flex custome_cad p-sm-3 p-2">
                                            <div className="w-100">
                                              {
                                                education?.map((e, i) => (
                                                  <div className='d-flex' key={i}>
                                                    <div className="d-flex justify-content-between w-100 custome_botrder position-relative mb-3 me-3">
                                                      <div className="">
                                                        <h3 >{e?.university_name}</h3>
                                                        <h5>{e?.education}</h5>
                                                        <p>{e?.start_year} - {e?.end_year}</p>
                                                      </div>
                                                      <img src={``} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="brand_img_detail" />
                                                    </div>
                                                    <div className='edit_btn' onClick={() => {
                                                      setExid(e?.id); togglePopup1();
                                                      if (e?.end_year === "Present") {
                                                        setWorkingStatus(true);
                                                      } else {
                                                        setWorkingStatus(false);
                                                      }
                                                      var date = e?.start_year.split(' ');
                                                      var date2 = e?.end_year.split(' ');
                                                      educationForm.setFieldValue('title', e?.education);
                                                      educationForm.setFieldValue('description', e?.education_description);
                                                      educationForm.setFieldValue('company_name', e?.university);
                                                      educationForm.setFieldValue('start_month', date[0]);
                                                      educationForm.setFieldValue('start_year', date[1]);
                                                      educationForm.setFieldValue('end_month', date2[0]);
                                                      educationForm.setFieldValue('end_year', date2[1]);
                                                    }}> <img src="/assets/images/Icons/10.png" alt="" className="me-3 testimonial-user" /></div>
                                                  </div>
                                                ))
                                              }

                                            </div>
                                          </div> : ""
                                      }
                                    </div>

                                  </div>
                                </div>
                              </div>
                            </TabPane>
                          </TabContent>
                          {
                            currentActiveTab != '3' ?
                              <div className='d-flex align-items-center justify-content-start mt-4'><button type='submit' className='border border-0 btn_next me-3' disabled={loading} >
                                {
                                  loading ? <span
                                    className="spinner-border spinner-border-sm"
                                    aria-hidden="true"
                                  ></span> : "Update"
                                }
                              </button> <button type='button' onClick={() => {
                                MentorForm.resetForm();
                                setPrice([]);
                                setSelectedList([]);
                                setsProgram([]);
                                setPreImg([]);
                                setImage([])
                              }} className='border border-0 btn_cancel'>Cancel</button>
                              </div> : ''
                          }
                        </form>

                      </div>
                    )}
                  </div>

                </Col>
            }
          </Col>

        </Row>
      </section>
    </>
  )
}

export default EditMyProfile