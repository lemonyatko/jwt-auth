import { compare, hash } from "bcrypt";
import { UserDTO } from "../dtos/UserDTO";
import { UserModel } from "../models/User";
import { v4 } from "uuid";
import MailService from "./MailService";
import TokenService from "./TokenService";
import { ApiError } from "../exceptions/ApiError";

class UserService {
    async signup(email: string, password: string, fullname: string) {
        const candidate = await UserModel.findOne({ email });
        if (candidate) {
            throw ApiError.BadRequest(`Користувач з поштою ${email} вже існує`);
        }
        const hashedPassword: string = await hash(password, 3);
        const activationLink: string = v4();
        const user = await UserModel.create({ email, password: hashedPassword, fullname, activationLink });
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink: string) {
        const user = await UserModel.findOne({ activationLink });
        if (!user) {
            throw ApiError.BadRequest('Некоректне посилання активації');
        }
        user.isActivated = true;
        await user.save();
    }

    async signin(email: string, password: string) {
        const user = await UserModel.findOne({ email });
        if (!user) {
            throw ApiError.BadRequest('Користувача з таким email не знайдено');
        }
        const isPassEquals = await compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неправильний пароль');
        }
        const userDto = new UserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken: string) {
        await TokenService.removeToken(refreshToken);
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenFromDB = await TokenService.findToken(refreshToken);
        if (!userData || !tokenFromDB) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        if (!user) {
            throw ApiError.BadRequest('Користувача не знайдено');
        }
        const userDto = new UserDTO(user);
        const tokens = TokenService.generateTokens({ ...userDto });
        return {
            ...tokens,
            user: userDto
        }
    }

    async getAllUsers() {
        const user = await UserModel.find();
        return user;
    }
}

export default new UserService();