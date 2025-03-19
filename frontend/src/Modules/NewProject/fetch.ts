import { AxiosDataService } from "Shared/utils/axios"
import { StartProjectSessionInput } from "./typings"
import { StartProjectSessionResponse } from "./typings"

export const doStartProjectSession = async (values: StartProjectSessionInput) => {
    return AxiosDataService.post<StartProjectSessionResponse>('/api/projects/start-session', values)
}

