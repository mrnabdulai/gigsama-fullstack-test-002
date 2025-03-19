import { Schema, model, SchemaTypes } from 'mongoose';
import { IProject, IAiSession, IVersion } from './index.types';

// Embedded schema for AI Sessions
const AiSessionSchema = new Schema<IAiSession>({
    question: {
        type: SchemaTypes.String,
        required: false
    },
    answer: {
        type: SchemaTypes.String,
        required: false
    },

}, { _id: true, timestamps: true });

// Embedded schema for Versions
const VersionSchema = new Schema<IVersion>({
    schemaJson: {
        type: SchemaTypes.Mixed,
        required: false
    },
    schemaText: {
        type: SchemaTypes.String,
        required: false
    },
    createdAt: {
        type: SchemaTypes.Date,
        default: Date.now
    }
}, { _id: true, timestamps: true });

// Main Project schema
const ProjectSchema = new Schema<IProject>({
    userId: {
        type: SchemaTypes.ObjectId,
        ref: 'User',
        required: false
    },
    title: {
        type: SchemaTypes.String,
        required: true
    },
    schemaJson: {
        type: SchemaTypes.Mixed,
        required: false
    },
    schemaText: {
        type: SchemaTypes.String,
        required: false
    },
    slug: {
        type: SchemaTypes.String,
        required: true,
        unique: true
    },
    aiSessions: {
        type: [AiSessionSchema],
        default: []
    },
    versions: {
        type: [VersionSchema],
        default: []
    }
}, { timestamps: true });

// Index for faster lookups
ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ userId: 1 });

export const ProjectModel = model('Project', ProjectSchema);