import axios from 'axios';
import type { TCreateSurveyPayload, TSurvey } from "./survey.types.ts";

const getList = () => {
    return axios.get<TSurvey[]>('/api/surveys/');
};

const getOne = (id: string) => {
    return axios.get<TSurvey>('/api/surveys/' + id + '/');
}

const updateOne = (id: string, body: TCreateSurveyPayload) => {
    return axios.patch<TSurvey>('/api/surveys/' + id + '/', body);
}

const createSurvey = (body: TCreateSurveyPayload) => {
    return axios.post<TSurvey>('/api/surveys/', body);
}

const updateSurvey = (body: TCreateSurveyPayload, id: string) => {
    return axios.patch<TSurvey>(`/api/surveys/${id}/`, body);
}

export const survey = {
    getOne,
    getList,
    createSurvey,
    updateOne,
    updateSurvey
}
