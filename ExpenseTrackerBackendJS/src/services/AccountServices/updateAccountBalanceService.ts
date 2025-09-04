import { Account } from "../../types";
import prisma from "../../lib/prisma";

const updateAccountBalanceService = async (
  accountId: string,
  updatedAccountBalance: number
): Promise<boolean> => {
  try {
    await prisma.account.update({
      where: {
        accountId: accountId,
      },
      data: {
        accountBalance: updatedAccountBalance,
      },
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default updateAccountBalanceService;
