export type TAnswerOptions = {
    id: string;
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

export type TConnections = {
    connection_type: TConnectionType,
    answer_option_id: null | string,
    id: string;
    to_question: string
}

export type TQuestion = {
    "id": string;
    "text": string,
    "survey"?: string,
    "answer_options"?: TAnswerOptions[],
    "connections"?: TConnections[]
}

export type TAddConnectionBody = {
    "connection_type": TConnectionType,
    "from_question": string,
    "answer_option": string | null,
    "to_question": string
}
