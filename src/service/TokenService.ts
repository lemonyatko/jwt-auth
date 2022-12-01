// @ts-nocheck
import { sign, verify } from "jsonwebtoken";
import { UserDTO } from "../dtos/UserDTO";
import { TokenModel } from "../models/Token";

type JwtPayload = {
    id: string
} & UserDTO

class TokenService {
    generateTokens(payload: object) {
        const accessToken = sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: '10s' });
        const refreshToken = sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: string, refreshToken: string) {
        const tokenData = await TokenModel.findOne({ user: userId });
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await TokenModel.create({ user: userId, refreshToken });
        return token;
    }

    async removeToken(refreshToken: string) {
        await TokenModel.deleteOne({ refreshToken });
    }

    validateAccessToken(accessToken: string) {
        try {
            const userData = verify(accessToken, process.env.JWT_ACCESS_SECRET) as JwtPayload;
            return userData;
        } catch (error) {
            return null;
        }
    }

    validateRefreshToken(refreshToken: string) {
        try {
            const userData = verify(refreshToken, process.env.JWT_REFRESH_SECRET) as JwtPayload;
            return userData;
        } catch (error) {
            return null;
        }
    }

    async findToken(refreshToken: string) {
        const tokenData = await TokenModel.findOne({ refreshToken });
        return tokenData;
    }
}

export default new TokenService();