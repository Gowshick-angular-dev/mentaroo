import { FC, lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import Dashboard from '../dashboard/Dashboard';
import EditMyProfile from '../dashboard/EditProfile';
import MyBooking from '../dashboard/mentor/MyBooking';
import CalenderPage from '../dashboard/mentor/Calender';
import MyMessage from '../dashboard/Chat';
import MyStories from '../dashboard/mentor/MyStories';
import AccountSettings from '../dashboard/mentor/AccountSetting';
import BookingStatus from '../dashboard/mentor/BookingStatus';
import AddNewStory from '../dashboard/mentor/StoriesForm';
import Payout from '../dashboard/mentor/Payout';
import MyPurchse from '../dashboard/mentee/Purchase';
import Sessions from '../dashboard/mentee/Session';
import SlotBooking from '../dashboard/mentee/Bookings';
import MyProgram from '../dashboard/mentee/Programs';
import Settings from '../dashboard/Setting';
import DashboardNavbar from '../dashboard/DashboardNavbar';




const PrivateRoutes = () => {
    return (
        <Routes>
            {/* dashboard */}
            <Route element={<DashbparHeader />}>
                <Route path='dashboard' element={<Dashboard />} />
                <Route path='profile' element={<EditMyProfile />} />
                <Route path='my-bookings' element={<MyBooking />} />
                <Route path='calender-page' element={<CalenderPage />} />
                <Route path='my-message' element={<MyMessage />} />
                <Route path='my-stories' element={<MyStories />} />
                <Route path='account-settings' element={<AccountSettings />} />
                <Route path='settings' element={<Settings />} />
                <Route path='pending_approval' element={<BookingStatus />} />
                <Route path='story-form' element={<AddNewStory />} />
                <Route path='payout' element={<Payout />} />
                <Route path='my-purchase' element={<MyPurchse />} />
                <Route path='my-program' element={<MyProgram />} />
                <Route path='sessions' element={<Sessions />} />
                <Route path='slot-booking' element={<SlotBooking />} />
            </Route>
        </Routes>
    )

}

export default PrivateRoutes;



const DashbparHeader = () => {

    return (
        <>
            <DashboardNavbar />
            <Outlet />
        </>
    );
};