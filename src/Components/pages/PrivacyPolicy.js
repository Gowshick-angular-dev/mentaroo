import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { getPrivatepolicy } from './core/_request';
import cn from 'classnames';
import Meta from '../../services/Meta';


const PrivacyPolicy = () => {

    const [privacyPolicy, setPrivacyPolicy] = useState('');
    const [isloading, setloading] = useState(true)

    const getPrivacyPolicy = async () => {
        setloading(true);
        const response = await getPrivatepolicy();
        if (response.status == 200) {
            setPrivacyPolicy(response?.data);
        }
        setloading(false);
    }

    useEffect(() => {
        getPrivacyPolicy();
    }, []);

    return (<> 
     <Meta title={'Privacy Policy'}  />
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
                            <h2>Privacy Policy</h2>
                        </div>
                    </div>

                    <Container className='text-common my-4'>
                        {
                            privacyPolicy ?
                                <div className='mb-4 terms_set' dangerouslySetInnerHTML={{ __html: privacyPolicy ?? '' }} />
                                :
                                <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                                    <img src='/assets/nodata.png' className='w-50' />
                                </div>
                        }

                        {/* <h5>Our Provision Of Service</h5>
                    <p>Welcome dear members, users, mentees, mentors and clients and thanks for being here, if you are reading this section of our content it means you are already a loyal Growthmentor subscriber or rather interested in us, so thanks for being here. We intend to provide great mentoring services and to help grow startup and established businesses into their full potential with our services and our great mentors.</p>
                    <p>Where you see throughout our website a reference to 'us' or 'we' and 'our' we refer to Growth Tonic LLC who operates and offers this website including its services to members, users, mentee, mentors and clients based on your acceptance, without limitation of these Terms of Services (ToS) as outlined here.</p>
                    <p>We will try not to be too lengthy, but you do need to ensure you have read our ToS and agree to be bound by them once you access or use our website. If you do not agree, then please do not use our website and services. Our services are intended solely for persons who are 18 or older. Any access to or use of our website or services by anyone under 18 is expressly prohibited.</p>
                    <h5 className='mt-4 mb-3'>Our Accuracy Of Information</h5>
                    <p>We are very meticulous in ensuring that we provide an accurate portrayal of the knowledge and skills of our mentors and advice or information on our website.</p>
                    <p>We hope and anticipate that any services you buy are to your expectations.</p>
                    <p>We hope and anticipate that any services you buy are to your expectations.</p>
                    <p>In the unlikely event you feel that a service was not delivered in accordance with your expectations, or, in case you notice any omissions or inaccuracies on our website relating to our services descriptions, availability or promotions, please contact us at Growthmentor in order for us to resolve the issue at support@growthmentor.com</p>
                    <p>We do not undertake to update or amend any details included in our website, unless stipulated by law and are not responsible for inaccurate, incomplete or out of date material. Our website may include or refer to historical information, such information is for reference only and whilst we endeavor to ensure the majority of our content is current, complete and accurate we have no obligation to update information on our website.</p>
                    <p>The material on our website is provided for consideration and as general information. We recommend that a number of sources of information are considered and referred to prior to any decision making. Any reliance on the material on our website is at your own risk.</p>
                    <h5 className='mt-4 mb-3'>User Conduct</h5>
                    <p>We welcome and encourage you to provide feedback, comments and suggestions for improvements to our website and services at hello@growthmentor.com.</p>
                    <p>If you post comments on our website, you agree that these do not violate any rights of third-parties, including copyright, trademark, privacy or proprietary rights. Your comments will not contain unlawful, abusive or inappropriate material. You may not mislead us or third-parties as to the origin of any comments. You are solely responsible for any comments you make and their accuracy. We take no responsibility and assume no liability for any comments posted by you or any third-party.</p>
                    <p>You are not allowed to use our website for any unlawful purpose or to solicit others to take part in any unlawful activities derived from international or jurisdictional regulations. Harassment, intimidation or insults are not permitted on our website. You may not transmit or upload any virus or other malware that could in any way affect the operation of our services or to spam, phish, scrape or crawl.</p>
                    <p>We reserve the right to terminate or restrict our services or any related website for violating any provision in the ToS.</p>
                    <p>We endeavor, but have no obligation to, monitor, edit or remove inappropriate content.</p>
                    <h5 className='mt-4 mb-3'>Our Pricing</h5>
                    <p>Mentaroo is a subscription based community that offers a suite of value added services to it's members such as access to mentors with rates listed as free, access to the help request feature, and access to a private Slack community.</p>
                    <p>Subscriptions are to be associated to a single person and cannot be shared with others. Sharing Growth Mentor services with a non-registered person will</p> */}
                    </Container>
                </section>
        }
    </>
    )
}

export default PrivacyPolicy;