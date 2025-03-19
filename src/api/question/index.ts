import axios from 'axios';
import type { TQuestion, TCreateQuestionParams, TAddAnswerParams, TAddConnectionBody } from "./question.types.ts";

const createQuestion = (body: TCreateQuestionParams) => {
    return axios.post<TQuestion>('/api/questions/', body)
}

const addAnswerToQuestion = (body: TAddAnswerParams) => {
    return axios.post<TQuestion>('/api/answers/', body)
}

const addConnection = (body: TAddConnectionBody) => {
    return axios.post('/api/connections/', body)
}

export const question = {
    createQuestion,
    addAnswerToQuestion,
    addConnection
}
