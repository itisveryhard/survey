import axios from 'axios';
import type { TQuestion, TCreateQuestionParams, TAddAnswerParams, TAddConnectionBody } from "./question.types.ts";

const createQuestion = (body: TCreateQuestionParams) => {
    return axios.post<TQuestion>('/api/questions/', body)
}

const updateQuestion = (body: TCreateQuestionParams, id: string) => {
    return axios.patch<TQuestion>(`/api/questions/${id}/`, body)
}

const addAnswerToQuestion = (body: TAddAnswerParams) => {
    return axios.post<TQuestion>('/api/answers/', body)
}

const updateAnswerQuestion = (body: TAddAnswerParams, id: string) => {
    return axios.patch<TQuestion>(`/api/answers/${id}/`, body)
}

const addConnection = (body: TAddConnectionBody) => {
    return axios.post('/api/connections/', body)
}

const updateConnection = (body: TAddConnectionBody, id: string) => {
    return axios.patch<TQuestion>(`/api/connections/${id}/`, body)
}

const deleteAllConnections = (id: string) => {
    return axios.delete<TQuestion>(`/api/questions/${id}/connections/`)
}

export const question = {
    createQuestion,
    updateQuestion,
    updateAnswerQuestion,
    addAnswerToQuestion,
    addConnection,
    updateConnection,
    deleteAllConnections
}
