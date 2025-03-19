import { IAppContext } from "../context";
import { Request, Response } from "express";

export const getRequestInfo = (req: Request, res: Response): [Record<any, any>, IAppContext] => {
  return [
    {
      ...req.body,
      ...req.query,
      ...req.params,
    },
    res.locals.context ?? {},
  ];
};
