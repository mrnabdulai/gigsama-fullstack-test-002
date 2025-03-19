import { AxiosDataService } from "Shared/utils/axios"
import { IAskQuestionResponse, IGenerateSchemaResponse, IProject } from "./typings"

export const getProject = async (slug: string) => {
    return AxiosDataService.get<IProject>("/api/projects/" + slug)
}


export const doAskQuestion = async ({
    answer,
    projectId
}: {
    answer: string,
    projectId: string
}) => {
    return AxiosDataService.post<IAskQuestionResponse>(`/api/projects/ask-question/${projectId}`, { answer })
}

export const doGenerateSchema = async ({
    projectId
}: {
    projectId: string
}) => {
    return AxiosDataService.post<IGenerateSchemaResponse>(`/api/projects/generate-schema`, { projectId })
}