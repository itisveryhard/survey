import type { TQuestion } from "../question/question.types.ts";

export type TCreateSurveyPayload = {
    title: string,
    questions?: TQuestion[]
}

export type TSurvey = {
    title: string,
    id: string,
    questions: TQuestion[]
}
