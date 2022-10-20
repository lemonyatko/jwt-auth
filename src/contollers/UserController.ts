/* eslint-disable  @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { ApiError } from "../exceptions/ApiError";
import UserService from "../service/UserService";

type MyReqTypes = {
    email: string,
    password: string,
    fullname: string
}

class UserController {
    async signup(req: Request, res: Response, next: NextFunction) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Помилка валідації', errors.array()));
            }
            const { email, password, fullname }: MyReqTypes = req.body;
            const userData = await UserService.signup(email, password, fullname);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async signin(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password }: MyReqTypes = req.body;
            const userData = await UserService.signin(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (err) {
            next(err);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            await UserService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json('Вихід з акаунту успішний');
        } catch (err) {
            next(err);
        }
    }

    async activateAccount(req: Request, res: Response, next: NextFunction) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);
            return res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
        } catch (err) {
            next(err);
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);

        } catch (err) {
            next(err);
        }
    }

    async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (err) {
            next(err);
        }
    }
}


export default new UserController();