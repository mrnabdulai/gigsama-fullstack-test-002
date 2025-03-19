import {
    runCount,
    runFind,
    runFindOne,
} from "../utils/query";
import { IAppContext } from "../context";
import { ProjectModel } from "../models";
import { generateSlug } from "../utils/code";
import { startSession, getNextQuestion, generateSchema as generateSchemaAI } from "../services/ai";

//


export async function getProjectBySlug(args, ctx: IAppContext) {
    try {
        return runFindOne("Project", { ...args, query: { slug: args.slug } });
    } catch (err) {
        console.log(err);
        return err;
    }
}
export async function getProjects(args, ctx: IAppContext) {
    try {
        // If user is authenticated, allow filtering by userId
        const query = {
            ...args.query,
            // ...(ctx.userId && args.onlyMine ? { userId: ctx.userId } : {})
        };
        return runFind("Project", {
            ...args,
            query,
        });
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function getProjectsCount(args, ctx: IAppContext) {
    try {
        // If user is authenticated, allow filtering by userId
        const query = {
            ...args.query,
            // ...(ctx.userId && args.onlyMine ? { userId: ctx.userId } : {})
        };

        return runCount("Project", {
            ...args,
            query,
        });
    } catch (err) {
        console.log(err);
        return err;
    }
}

// AI Session Operations
export async function startAiSession(args, ctx: IAppContext) {
    try {
        // Get first question from AI
        const response = await startSession(args.title);

        // Create a temporary project with initial question
        const slug = generateSlug('new-project-' + Date.now());
        const newProject = new ProjectModel({
            title: args.title || 'New Database Schema',
            slug,
            // userId: ctx.user, // Associate with current user if authenticated
            schemaJson: {},
            schemaText: "",
            aiSessions: [{
                question: "What type of database schema do you want to create today?", // This is the implicit first question
                answer: args.title, // User's initial input is the answer to this question
                createdAt: new Date()
            }, {
                question: response.question, // First follow-up question from AI
                answer: "", // No answer yet
                createdAt: new Date()
            }],
            versions: []
        });

        await newProject.save({});

        // Return the project with the first question
        return {
            projectId: newProject._id,
            slug: newProject.slug,
            currentQuestion: response.question
        };
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function askQuestion(args, ctx: IAppContext) {
    try {
        const { projectId, answer } = args;

        // Find the project
        const project = await ProjectModel.findById(projectId);
        if (!project) throw new Error("Project not found");

        // Get the last unanswered question
        const lastSession = project.aiSessions[project.aiSessions.length - 1];
        if (!lastSession) throw new Error("No active session found");

        // Update the answer
        lastSession.answer = answer;

        // Get the next question from AI
        const response = await getNextQuestion(project.aiSessions);


        // If AI has more questions, add the next question
        if (response.hasNextQuestion) {
            project.aiSessions.push({
                question: response.question,
                answer: "", // No answer yet
                createdAt: new Date()
            });
            await project.save({});
            return {
                projectId: project._id,
                slug: project.slug,
                currentQuestion: response.question,
                isComplete: false
            };
        } else {
            // If AI is done asking questions, return complete flag
            await project.save({});
            return {
                projectId: project._id,
                slug: project.slug,
                isComplete: true
            };
        }
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function generateSchema(args, ctx: IAppContext) {
    try {
        const { projectId } = args;

        // Find the project
        const project = await ProjectModel.findById(projectId);
        if (!project) throw new Error("Project not found");

        // Generate schema from AI
        const response = await generateSchemaAI(project.aiSessions);

        // Update project with schema
        project.schemaJson = response.schemaJson;
        project.schemaText = response.schemaText;

        // If title was generated and project has no title, update it
        if (response.suggestedTitle && !project.title) {
            project.title = response.suggestedTitle;
            // Update slug if title was auto-generated
            project.slug = generateSlug(response.suggestedTitle);
        }
        project.aiSessions.push({
            question: "Does this look good or would you like to make any improvements?",
            answer: "", // No answer yet
            createdAt: new Date()
        });

        await project.save({});
        return {
            projectId: project._id,
            slug: project.slug,
            title: project.title,
            schemaJson: project.schemaJson,
            schemaText: project.schemaText
        };
    } catch (err) {
        console.log(err);
        return err;
    }
}

export async function createVersion(args, ctx: IAppContext) {
    try {
        const { slug, schemaJson, schemaText } = args;

        // Find the project
        const project = await ProjectModel.findOne({ slug });
        if (!project) throw new Error("Project not found");

        // Optional: Check ownership if userId is set
        //   if (project.userId && ctx.user && !project.userId.equals(ctx.userId)) {
        //     throw new Error("Not authorized to update this project");
        //   }

        // Add current schema to versions
        project.versions.push({
            schemaJson: project.schemaJson,
            schemaText: project.schemaText,
            createdAt: new Date()
        });

        // Update with new schema
        project.schemaJson = schemaJson;
        project.schemaText = schemaText;

        await project.save({});

        return project;
    } catch (err) {
        console.log(err);
        return err;
    }
}