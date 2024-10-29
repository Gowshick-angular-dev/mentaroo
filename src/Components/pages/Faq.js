import React, { Fragment, useEffect, useState } from "react";
import { Container, Row, Form, Label, Input, Col, TabContent, TabPane, Nav, NavItem, NavLink, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionHeader, AccordionBody } from "reactstrap";
import classnames from 'classnames';
import cn from 'classnames';
import { getFaqAgainstCat, getFaqCat } from "../footer/request";
import Meta from "../../services/Meta";

const Faq = () => {
    const [currentActiveTab, setCurrentActiveTab] = useState('1');

    const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
    const [open, setOpen] = useState('0');
    const toggle1 = (id) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };

    const [category, setcategory] = useState([]);
    const [faq, setfaq] = useState([]);
    const [isloading, setloading] = useState(true)


    const getFaqCats = async () => {
        try {
            setloading(true);
            const response = await getFaqCat();
            if (response.status == 200) {
                setcategory(response.data);
                getFaqAgainstCats(response.data[0]?.id);
            }
            // setloading(false);
        } catch (error) {
            console.error("err", error.message)
            setloading(false);
        }
    }



    const getFaqAgainstCats = async (id) => {
        try {
            const response = await getFaqAgainstCat(id);
            if (response.status == 200) {
                setfaq(response.data);
            }
            setloading(false);
        } catch (error) {
            console.error("err", error.message);
            setloading(false);
        }
    }


    useEffect(() => {
        getFaqCats();
    }, [])




    return (
        <>
            <Meta title={'FAQ'} />
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
                    <section className="jurny_sectoion mb-4 h-100">
                        <div className='position-relative'>
                            <img src={`/assets/images/__Faq Banner.png`} alt="" className="banner_list" />
                            <div className='set_tilte ' >
                                <h2>FAQ</h2>
                            </div>
                        </div>
                        <div className="terms_set">
                            <Container className='text-common my-4 stories d-flex justify-content-center faq_section '>
                                <div className="col-xxl-9 col-md-10">
                                    {
                                        category?.length > 0 ?
                                            <Nav tabs className="mt-xl-5 mt-lg-4 mt-3 mb-4 custome_screy">
                                                {
                                                    category.map((data, i) => (
                                                        <NavItem key={i}>
                                                            <NavLink
                                                                className={classnames({
                                                                    active:
                                                                        currentActiveTab === `${i + 1}`
                                                                })}
                                                                onClick={() => { toggle(`${i + 1}`); getFaqAgainstCats(data?.id) }}
                                                            >
                                                                {data?.name}
                                                            </NavLink>
                                                        </NavItem>
                                                    ))
                                                }
                                            </Nav> : ''
                                    }

                                    {
                                        faq.length > 0 ?
                                            <TabContent activeTab={currentActiveTab}>
                                                <TabPane tabId={currentActiveTab}>
                                                    {
                                                        faq.map((data, i) => (
                                                            <Accordion flush open={open} toggle={toggle1} key={i}>
                                                                <AccordionItem>
                                                                    <AccordionHeader targetId={`${i}`}>{data?.question}</AccordionHeader>
                                                                    <AccordionBody accordionId={`${i}`}>
                                                                        <p>{data?.answer}</p>
                                                                    </AccordionBody>
                                                                </AccordionItem>
                                                            </Accordion>
                                                        ))
                                                    }
                                                </TabPane>
                                            </TabContent>
                                            :
                                            <div className='text-center'>
                                                <img src='/assets/nodata.png' className=' w-75 ' />
                                            </div>
                                    }
                                </div>
                            </Container>
                        </div>  
                    </section>
            }
        </>
    )
}

export default Faq;