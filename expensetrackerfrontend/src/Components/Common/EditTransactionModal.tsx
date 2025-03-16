import { FunctionComponent } from "react";
import { RecurringExpense, Transaction, UserDetails } from "../../types";
import {
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogRoot,
} from "../ui/dialog";
import { HStack, Text } from "@chakra-ui/react";
import { CloseCircle } from "iconsax-react";
import CreateNewExpense from "../App/Transaction/CreateExpense";
import { useSelectorHook } from "../../app/hooks";
import { selectUserDetails } from "../../Slices/UserSlice";
import AddMoneyToAccount from "../App/Income/AddMoneyToAccount";
import TransferMoneyFromAccount from "../App/Income/TransferMoneyFromAccount";
import CreateRecurringExpense from "../App/Profile/RecurringExpenses/CreateRecurringExpense";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

interface EditTransactionModalProps {
  transaction?: Transaction;
  isOpen: boolean;
  onClose: () => void;
  recurringExpense?: RecurringExpense;
}

const EditTransactionModal: FunctionComponent<EditTransactionModalProps> = ({
  transaction,
  isOpen,
  onClose,
  recurringExpense,
}) => {
  const userDetails: UserDetails = useSelectorHook(selectUserDetails);
  const isMobile = useIsMobileHook();

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      scrollBehavior={"inside"}
    >
      {
        //@ts-ignore
        <DialogContent>
          <DialogHeader borderBottom={"0.5px solid black"}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              <Text fontSize={["md", "lg"]} fontWeight={"semibold"}>
                {"Edit Transaction"}
              </Text>
              <CloseCircle
                color={"#000"}
                onClick={onClose}
                cursor={"pointer"}
                size={isMobile ? 18 : 20}
              />
            </HStack>
          </DialogHeader>
          <DialogBody p={"0"} borderBottomRadius={"8px"}>
            {transaction &&
              (transaction?.transactionType === "CREDIT" ? (
                <AddMoneyToAccount
                  isEdit={true}
                  transactionDetails={transaction}
                  onClose={onClose}
                />
              ) : transaction?.transactionType === "TRANSFER" ? (
                <TransferMoneyFromAccount
                  isEdit={true}
                  transactionDetails={transaction}
                  onClose={onClose}
                />
              ) : (
                <CreateNewExpense
                  userDetails={userDetails}
                  isEdit={true}
                  transactionDetails={transaction}
                  onClose={onClose}
                />
              ))}
            {recurringExpense && (
              <CreateRecurringExpense
                isEdit={true}
                recurringExpenseDetails={recurringExpense}
                onclose={onClose}
              />
            )}
          </DialogBody>
        </DialogContent>
      }
    </DialogRoot>
  );
};

export default EditTransactionModal;
