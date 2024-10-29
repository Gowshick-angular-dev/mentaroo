import MainApi from "../../ApiClient/Https_client";


// Home Page
export async function getSlider() {
    const response = await MainApi.get('/api/slider')
    return response.data
}
export async function getDomains() {
    const response = await MainApi.get('/api/domain_expertise')
    return response.data
}

export async function getStoryCat() {
    const response = await MainApi.get('/api/story_categories')
    return response.data
}

export async function getTestimonials(id) {
    const response = await MainApi.get('/api/testimonials/' + id)
    return response.data
}

export async function getPrograms() {
    const response = await MainApi.get('/api/course')
    return response.data
}

export async function getCompanies() {
    const response = await MainApi.get('/api/companies')
    return response.data
}

export async function getAdvices() {
    const response = await MainApi.get('/api/advice')
    return response.data
}

export async function getCareerMentor(id) {
    const response = await MainApi.get('/api/expertise_users/' + id)
    return response.data
}


export async function getExploreProgram() {
    const response = await MainApi.get('/api/explore_programs')
    return response.data
}

export async function getFaq(id) {
    const response = await MainApi.get('/api/faq/' + id)
    return response.data
}

export async function getCounterUp() {
    const response = await MainApi.get('/api/counterup')
    return response.data
}

export async function getBanner2() {
    const response = await MainApi.get('/api/add_banner')
    return response.data
}


export async function getStories() {
    const response = await MainApi.get('/api/stories')
    return response.data
}


export async function getPopularStories() {
    const response = await MainApi.get('/api/stories')
    return response.data
}


export async function getMentors(key, exp, price, rating, company, domain, program, sort) {
    const response = await MainApi.get(`/api_instructor/all_instructors?key=${key ?? ''}&exp=${exp ?? ''}&price=${price ?? ''}&rating=${rating ?? ''}&company=${company ?? ''}&domain=${domain ?? ''}&program=${program ?? ''}&sort=${sort ?? ''}`)
    return response.data
}

export async function getALlStories(categoryId, domainId) {
    const response = await MainApi.get(`/api/all_stories?category_id=${categoryId}&domain_id=${domainId}`)
    return response.data
}


export async function getMentorDetails(id) {
    const response = await MainApi.get('/api_instructor/instructor_detail/' + id)
    return response.data
}


export async function getMentorPac(id) {
    const response = await MainApi.get('/api_instructor/mentor_programs/' + id)
    return response.data
}


export async function getMentorPacDetails(id, menId) {
    const response = await MainApi.get('/api_instructor/package_details/' + id + "?mentor_id=" + menId)
    return response.data
}

export async function getStoriesDetails(id) {
    const response = await MainApi.get('/api/stories_detail/' + id)
    return response.data
}

export async function getTermsConditions() {
    const response = await MainApi.get('/api/terms_and_conditions')
    return response.data
}

export async function getPrivatepolicy() {
    const response = await MainApi.get('/api/privacy_policy')
    return response.data
}

export async function getTitleHome() {
    const response = await MainApi.get('/api_instructor/home_page')
    return response.data
}


// become a mentor
export async function getTopBanner() {
    const response = await MainApi.get('/api_instructor/mentor_top_banner')
    return response.data
}

export async function getSkillList() {
    const response = await MainApi.get('/api_instructor/mentor_skills')
    return response.data
}

export async function getEmpowerlist() {
    const response = await MainApi.get('/api_instructor/empower_you')
    return response.data
}


export async function getCounterUpList() {
    const response = await MainApi.get('/api_instructor/mentor_counterup')
    return response.data
}


export async function getSupport() {
    const response = await MainApi.get('/api_instructor/mentee_support')
    return response.data
}

export async function getMakeDiff() {
    const response = await MainApi.get('/api_instructor/make_difference')
    return response.data
}

// about Page

export async function getAboutEmpower() {
    const response = await MainApi.get('/api_instructor/about_empower')
    return response.data
}

export async function getAboutCouter() {
    const response = await MainApi.get('/api_instructor/about_counterup')
    return response.data
}


export async function getAboutVision() {
    const response = await MainApi.get('/api_instructor/about_vision')
    return response.data
}


export async function getAboutPlatform() {
    const response = await MainApi.get('/api_instructor/about_platform')
    return response.data
}


export async function getAboutMentor() {
    const response = await MainApi.get('/api_instructor/about_mentor')
    return response.data
}


// Booking
export async function postBooking(body) {
    const response = await MainApi.post('/api/save_booking', body)
    return response.data
}


// Payments
export async function redirctPayment(pay) {
    const response = await MainApi.get('/Payment_gateway/phonePe/' + pay)
    return response.data
}


export async function getCouponList() {
    const response = await MainApi.get('/api/coupons')
    return response.data
}

// slotes List
export async function getBookingslots(id) {
    const response = await MainApi.get('/api/tutor_slots/' + id)
    return response.data
} 