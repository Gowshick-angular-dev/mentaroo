import React, { useEffect, useState } from 'react';
import { Container, Row, Form, Label, Input, Col } from "reactstrap";
import { getExploreProgram } from './core/_request';
import cn from 'classnames';
import Meta from '../../services/Meta';


const ExplorePrograms = () => {

    const [expertise, setExpertise] = useState([])
    const [isloading, setloading] = useState(true)


    const fetchExplore = async () => {
        setloading(true);
        getExploreProgram().then(res => {
            setExpertise(res.data)
            setloading(false);
        }).catch(e => {
            console.log(e)
            setloading(false);
        })
    }


    useEffect(() => {
        fetchExplore();
    }, [])

    return (
        <>
            <Meta title={'Explore Programs'} />

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
                    <section className="jurny_sectoion mb-4">
                        <div className='position-relative'>
                            <img src={`/assets/images/listpagebanner.png`} alt="" className="banner_list" />
                            <div className='set_tilte ' >
                                <h2>Explore Programs</h2>
                                {/* <h2><span>Br</span>eaking <span>Ba</span>d</h2> */}
                            </div>
                        </div>

                        <Container>
                            <Row>
                                <Col lg="8" className="m-auto ">
                                    <h2 className='text-center my-xxl-5 my-4'>You're in the driving seat. Engage in meaningful and targeted conversations.</h2>
                                </Col>
                            </Row>

                            <Row className=" ">
                                {
                                    expertise.map((data, i) => (
                                        <Col lg="4" sm="6" className="mb-3 mb-lg-4" key={i}>
                                            <div className="jurny_bg">
                                                <div className="d-flex align-items-center mb-3">
                                                    <img src={data?.image} alt="" className="jurny_img me-3" onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} />
                                                    <h5>{data?.title}</h5>
                                                </div>
                                                <p className="three_line mb-0">{data?.description}</p>
                                            </div>
                                        </Col>
                                    ))
                                }

                                {/* <Col lg="4" sm="6" className="mb-3 mb-lg-4">
                                    <div className="jurny_bg">
                                        <div className="d-flex align-items-center mb-3">
                                            <img src={`/assets/images/homepg/icons/__leadershiptraining.png`} alt="" className="jurny_img me-3" />
                                            <h5>Leadership Training</h5>
                                        </div>
                                        <p className="three_line mb-0">Eyeing for a promotion, or already in a leadership role and want to grow your skill-set? Reach out to a mentor and take it forward</p>
                                    </div>
                                </Col> */}
                            </Row>
                        </Container>
                    </section>
            }
        </>
    )
}

export default ExplorePrograms;