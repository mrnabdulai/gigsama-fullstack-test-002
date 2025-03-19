import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { CustomError } from "./errors";

export interface IAppContext {
    type?: "User"
}



