import React, { useState, useEffect } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import cn from 'classnames';
import { getCookiesPolicy } from '../footer/request';
import Meta from '../../services/Meta';



const CookiesPolicy = () => {



    const [Policy, setPolicy] = useState('');
    const [isloading, setloading] = useState(true)

    const fetchPolicy = async () => {
        setloading(true);
        getCookiesPolicy().then(res => {
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
     <Meta title={'Cookie Policy'}  />
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
                            <h2>Cookie Policy</h2>
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
                    </Container>
                </section>
        }
    </>

    )
}

export default CookiesPolicy;