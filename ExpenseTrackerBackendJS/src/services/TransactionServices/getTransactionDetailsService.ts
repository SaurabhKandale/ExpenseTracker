import prisma from "../../lib/prisma";
import { Transaction } from "../../types";

const getTransactionDetailsService = async (transactionId: string) => {
  try {
    const transactionDetails: Transaction | null =
      await prisma.transaction.findUnique({
        where: {
          transactionId: transactionId,
        },
      });
    return transactionDetails;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default getTransactionDetailsService;
