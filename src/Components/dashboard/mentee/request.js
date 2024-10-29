import axios from "axios";
import MainApi from "../../ApiClient/Https_client";


export async function getMyProgram(id) {
    const response = await MainApi.get('/api/myBookings/' + id)
    return response.data
}

export async function postReview(body) {
    const response = await MainApi.post('/api/reviewPost', body)
    return response.data
}


export async function getLearnGoal() {
    const response = await MainApi.get('/api/learningGoalsQuestion')
    return response.data
}

export async function postGoals(body) {
    const response = await MainApi.post('/api/learningGoalsAnswer', body)
    return response.data
}

