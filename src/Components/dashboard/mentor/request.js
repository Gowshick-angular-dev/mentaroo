import axios from "axios";
import MainApi from "../../ApiClient/Https_client";

export async function myBookingList(id) {
    const response = await MainApi.get('/api_instructor/my_bookings/' + id)
    return response.data
}


export async function getMySession(id, schId, status) {
    const response = await MainApi.get('/api/mentor_sessions/' + id + `?schedule_id=${schId ?? ''}&status=${status ?? ''}`)
    return response.data
}

export async function PostSchedule(body) {
    const response = await MainApi.post('/api/saveSchedule', body)
    return response.data
}



export async function Updatechedule(id, body) {
    const response = await MainApi.post(`/api/update_schedule/${id}`, body)
    return response.data
}

export async function getOnboardingPdfDown(id) {
    const response = await MainApi.get(`/api_instructor/complete_mentor_onboarding?user_id=${id}`)
    return response.data
}


// J17A07G20A00N

export async function getSchedule(id, status) {
    const respnse = await MainApi.get('/api/schedule/' + id + `?edit=${status ?? ''}`)
    return respnse.data
}


export async function DeleteSchedule(id) {
    const respnse = await MainApi.get('/api/delete_schedule/' + id)
    return respnse.data
}



// Stories 

export async function saveStories(body) {
    const response = await MainApi.post('/api_instructor/add_story', body)
    return response.data
}


export async function myStoriesList(id) {
    const response = await MainApi.get('/api_instructor/mentor_stories/' + id)
    return response.data
}

export async function deleteStories(id) {
    const response = await MainApi.get('/api_instructor/delete_story/' + id)
    return response.data
}


// settting 

export async function ChangePassword(id, body) {
    const response = await MainApi.post(`/api_instructor/change_password/${id}`, body)
    return response.data
}


// account
export async function getPdfDown() {
    const response = await MainApi.get('/api_instructor/instructor_terms_conditions')
    return response.data
}

export async function postAccount(body) {
    const response = await MainApi.post('/api_instructor/bank_account_details', body)
    return response.data
}

export async function updateAccount(body) {
    const response = await MainApi.post('/api_instructor/bank_account_details', body)
    return response.data
}

export async function getAccountDetails(id) {
    const response = await MainApi.get('/api_instructor/bank_account/' + id)
    return response.data
}

export async function getPayoutRevenu(start, end, offer, plan) {
    const response = await MainApi.get(`/api_instructor/payout_filter?startDate=${start}&endDate=${end}&program_id=${offer}&package_id=${plan}`)
    return response.data
}



export async function updateVideoJoin(id) {
    const response = await MainApi.get('/api_instructor/videoChatjoinNow?scheduleId=' + id)
    return response.data
}

export async function finshedSession(id) {
    const response = await MainApi.get('/api_instructor/videoChatCompleted?scheduleId=' + id)
    return response.data
}

export async function postWebinar(body) {
    const response = await MainApi.post('/api_instructor/webinar_save',body)
    return response.data
}


export async function getWabinar(id) {
    const response = await MainApi.get('/api_instructor/webinar?tutor='+id)
    return response.data
}

export async function getknowMentee(id,bookId) {
    const response = await MainApi.get(`/api/learningGoalsAll?user_id=${id}&booking_id=${bookId}`)
    return response.data
}
