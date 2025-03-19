export type TAnswerOptions = {
    text: string;
    connection?: string;
}

export type TAddAnswerParams = {
    text: string;
    question: string
}

export type TCreateQuestionParams = {
    text: string;
    survey: string;
}

export type TConnectionType = "any" | "specific";

export type TQuestion = {
    "id": string;
    "text": string,
    "survey"?: string,
    "answer_options"?: TAnswerOptions[],
    "connections"?: {
        connection_type: TConnectionType
        to_question: string
    }[]
}

export type TAddConnectionBody = {
    "connection_type": TConnectionType,
    "from_question": string,
    "answer_option": string | null,
    "to_question": string
}
