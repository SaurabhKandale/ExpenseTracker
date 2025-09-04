import { Account } from "../../types";
import prisma from "../../lib/prisma";

const getAccountDetailsService = async (accountId: string): Promise<Account | null> => {
    try{
        const account=await prisma.account.findUnique({
            where:{
                accountId
            }
        });
        return account;
    }catch(error){
        console.log(error);
        return null;
    }
}

export default getAccountDetailsService;