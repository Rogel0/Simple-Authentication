import { CookieOptions } from "express";


export const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    domain: process.env.COOKIE_DOMAIN,
    path: "/",
}

export const refreshTokenCookieOptions: CookieOptions = {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const accessTokenCookieOptions: CookieOptions = {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
}