export type StartProjectSessionInput = {
    title: string;
}

export type StartProjectSessionResponse = {
    projectId: string;
    slug: string;
    currentQuestion: string;
}

