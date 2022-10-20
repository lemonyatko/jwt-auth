import { Router } from "express";
import UserController from "../contollers/UserController";
import { body } from "express-validator";
import { authMiddleware } from "../middleware/AuthMiddleware";

const router = Router();

router.post('/signup',
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 15 }),
    body('fullname').isLength({ min: 1, max: 25 }),
    UserController.signup);
router.post('/signin', UserController.signin);
router.post('/logout', UserController.logout);
router.get('/activate/:link', UserController.activateAccount);
router.get('/refresh', UserController.refresh);
router.get('/users', authMiddleware, UserController.getUsers);

export { router };