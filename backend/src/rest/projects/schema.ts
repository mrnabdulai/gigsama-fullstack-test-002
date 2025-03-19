import { object, string } from "yup";

export const startSessionSchema = object({
    body: object({
        title: string().required('Title is required'),
    }),
    query: object({}),
    params: object({
    }),
});

export const askQuestionSchema = object({
    body: object({
        answer: string().required('Kindly provide a response'),
    }),
    query: object({}),
    params: object({
        projectId: string().required('Project ID is required'),
    }),
});


export const generateSchemaSchema = object({
    body: object({
        projectId: string().required('Project ID is required'),
    }),
    query: object({}),
    params: object({}),
});