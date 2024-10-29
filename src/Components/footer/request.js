import MainApi from "../ApiClient/Https_client";


export async function AdminDetails() {
    const response = await MainApi.get('/api/admin_details')
    return response.data
}


export async function getDisclaimer() {
    const response = await MainApi.get('/api/settings_data/disclaimer')
    return response.data
}

export async function PostContact(body) {
    const response = await MainApi.post('/api/contact_us', body)
    return response.data
}

export async function getFaqCat() {
    const response = await MainApi.get('/api/faq_category')
    return response.data
}

export async function getFaqAgainstCat(id) {
    const response = await MainApi.get('/api/faq/' + id)
    return response.data
}


export async function getTestimonials() {
    const response = await MainApi.get('/api/testimonials_category')
    return response.data
}


export async function getAgainstTestimonials(id) {
    const response = await MainApi.get('/api/testimonials/' + id)
    return response.data
}


export async function getRefundPolicy() {
    const response = await MainApi.get('/api/settings_data/refund_policy')
    return response.data
}

export async function getSocialMedia() {
    const response = await MainApi.get('/api/social_media_links')
    return response.data
}

export async function getCookiesPolicy() {
    const response = await MainApi.get('/api/settings_data/cookie_policy')
    return response.data
}

