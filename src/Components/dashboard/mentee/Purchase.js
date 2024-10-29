import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import SideBar from '../Sidebar';
import DashboardNavbar from '../DashboardNavbar';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Auth/core/Auth';
import { getMyProgram } from './request';
import 'rc-table/assets/index.css';
import Table from 'rc-table';
import cn from 'classnames';
import Meta from '../../../services/Meta';
import { useReactToPrint } from "react-to-print";
import moment from 'moment';
import easyinvoice from "easyinvoice";



const MyPurchse = () => {
    const [accountInfo, setAccountInfo] = useState(false)

    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [myPrograms, setMyPrograms] = useState([]);
    const [sourseData, setCoursedata] = useState();



    function formatUnixTimestamp(unixTimestamp) {
        // Convert the Unix timestamp to milliseconds by multiplying by 1000
        const milliseconds = unixTimestamp * 1000;
        // Create a new Date object using the milliseconds
        const date = new Date(milliseconds);
        // Get the day, month, and year components from the date object
        const day = date.getDate();
        // JavaScript months are zero-based, so we need to add 1
        // const month = date.toLocaleString('default', { month: 'short' });
        const month = date.getMonth();
        const year = date.getFullYear();
        // Concatenate the components to form the desired format
        const formattedDate = `${day}-${month}-${year}`;
        return moment(formattedDate, 'DD-MM-YYYY').format('DD-MM-YYYY');
    }

    const downloadInvoice = async (row) => {
        const data = {
            documentTitle: "INVOICE", //Defaults to INVOICE
            images: {
                // The logo on top of your invoice
                logo: "https://menti.vrikshatech.in/uploads/system/a05ea8dcd593b390718282ade28578e4.png",
                // The invoice background
                background: "https://public.budgetinvoice.com/img/watermark-draft.jpg"
            },
            "settings": {
                "currency": "INR", // See documentation 'Locales and Currency' for more info. Leave empty for no currency.
                "locale": "nl-NL", // Defaults to en-US, used for number formatting (See documentation 'Locales and Currency')         
                "tax-notation": "gst", // Defaults to 'vat'
                "margin-top": 25, // Defaults to '25'
                "margin-right": 25, // Defaults to '25'
                "margin-left": 25, // Defaults to '25'
                "margin-bottom": 25, // Defaults to '25'
                "format": "A4", // Defaults to A4, options: A3, A4, A5, Legal, Letter, Tabloid
                // Using margin we can regulate how much white space we would like to have from the edges of our invoice
                //  "height": "1000px", // allowed units: mm, cm, in, px
                //  "width": "500px", // allowed units: mm, cm, in, px
                //  "orientation": "landscape", // portrait or landscape, defaults to portrait         
            },
            //   currency: "INR",
            //   taxNotation: "vat", //or gst
            //   marginTop: 25,
            //   marginRight: 25,
            //   marginLeft: 25,
            //   marginBottom: 25,
            //   logo: "link to show on your invoice",
            sender: {
                company: "Mentaroo",
                address: JSON.parse(localStorage.getItem('admin')).find(e => e?.key == "address")?.value,
                zip: "10011",
                city: new Date().toLocaleString(
                    "en-US"
                ),
                country: new Date().toLocaleString(
                    "en-US"
                ),
            },
            client: {
                company: `priya`,
                address: `priya@gmail.com`,
                zip: "",
                city: `Check In: ${new Date().toLocaleString(
                    "en-US"
                )}`,
                country: `Check In: ${new Date().toLocaleString(
                    "en-US"
                )}`,
            },
            invoiceNumber: `${1}`,
            information: {
                // Invoice number
                number: "2021.0001",
                // Invoice data
                date: moment(new Date()).format('DD-MM-YYYY'),
                // Invoice due date
                dueDate: row?.valid_until ?? ''
            },
            invoiceDate: `${new Date(Date.now()).toLocaleString("en-US")}`,
            products: [
                {
                    quantity: 1,
                    description: row?.title ?? '',
                    "tax-rate": 0,
                    price: parseInt(row?.price ?? 0) ?? 0,
                },
            ],
            bottomNotice:
                "THANK YOU",
        };
        const result = await easyinvoice.createInvoice(data);
        easyinvoice.download(`invoice_${1}.pdf`, result.pdf);
    }; 
    
    const columns = [
        {
            title: 'S.NO',
            dataIndex: 's_no',
            key: 's_no',
            render(o, row, index) {
                return <span key={index}>{index + 1}</span>;
            },
        },
        {
            title: 'Course',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Status',
            dataIndex: 'active_status',
            key: 'active_status',
            render(o, row, index) {
                return <span key={index}>{o == 1 ? "Active" : "Pending"}</span>;
            },
        },
        {
            title: 'Validity',
            dataIndex: 'valid_until',
            key: 'valid_until',
            //   render(o, row, index) {
            //     return <span>{formatUnixTimestamp(o)}</span>;
            //   },
        },
        {
            title: 'Download',
            dataIndex: 'download',
            key: 'download',
            render(o, row, index) {
                return <div onClick={() => handleCreatePdf(row)} key={index} role='button' className='d-flex justify-content-center' ><i className="fa fa-file-pdf-o fs-5" aria-hidden="true"></i> </div>;
            },
        },
    ];

    const componentRef = useRef();

    const handleOnlyPrint = useReactToPrint({
        content: () => componentRef.current
    });

    const handleCreatePdf = data => {
        setCoursedata(data)
        setTimeout(() => {
            handleOnlyPrint();
        }, 500);
    }

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

    useEffect(() => {
        handleMyPrograms();
    }, [])

    function sumArray(array) {
        let sum = 0
        for (let i = 0; i <
            array?.length; i++) {
            sum += array[i]
        }
        return sum
    }

    return (<>
        <Meta title={'My Purchase'} />
        <section className="section-b-space h-100vh" >
            {/* <DashboardNavbar /> */}
            <Row className='h-100 custome_heifht'>
                <Col lg="3" className='d-lg-flex d-none justify-content-end lft_side'>
                    <div className='col-xl-9 d-flex justify-content-center'>
                        <SideBar></SideBar>
                    </div>
                </Col>

                <Col lg="9" className='px-xl-4 py-4 scrol_right'>
                    <div className='d-none'>
                        <div ref={componentRef} className='mx-5'>
                            <div className='d-flex justify-content-between mb-5 mt-5'>
                                <div className=''>
                                    <img src={'/assets/images/homepg/logo.png'} alt="logo" className="img-fluid logo" />
                                </div>

                                <div className='text-end'>
                                    <h3 className='mb-1'>INVOICE</h3>
                                    <h6 className='mb-1'># VTS/22-23/00067</h6>
                                    <h6 className='text-success'>PAID</h6>
                                </div>
                            </div>


                            <div className='mb-5 d-flex justify-content-between'>
                                <div className='w-25'>
                                    <h4 className='fw-bold'>Mentaroo</h4>
                                    <h6>{JSON.parse(localStorage.getItem('admin')).find(e => e?.key == "address")?.value}</h6>
                                    <h6>GST Number:0000000000000</h6>
                                </div>

                                <div className='text-end'>
                                    <div className='mb-3 '>
                                        <h4 className='fw-bold'>Bill To</h4>
                                        <h6>{auth?.first_name}</h6>
                                        <h6>{auth?.email}</h6>
                                        <h6>GST Number:0000000000000</h6>
                                    </div>
                                    <div className=''>
                                        <h6 className='fw-bold'>Invoice Date : {formatUnixTimestamp(sourseData?.date_added)}</h6>
                                        <h6 className='fw-bold'>Due Date : {sourseData?.date_issued ?? '-'}</h6>
                                    </div>
                                </div>
                            </div>


                            <table className="table  table-borderless mb-5">
                                <thead className='table-success'>
                                    <tr>
                                        <th scope="col">No</th>
                                        <th scope="col">COURSE NAME</th>
                                        <th scope="col">VALIDITY</th>
                                        <th scope="col">DISCOUNT</th>
                                        <th scope="col">PRICE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>{sourseData?.title ?? ''}</td>
                                        <td>{sourseData?.valid_until ?? ''}</td>
                                        <td>{sourseData?.coupon ? JSON.parse(sourseData?.coupon ?? '')?.discount_percentage ? JSON.parse(sourseData?.coupon ?? '')?.discount_percentage + "%" : '-' : '-'}</td>
                                        <td>{sourseData?.price ?? '00'}</td>
                                    </tr>
                                    <tr><th scope="row"></th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <th scope="row"></th>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr className='table-active'>
                                        <th scope="row" className='border-0'></th>
                                        <td className='border-0'></td>
                                        <td className='fw-bold'></td>
                                        <td className='fw-bold'>TOTAL</td>
                                        <td className='fw-bold'>{sourseData?.price ?? ''}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className='mt-4'>
                                <h4 className='fw-bold'>MENTAROO</h4>
                                {
                                    // JSON.parse(localStorage.getItem('admin'))?.map((data, i) => (
                                    //     <>{
                                    //         data?.key == 'light_logo' || data?.key == 'class_time' || data?.key == 'website_description' ?
                                    //             <span key={i}></span>
                                    //             : 
                                    //             <h5 key={i}>{data?.value ?? ''}</h5>
                                    //     }
                                    //     </>
                                    // ))
                                    localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin'))?.filter((data, i) => data?.key != 'light_logo' && data?.key != 'class_time' && data?.key != 'website_description')?.map((data, i) => (
                                        <h5 key={i}>{data?.value ?? ''}</h5>
                                    )) : ''
                                }
                            </div>
                        </div>
                    </div>

                    <Col xl="11">
                        <div className=''>
                            <div className='d-flex justify-content-between align-items-center mb-4'>
                                <h2 className='mb-0'>Manage your purchases</h2>
                                {/* <button type='button' className=' border-0 btn_next' onClick={handleOnlyPrint} >Download</button> */}
                            </div>
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
                                    myPrograms?.length > 0 ?
                                        <div className='mt-3 shadow-sm'>
                                            <Table scroll={{ x: 500 }} rowKey={record => record?.id} columns={columns} data={myPrograms} aria-labelledby="lblPeopleTable" />
                                        </div>
                                        :
                                        <div className='text-center my-3 box_empty'>
                                            <h3 className='mb-3 text-center pt-4'>No Active Purchases</h3>
                                            <p className='mb-3 text-center'>As soon as you find a suitable Mentor and book your first Session, you'll see it here</p>
                                            <Link to={'/mentor'}>
                                                <button type='button' className='btn_theme px-3 py-2 mb-4'> Start Subscription</button>
                                            </Link>
                                        </div>
                            }
                        </div>
                    </Col>
                </Col>
            </Row>
        </section>
    </>
    )
}

export default MyPurchse;