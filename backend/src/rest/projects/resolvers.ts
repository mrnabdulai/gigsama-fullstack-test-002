import { Router } from "express";
import { getRequestInfo } from "../../utils";
import services from "../../services";
import { getPagination } from "../../utils/pagination";
import { askQuestionSchema, generateSchemaSchema, startSessionSchema } from "./schema";
import validate from "../middlewares/validator";

const router = Router();

// Get all projects (with optional pagination)
router.get("/", async (req, res, next) => {
    try {
        const [args, ctx] = getRequestInfo(req, res);
        let results;
        if (args?.pageSize && args?.page) {
            const [rows, total] = await Promise.all([
                services.projects.getProjects(
                    args,
                    ctx
                ),
                services.projects.getProjectsCount(
                    args,
                    ctx
                ),
            ]);
            results = getPagination({
                page: args?.page,
                pageSize: args?.pageSize,
                rows,
                total,
            });
        }
        else {
            results = await services.projects.getProjects(args, ctx);
        }
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});

// Create a new project


// Get project by slug
router.get("/:slug", async (req, res, next) => {
    try {
        const [args, ctx] = getRequestInfo(req, res);
        const results = await services.projects.getProjectBySlug(args, ctx);
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});


// Start AI session (initialize a new project)
router.post("/start-session", validate(startSessionSchema), async (req, res, next) => {
    try {
        const [args, ctx] = getRequestInfo(req, res);
        const results = await services.projects.startAiSession(args, ctx);
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});

// Ask a question (add to AI session)
router.post("/ask-question/:projectId", validate(askQuestionSchema), async (req, res, next) => {
    try {
        const [args, ctx] = getRequestInfo(req, res);
        const results = await services.projects.askQuestion(args, ctx);
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});

// Generate schema from the collected answers
router.post("/generate-schema", validate(generateSchemaSchema), async (req, res, next) => {
    try {
        const [args, ctx] = getRequestInfo(req, res);
        const results = await services.projects.generateSchema(args, ctx);
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});

// Add version to existing project
router.post("/:slug/versions", async (req, res, next) => {
    try {
        const [args, ctx] = getRequestInfo(req, res);
        const results = await services.projects.createVersion(args, ctx);
        return res.status(200).json(results);
    } catch (err) {
        next(err);
    }
});

export default router;