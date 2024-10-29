import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import cn from 'classnames';
import { getRefundPolicy } from '../footer/request';
import Meta from '../../services/Meta';


const RefundPolicy = () => {

    const [Policy, setPolicy] = useState('');
    const [isloading, setloading] = useState(true)

    const fetchPolicy = async () => {
        setloading(true);
        getRefundPolicy().then(res => {
            setPolicy(res?.message)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }

    useEffect(() => {
        fetchPolicy();
    }, []);

    return (<>
     <Meta title={'Refund Policy'}  />
        {
            isloading ?
                <div className='pageLoading'>
                    <span
                        className={cn(
                            'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                        )}
                    >
                        <span className={"loading"} />
                    </span>
                </div> :
                <section className="jurny_sectoion mb-4 text-start h-100">
                    <div className='position-relative'>
                        <img src={`/assets/images/homepg/listpagebanner.png`} alt="" className="banner_list" />
                        <div className='set_tilte ' >
                            <h2>Refund Policy</h2>
                        </div>
                    </div>

                    <Container className='text-common my-4'>

                        {
                            Policy?.value ?
                                <div className='mb-4 terms_set' dangerouslySetInnerHTML={{ __html: Policy?.value ?? '' }} />
                                :
                                <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                    <img src='/assets/nodata.png' className='w-50' />
                                </div>
                        }


                        {/* <h5>Refunds Of Mentaroo.Com</h5>
                        <p>Refunds are possible within 14 days of the start of membership when no call has been scheduled in the system.</p>
                        <p>Refund possibilities are forfeited when a call with a mentor is requested and accepted within the platform or the direct messaging function has been used to solicit advice from mentors or connect outside of the platform.</p>
                        <p>Questions about the ToS should be sent to <a className='theme_color' href=''>hello@mentaroo.com </a>.</p>

                        <h5 className='mt-4 mb-3'>Attendance Policy</h5>
                        <p>Attendance Policy</p>

                        <h5 className='mt-4 mb-3'>Subscription Details</h5>
                        <p>Your subscription will automatically renew unless you cancel your plan at least 24 hours before the end of the current subscription period.</p>
                        <p>Your account will be charged for the renewal within 24 hours prior to the end of the current subscription period. Automatic renewals will cost the same price you were originally charged for the subscription (unless there was a 1 time promotion).</p>
                        <h5 className='mt-4 mb-3'>Fees For Mentors</h5>
                        <p>The amount due and payable to a mentor is agreed between the mentor and us at the start of our cooperation and prior to a mentor being listed on our website. These fees will be listed on the website in US Dollars, and quoted as in the session length listed (15 min, 30 min or 60 min).</p> */}

                    </Container>
                </section>
        }
    </>

    )
}

export default RefundPolicy;