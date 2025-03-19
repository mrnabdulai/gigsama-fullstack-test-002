export interface IAiSession {
    question: string;
    answer: string;
    createdAt: Date;
  }
  
  export interface IVersion {
    schemaJson: Record<string, any>;
    schemaText: string;
    createdAt: Date;
  }
  
  export interface IProject {
    _id: string;
    title: string;
    schemaJson: Record<string, any>;
    schemaText: string;
    slug: string;
    aiSessions: IAiSession[];
    versions: IVersion[];
    createdAt: Date;
    updatedAt: Date;
  }

export interface IAskQuestionResponse {
    answer: string;
    projectId: string;
    slug: string;
    currentQuestion: string;
    isComplete: boolean;
}

export interface IGenerateSchemaResponse {
    projectId: string;
    slug: string;
    title: string;
    schemaJson: Record<string, any>;
    schemaText: string;
}