/* eslint-disable  @typescript-eslint/no-unused-vars */
import { ApiError } from "../exceptions/ApiError";
import { NextFunction, Request, Response } from "express";

function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors });
    }
    return res.status(500).json({ message: 'Непередбачувана помилка' });
}

export { errorMiddleware };