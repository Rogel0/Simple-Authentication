import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/user.model.js";
import { signAccessToken } from "../utils/jwt.js";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = registerSchema.parse(req.body);

    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        status: "error",
        message: "User already exists",
      });
    }

    const user = await UserModel.create(email, password);

    const accessToken = signAccessToken(user.id);

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await UserModel.findByEmail(email);
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await UserModel.comparePassword(
      password,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    const accessToken = signAccessToken(user.id);

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
        },
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
