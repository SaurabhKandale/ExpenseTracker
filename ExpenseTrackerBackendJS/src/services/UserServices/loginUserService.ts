import { Request, Response } from "express";
import { UserData } from "../../types";
import bcrypt from "bcryptjs";
import prisma from "../../lib/prisma";
import config from "../../config";
import jwt from "jsonwebtoken";

const checkBasicValidation = (email: string, password: string): boolean => {
  if (!email || !password) {
    return false;
  }
  return true;
};

const loginUserService = async (request: Request, response: Response) => {
  const { email, password } = request.body;
  if (!checkBasicValidation(email, password)) {
    return response.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const user: UserData | null = await prisma.userData.findUnique({
      where: {
        userEmail: email,
      },
      include: {
        userAccounts: true,
        userRecurringExpenses: true,
      },
    });

    if (!user) {
      return response.status(401).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.userPassword);

    if (!isPasswordValid) {
      return response.status(401).json({ message: "Invalid password" });
    }

    //@ts-ignore
    const token = jwt.sign(
      {
        userId: user.userId,
        email: user.userEmail,
      },
      config.jwtSecret,
      {
        expiresIn: config.jwtExpiry,
      }
    );

    return response.status(200).json({
      token: token,
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export default loginUserService;
