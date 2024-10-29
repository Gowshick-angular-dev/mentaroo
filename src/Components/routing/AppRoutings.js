import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import Footer from '../footer/Footer';
import Header from '../header/Header';
import Login from '../Auth/Login';
import ForgetPwd from '../Auth/ForgetPassword';
import CheckMail from '../Auth/CheckEmail';
import Register from '../Auth/Register';
import { Outlet } from 'react-router-dom'
import ProfileSet from '../Auth/ProfileSetup';
import ProfileSet2 from '../Auth/ProfileSetup2';
import Mentor from '../pages/mentor/Mentor';
import MentorDetails from '../pages/mentor/MentorDetails';
import BookingSlotPage from '../pages/booking/BookingSlot';
import BookingConfirm from '../pages/booking/BookingConfirm';
import BecomeMentor from '../pages/BecomeMentor';
import Stories from '../pages/stories/Stories';
import StoriesDetail from '../pages/stories/StoryDetails';
import Faq from '../pages/Faq';
import AboutUs from '../pages/AboutUs';
import ExplorePrograms from '../pages/ExploreProgram';
import ContactUs from '../pages/ContactUs';
import TermsService from '../pages/TermService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import RefundPolicy from '../pages/RefundPolicy';
import Disclaimer from '../pages/Disclaimer';
import MentorApplyFrom1 from '../Auth/mentorApply/MentorApplyFrom1';
import MentorApplyFrom2 from '../Auth/mentorApply/MentorApplyFrom2';
import MentorApplyFrom3 from '../Auth/mentorApply/MentorApplyFrom3';
import { useAuth } from '../Auth/core/Auth';
import PrivateRoutes from './PrivateRouting';
import ScrollToTop from '../ScrollToTop';
import CookiesPolicy from '../pages/CookiesPolicy';
import { useEffect, useState } from 'react';
import { AdminDetails } from '../footer/request';
import TeamsComponent from '../Teams/teamsMain';


const AppRoutes = () => {

    const { auth } = useAuth();

    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {
                    auth ? (<>
                        {/* <Route path='/auth/*' element={<Navigate to='/dashboard' />} /> */}
                        <Route path='/login' element={<Navigate to='/dashboard' />} />
                        <Route path='/fogetpassword' element={<Navigate to='/dashboard' />} />
                        <Route path='/password' element={<Navigate to='/dashboard' />} />
                        <Route path='/register' element={<Navigate to='/dashboard' />} />
                        <Route path='/profile-setup' element={<Navigate to='/dashboard' />} />
                        <Route path='/profile-setup-2' element={<Navigate to='/dashboard' />} />
                        {/* <Route path='/mentorApplyForm-1' element={<Navigate to='/dashboard' />} />
                        <Route path='/mentorApplyForm-2' element={<Navigate to='/dashboard' />} />
                        <Route path='/mentorApplyForm-3' element={<Navigate to='/dashboard' />} /> */}
                        <Route path='/*' element={<PrivateRoutes />} />
                        <Route path='/booking' element={<BookingSlotPage />} />
                        <Route path='/bookingConfirm' element={<BookingConfirm />} />
                    </>) : (<>
                        <Route path='/*' element={<Navigate to='/login' />} />
                         {/* Auth */}
                        <Route path='/login' element={<Login />} />
                        <Route path='/fogetpassword' element={<ForgetPwd />} />
                        <Route path='/password' element={<CheckMail />} />
                        <Route path='/password/:slug' element={<CheckMail />} />
                        <Route path='/register' element={<Register />} />
                        <Route path='/profile-setup' element={<ProfileSet />} />
                        <Route path='/profile-setup-2' element={<ProfileSet2 />} />
                        <Route path='/mentorApplyForm-1' element={<MentorApplyFrom1 />} />
                        <Route path='/mentorApplyForm-2' element={<MentorApplyFrom2 />} />
                        <Route path='/mentorApplyForm-3' element={<MentorApplyFrom3 />} />
                    </>)
                }

                <Route path='/mentorApplyForm-1' element={<MentorApplyFrom1 />} />
                <Route element={<WithHeaderAndFooter />}>
                   <Route path="/" element={<Home />} />
                   <Route path="/mentor" element={<Mentor />} />
                   <Route path="/mentorDetails" element={<MentorDetails />} />
                   <Route path="/mentorDetails/:slug" element={<MentorDetails />} />
                   <Route path="/becomeMentor" element={<BecomeMentor />} />
                   <Route path="/stories" element={<Stories />} />
                   <Route path="/stories_detail" element={<StoriesDetail />} />
                   <Route path="/stories_detail/:slug" element={<StoriesDetail />} />
                   <Route path="/faq" element={<Faq />} />
                   <Route path="/about-us" element={<AboutUs />} />
                   <Route path="/meeting" element={<TeamsComponent />} />
                   <Route path="/exploreprogram" element={<ExplorePrograms />} />
                   <Route path="/contact-us" element={<ContactUs />} />
                   <Route path="/termsService" element={<TermsService />} />
                   <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                   <Route path="/refundPolicy" element={<RefundPolicy />} />
                   <Route path="/cookiePolicy" element={<CookiesPolicy />} />
                   <Route path="/disclaimer" element={<Disclaimer />} />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes;



const WithHeaderAndFooter = () => {

    const [admin, setAdmin] = useState([]);

    const fetchAdmin = async (id) => {
        AdminDetails().then(res => {
            setAdmin(res?.data);
            localStorage.setItem("admin", JSON.stringify(res?.data));
        }).catch(e => {
            console.log(e)
        })
    }

    useEffect(() => {
        fetchAdmin();
    }, [])


    return (
        <>
            <Header admin={admin} />
             <Outlet />
            <Footer admin={admin} />
        </>
    );
};