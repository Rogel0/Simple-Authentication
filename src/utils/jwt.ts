import jwt from "jsonwebtoken";
import { env } from "../config/env";


export const signAccessToken = (userId: string): string => {
    return jwt.sign({ sub: userId }, env.JWT_ACCESS_SECRET, {
        expiresIn: env.ACCESS_TOKEN_EXPIRES,
    }as jwt.SignOptions)
}

export const verifyAccessToken = (token: string): any => {
    try {
        return jwt.verify(token, env.JWT_ACCESS_SECRET);
    } catch (error) {
        throw new Error("Invalid access token");
    }
}