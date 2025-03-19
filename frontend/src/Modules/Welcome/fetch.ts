import { AxiosDataService } from "Shared/utils/axios"
import { HomeProject } from "./typings"

export const getProjects = async () => {
    return AxiosDataService.get<HomeProject[]>('/api/projects?select=title,createdAt,slug')
}

