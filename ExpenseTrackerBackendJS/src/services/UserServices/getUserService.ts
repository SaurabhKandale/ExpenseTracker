import { Request, Response } from "express";
import prisma from "../../lib/prisma";

const getUserService = async (request: Request, response: Response) => {
  try {
    const userId = request.user?.userId;
    const user = await prisma.userData.findUnique({
      where: {
        userId: userId,
      },
      include: {
        userAccounts: true,
        userRecurringExpenses: true,
      },
    });
    

    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }

    const { userPassword, ...userDataWithoutPassword } = user;

    return response.status(200).json(userDataWithoutPassword);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: "Internal server error" });
  }
};

export default getUserService;
