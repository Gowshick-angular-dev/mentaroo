import MainApi from "../../ApiClient/Https_client"




export async function MetorLogin(body) {
    const response = await MainApi.post('/api_instructor/login', body)
    return response.data
}

export async function MenteeLogin(email, password) {
    const response = await MainApi.get(`/api/login?email=${email}&password=${password}`)
    return response.data
}

export async function MenteeRegister(body) {
    const response = await MainApi.post(`/api/signup`, body)
    return response.data
}

export async function MentorRegister(body) {
    const response = await MainApi.post(`/api_instructor/register`, body)
    return response.data
}


export async function MentorSaveProgram(body) {
    const response = await MainApi.post(`/api_instructor/save_program_price`, body)
    return response.data
}



export async function getSituation() {
    const response = await MainApi.get('/api/current_situation')
    return response.data
}

export async function getGoals() {
    const response = await MainApi.get('/api/career_goal')
    return response.data
}


export async function getIntrest() {
    const response = await MainApi.get('/api/domain_expertise')
    return response.data
}


export async function getCountry() {
    const response = await MainApi.get('/api/country')
    return response.data
}


export async function getState(id) {
    const response = await MainApi.get('/api/state/' + id)
    return response.data
}

export async function getCity(id) {
    const response = await MainApi.get('/api/city/' + id)
    return response.data
}

export async function getTimeZone() {
    const response = await MainApi.get('/api/timezone')
    return response.data
}

export async function getSkills() {
    const response = await MainApi.get('/api/skills')
    return response.data
}

export async function getPackages() {
    const response = await MainApi.get('/api_instructor/packages')
    return response.data
}

export async function getJobTitle() {
    const response = await MainApi.get('/api/job_title')
    return response.data
}


export async function getOptinal() {
    const response = await MainApi.get('/api/hear_about_us')
    return response.data
}


export async function SendOtp(body) {
    const response = await MainApi.post('/api/send_otp', body)
    return response.data
}


export async function OTPVeryfy(body) {
    const response = await MainApi.post('/api/verify_otp', body)
    return response.data
}

// forget password

export async function forgetSendOtp(body) {
    const response = await MainApi.post('/api_instructor/forgot_password', body)
    return response.data
}


export async function forgetverifyOtp(body) {
    const response = await MainApi.post('/api/verify_otp', body)
    return response.data
}

export async function PostNewPassword(id, body) {
    const response = await MainApi.post('/api_instructor/change_new_password/' + id, body)
    return response.data
}