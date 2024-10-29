import React, { useState, useEffect } from "react";
import { Container, Row, Form, Label, Input, Col, Pagination, PaginationItem, PaginationLink, Button } from "reactstrap";
import { getALlStories, getDomains, getStories, getStoryCat } from "../core/_request";
import cn from 'classnames';
import { Link, useLocation } from "react-router-dom";
import Meta from "../../../services/Meta";


const Stories = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { state } = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const closeMenu = () => {
    setIsOpen(false);
  };

  const [isloading, setloading] = useState(true)
  const [pageloading, setPageloading] = useState(false)
  const [stories, setStories] = useState([])
  const [topstories, setTopstories] = useState([])
  const [domains, setDomains] = useState([])
  const [category, setcategory] = useState([])
  const [filter, setFilter] = useState({
    categoryId: state?.catId ?? '',
    domainId: state?.domId ?? ''
  })

  function formatUnixTimestamp(unixTimestamp) {
    // Convert the Unix timestamp to milliseconds by multiplying by 1000
    const milliseconds = unixTimestamp * 1000;
    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);
    // Get the day, month, and year components from the date object
    const day = date.getDate();
    // JavaScript months are zero-based, so we need to add 1
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    // Concatenate the components to form the desired format
    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
  }



  const fetchStories = async (catId, domId) => {
    setPageloading(true);
    getALlStories(catId, domId).then(res => {
      setStories(res.data);
      setPageloading(false);
    }).catch(e => {
      console.log(e)
      setPageloading(false);
    })
  }


  const fetchCategory = async () => {
    // setloading(true);
    getStoryCat().then(res => {
      setcategory(res);
      // setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }

  const fetchDomains = async () => {
    // setloading(true);
    getDomains().then(res => {
      setDomains(res.data);
      // setloading(false);
    }).catch(e => {
      console.log(e)
      // setloading(false);
    })
  }


  const fetchTopStories = async () => {
    setloading(true);
    getStories().then(res => {
      setTopstories(res)
      setloading(false);
    }).catch(e => {
      console.log(e)
      setloading(false);
    })
  }

  useEffect(() => {
    fetchStories(filter.categoryId, filter.domainId)
  }, [filter])

  useEffect(() => {
    fetchTopStories()
    fetchDomains()
    fetchCategory()
  }, [])


  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;
  const totalItems = stories.length ?? 0;

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activePage])

  const goToFirstPage = () => {
    setActivePage(1);
  };

  const goToLastPage = () => {
    setActivePage(totalPages);
  };

  const startItemIndex = (activePage - 1) * itemsPerPage;
  const endItemIndex = Math.min(startItemIndex + itemsPerPage, totalItems);

  // const currentPageItems = Array.from(Array(itemsPerPage), (_, index) => {
  const currentPageItems = stories.slice(startItemIndex, endItemIndex).map((data, index) => {
    const itemNumber = (activePage - 1) * itemsPerPage + index + 1;
    return (
      <Col md="6" className='mb-3 ' key={index}>
        <Link to={`/stories_detail`} className="" state={{ id: data?.blog_id }}>
          <div className=" inner_stories h-100">
            <h3 className="mb-3 text-dark two_line">{data?.title}</h3>
            <div className="d-flex align-items-center mb-3">
              <img src={data?.user_image} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="image_auth me-2" />
              <div className="">
                <h6 className="mb-0">{data?.user_name}</h6>
                <p className="mb-0">{data?.job_title}</p>
              </div>
            </div>

            <img src={data?.banner} onError={(e) => e.currentTarget.src = "/assets/images/homepg/noImg.jpg"} alt="" className="image_stories mb-3" />
            {
              data?.updated_date &&
              <div className="d-flex align-items-center">
                <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                <p className="mb-0">{formatUnixTimestamp(data?.added_date)}</p>
              </div>
            }
          </div>
        </Link>
      </Col>
    );
  });

  const paginationNumbers = Array.from(Array(totalPages), (_, index) => (
    <Button
      key={index}
      type="button"
      onClick={() => { handlePageChange(index + 1); window.scroll(0, 0) }}
      className={activePage === index + 1 ? 'active' : ''}
    >
      {index + 1}
    </Button>
  ));

  return (

    <>  

             <Meta
                title={"Stories"} 
                pathName={'/stories'} 
            />
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
          <section className="jurny_sectoion mb-4 text-start">
            <div className='position-relative'>
              <img src={`/assets/images/listpagebanner.png`} alt="" className="banner_list" />
              <div className='set_tilte ' >
                <h2>Stories</h2>
              </div>
            </div>
            <>
              <div className="filter-main-btn">
                <span className="filter-btn btn btn-theme" onClick={toggleMenu}>
                  <i className="fa fa-filter" aria-hidden="true"></i>
                </span>
              </div>
              {/* <img  src={`/assets/images/__Menu.png`}alt=""className="menu_icon me-3 d-lg-none d-block" /> */}
              <div className={`offcanvas-menu ${isOpen ? 'open' : ''}`}>
                <div className="mb-3 mt-3 ms-3">
                  <img onClick={closeMenu} src={`/assets/images/__Back arrow_green.png`} alt="" className="menu_icon me-3 " />
                </div>
                {/* Your menu content here */}
                {/* <SideBar/> */}
                <div className="px-3">

                  <div className='sidebar_stories py-3 mb-3'>
                    {
                      category.length > 0 ?
                        <div className='px-3'>
                          <h3 className='mb-4'>Categories</h3>
                          {
                            category.map((data, i) => (
                              <div className="checkbox-container w-100" key={i} onClick={() => { data?.blog_category_id == filter.categoryId ? setFilter((p) => ({ ...p, categoryId: '' })) : setFilter((p) => ({ ...p, categoryId: data?.blog_category_id })) }}>
                                <div className='d-flex align-items-center justify-content-between mb-3'
                                >
                                  <p className="mb-0 text-dark">{data?.title}</p>
                                </div>
                                <input type="checkbox" checked={data?.blog_category_id == filter.categoryId} onChange={()=>{}} />
                                <span className="checkmark me-3"></span>
                              </div>
                            ))
                          }
                        </div>
                        : ""
                    }
                    <hr></hr>
                    {
                      domains.length > 0 ?
                        <div className='px-3' >
                          <h3 className='mb-4'>Domain</h3>
                          {
                            domains.map((data, i) => (
                              <div className="checkbox-container w-100" key={i} onClick={() => { data?.id === filter.domainId ? setFilter((p) => ({ ...p, domainId: '' })) : setFilter((p) => ({ ...p, domainId: data?.id })) }}>
                                <div className='d-flex align-items-center justify-content-between mb-3'
                                >
                                  <p className="mb-0 text-dark">{data?.name}</p>
                                </div>
                                <input type="checkbox" checked={data?.id == filter.domainId} onChange={()=>{}} />
                                <span className="checkmark me-3"></span>
                              </div>
                            ))
                          }
                          <a className='theme_color'> View More</a>
                        </div>
                        : ""
                    }
                  </div>

                  {
                    topstories.length > 0 ?
                      <div className='sidebar_stories py-3'>
                        <div className='px-3'>
                          <h3 className='mb-4'>Top Stories</h3>
                          {
                            topstories.map((data, i) => (
                              <Link to={`/stories_detail`} state={{ id: data?.blog_id }} key={i}>
                                <div className='mb-3' >
                                  <p className='mb-2'>{data?.title}</p>
                                  {
                                    data?.updated_date &&
                                    <div className="d-flex align-items-center">
                                      <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                      <h6 className="mb-0">{formatUnixTimestamp(data?.added_date)}</h6>
                                    </div>
                                  }
                                </div>
                              </Link>
                            ))
                          }
                        </div>
                      </div> : ''
                  }
                </div>
              </div>
              <Container className='text-common my-4 stories'>
                <Row>
                  <Col xl="8">
                    {
                      pageloading ?
                        <div className='pageLoading'>
                          <span
                            className={cn(
                              'd-flex h-100vh w-100 flex-column align-items-center justify-content-center'
                            )}
                          >
                            <span className={"loading"} />
                          </span>
                        </div> : stories.length > 0 ?
                          <div className="d-flex flex-column justify-content-between h-100">
                            <Row>{currentPageItems}</Row>
                            {
                              stories.length > 10 ?
                                <div className="d-flex justify-content-center">
                                  <div className="pagination">
                                    <Button type="button" className="btn_lecy" disabled={activePage === 1} onClick={goToFirstPage}>
                                      <i className="fa fa-angle-left" aria-hidden="true"></i>
                                    </Button>
                                    {paginationNumbers}
                                    <Button type="button" className="btn_lecy" disabled={activePage === totalPages} onClick={goToLastPage}>
                                      <i className="fa fa-angle-right" aria-hidden="true"></i>
                                    </Button>
                                  </div>
                                </div> : ''
                            }
                          </div> :
                          <div className="text-center d-flex align-items-center  justify-content-center h-100 ">
                            <img src='/assets/nodata.png' className='w-50' />
                          </div>
                    }
                  </Col>
                  <Col className="d-xl-block d-none">
                    {
                      category?.length > 0 || domains.length > 0 ?
                        <div className='sidebar_stories py-3 mb-3'>
                          <div className='px-3'>
                            {category?.length > 0 ? <h3 className='mb-4'>Categories</h3> : ''}
                            {
                              category?.map((d, i) => (
                                <div className="checkbox-container w-100" key={i} onClick={() => { d?.blog_category_id == filter.categoryId ? setFilter((p) => ({ ...p, categoryId: '' })) : setFilter((p) => ({ ...p, categoryId: d?.blog_category_id })) }}>
                                  <div className='d-flex align-items-center justify-content-between mb-3'
                                  >
                                    <p className="mb-0 text-dark">{d?.title}</p>
                                  </div>
                                  <input type="checkbox" checked={d?.blog_category_id == filter.categoryId} onChange={()=>{}} />
                                  <span className="checkmark me-3" ></span>
                                </div>
                              ))
                            }

                          </div>
                          {category?.length > 0 ? <hr></hr> : ''}

                          {
                            domains.length > 0 ?
                              <div className='px-3'>
                                <h3 className='mb-4'>Domain</h3>
                                {
                                  domains.map((data, i) => (
                                    <div className="checkbox-container w-100" key={i} onClick={() => { data?.id === filter.domainId ? setFilter((p) => ({ ...p, domainId: '' })) : setFilter((p) => ({ ...p, domainId: data?.id })) }}>
                                      <div className='d-flex align-items-center justify-content-between mb-3'
                                      >
                                        <p className="mb-0 text-dark">{data?.name}</p>
                                      </div>
                                      <input type="checkbox" checked={data?.id === filter.domainId} onChange={()=>{}} />
                                      <span className="checkmark me-3"></span>
                                    </div>
                                  ))
                                }

                                {/* <a className='theme_color'> View More</a> */}

                              </div>
                              : ""
                          }
                        </div> : ''
                    }

                    {
                      topstories.length > 0 ?
                        <div className='sidebar_stories py-3'>
                          <div className='px-3'>
                            <h3 className='mb-4'>Top Stories</h3>
                            {
                              topstories.map((data, i) => (
                                <Link to={`/stories_detail`} state={{ id: data?.blog_id }} key={i}>
                                  <div className='mb-3'>
                                    <p className='mb-2 text_hover two_line'>{data?.title}</p>
                                    {
                                      data?.added_date &&
                                      <div className="d-flex align-items-center">
                                        <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />
                                        <h6 className="mb-0">{formatUnixTimestamp(data?.added_date)}</h6>
                                      </div>
                                    }
                                  </div>
                                </Link>
                              ))
                            }

                            {/* <div className='mb-3'>
                              <p className='mb-2'>Passing The Torch #09: The Future of Marketing and Al, with Mike...</p>
                              <div className="d-flex align-items-center">
                                <img src={`/assets/images/homepg/stories/__Calender.png`} alt="" className="calender_icon me-2" />

                                <h6 className="mb-0">24 Dec 2022</h6>
                              </div>
                            </div> */}
                          </div>

                        </div> : ''
                    }
                  </Col>
                </Row>
              </Container>
            </>
          </section>
      }
    </>
  )
}

export default Stories;