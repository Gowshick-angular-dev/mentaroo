import MainApi from "../ApiClient/Https_client";


export async function updateProfile(data) {
    const response = await MainApi.post('/api/update_userdata', data)
    return response.data
}


export async function updateMentorProfile(data) {
    const response = await MainApi.post('/api_instructor/update_userdata', data)
    return response.data
}

export async function getProfile() {
    const response = await MainApi.get(`/api/userdata?auth_token=${localStorage.getItem('token')}`)
    return response.data
}

export async function getMentorProfile() {
    const response = await MainApi.get(`/api_instructor/userdata?auth_token=${localStorage.getItem('token')}`)
    return response.data
}

export async function getDeletePackage(id, userId) {
    const response = await MainApi.get(`/api_instructor/program_price_delete/${id}/${userId}`)
    return response.data
}


export async function getUniversity() {
    const response = await MainApi.get(`/api_instructor/universities`)
    return response.data
}



export async function postExperiance(body) {
    const response = await MainApi.post(`/api_instructor/experience`, body)
    return response.data
}


export async function postEducation(body) {
    const response = await MainApi.post(`/api_instructor/education`, body)
    return response.data
}

export async function getCourse() {
    const response = await MainApi.get(`/api/course`)
    return response.data
}

export async function TopMatchSection(id) {
    const response = await MainApi.get('/api/dashboard_contents?id=' + id)
    return response.data
}

export async function getMyMentorsList(id) {
    const response = await MainApi.get('/api/tutorBooking?id=' + id)
    return response.data
}


export async function wallofGrattitute(id) {
    const response = await MainApi.get('/api_instructor/dashboard_contents/' + id)
    return response.data
}


export async function myMessangersUser(id) {
    const response = await MainApi.get('/api/myMessageUsers/' + id)
    return response.data
}



export async function getuserAginsChatlist(id) {
    const response = await MainApi.get('/api/messageList/' + id)
    return response.data
}

export async function getLastMessages(id) {
    const response = await MainApi.post('/api/get_last_message/' + id)
    return response.data
}


export async function sendMessage(body) {
    const response = await MainApi.post('/api/message', body)
    return response.data
}


export async function sendReplayMessage(thread, body) {
    const response = await MainApi.post('/api/message_reply/' + thread, body)
    return response.data
}  


export async function shareExpMentaroo(body) {
    const response = await MainApi.post('/api_instructor/shareExperiencePost', body)
    return response.data
}  

export async function getSuggession() {
    const response = await MainApi.get('/api_instructor/exp_message')
    return response.data
} 

export async function genarteOtp(body) {
    const response = await MainApi.post('/api_instructor/generateOtp',body)
    return response.data
} 


export async function VerifyCationApi(phone,otp) {
    const response = await MainApi.get(`/api_instructor/verifyOtp?phone=${phone}&otp=${otp}`)
    return response.data
} 
