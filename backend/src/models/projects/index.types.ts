import { Document, Types } from 'mongoose';

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
  userId?: Types.ObjectId;
  title: string;
  schemaJson: Record<string, any>;
  schemaText: string;
  slug: string;
  aiSessions: IAiSession[];
  versions: IVersion[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectDocument extends IProject, Document {
  // Add any instance methods here if needed
}