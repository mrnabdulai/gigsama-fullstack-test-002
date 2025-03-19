import { Router } from "express";

const router = Router();

router.use("/projects", require("./projects/resolvers").default);


router.use(async (err, req, res, next) => {
    if (res.headersSent) {
        return next(err)
    }
    res.status((err.code >= 100 && err.code < 600) ? err.code : 500).json({
        success: false,
        message: err.message
    })
});

export default router;