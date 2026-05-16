import { FunctionComponent, useState } from "react";
import { RecurringExpense, Transaction, UserAccount } from "../../../../types";
import { Button, HStack, Text, GridItem, VStack } from "@chakra-ui/react";
import { ThreeDots } from "react-loader-spinner";
import {
  convertDateInISOtoIST,
  convertFirstLetterToCapital,
  formatToRupees,
} from "../../../../utils";
import { Forbidden2 } from "iconsax-react";
import useToastHook from "../../../../Hooks/useToastHook";
import { apiService } from "../../../../Api/apiService";
import { useDispatchHook } from "../../../../app/hooks";
import {
  removeRecurringExpenseFromUserDetails,
  updateUserAccountDetails,
} from "../../../../Slices/UserSlice";
import ConfirmationModal from "../../../Common/ConfirmationModal";
import EditTransactionModal from "../../../Common/EditTransactionModal";
import { addTransaction } from "../../../../Slices/TransactionSlice";
import useIsMobileHook from "../../../../Hooks/useIsMobileHook";

interface RecurringExpensesListItemProps {
  index: number;
  expense: RecurringExpense;
  account: UserAccount;
  userId: number;
}

const RecurringExpensesListItem: FunctionComponent<
  RecurringExpensesListItemProps
> = ({ index, expense, account, userId }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToastHook();
  const dispatch = useDispatchHook();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isConfirmForAddModalOpen, setIsConfirmForAddModalOpen] =
    useState<boolean>(false);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const isMobile = useIsMobileHook();

  const handleRemoveExpense = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await apiService.delete(
        // `/recurringExpense/remove/${expense.recurringExpenseId}`
        `/recurringExpense/delete/${expense.recurringExpenseId}`
      );
      showToast({
        description: "Expense removed successfully",
        type: "success",
      });
      dispatch(
        removeRecurringExpenseFromUserDetails(expense.recurringExpenseId)
      );
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleAddRecurringExpenseToTransactions = async () => {
    setIsAdding(true);
    const payload = {
      accountId: account.accountId,
      transactionAmount: expense.recurringExpenseAmount,
      transactionDescription: expense.recurringExpenseTitle,
      transactionCategory: expense.recurringExpenseCategory,
      transactionDate: convertDateInISOtoIST(new Date()).substring(0, 19),
      transactionType: "DEBIT",
      userId: userId,
      accountIdToWhichMoneyTransferred: "",
    };

    try {
      const response: any = await apiService.post("/transaction/create", payload);
      setIsAdding(false);
      setIsConfirmForAddModalOpen(false);
      showToast({
        description: "Added expense to transactions.",
        type: "success",
      });
      dispatch(
        addTransaction({
          ...response,
          transactionDate: response.transactionDate,
        })
      );
      dispatch(
        updateUserAccountDetails({
          ...account,
          accountBalance: account.accountBalance - response.transactionAmount,
        })
      );
    } catch (err) {
      console.log(err);
      showToast({
        description: "Something went wrong",
        type: "error",
      });
      setIsAdding(false);
    }
  };

  const onEditClick = () => {
    setIsEditModalOpen(true);
  };

  return (
    <HStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      backgroundColor={"brand.200"}
      p={["20px", "16px"]}
      borderRadius={"16px"}
      display={"grid"}
      gridTemplateColumns={[
        "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        "0.3fr 2fr 1fr 1.5fr 1fr 2.3fr",
      ]}
      gridTemplateRows={isMobile ? "1fr 1fr 1fr 1fr" : "1fr"}
      spaceY={["16px", "0px"]}
      gap={[0, "12px"]}
      pt={[0, "16px"]}
    >
      {(isConfirmModalOpen || isConfirmForAddModalOpen) && (
        <ConfirmationModal
          text={
            isConfirmModalOpen
              ? "Are you sure you want to remove this expense?"
              : "Are you sure you want to add this expense? This wiil get added to your transactions with the current date."
          }
          isOpen={isConfirmModalOpen || isConfirmForAddModalOpen}
          onClose={() => {
            isConfirmModalOpen
              ? setIsConfirmModalOpen(false)
              : setIsConfirmForAddModalOpen(false);
          }}
          title={
            isConfirmModalOpen
              ? "Remove recurring expense"
              : "Add to transactions"
          }
          onConfirm={
            isConfirmModalOpen
              ? handleRemoveExpense
              : handleAddRecurringExpenseToTransactions
          }
          isLoading={isConfirmModalOpen ? isLoading : isAdding}
        />
      )}
      {isEditModalOpen && (
        <EditTransactionModal
          recurringExpense={expense}
          transaction={undefined}
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
        />
      )}
      <GridItem
        colSpan={1}
        alignItems={"flex-start"}
        pl={["6px", "28px"]}
        mt={["16px", "0"]}
      >
        <Text fontSize={["custom-md", "custom-lg"]}>{index}.</Text>
      </GridItem>
      <GridItem colSpan={[7, 1]} alignItems={"flex-start"} pl={["6px", "32px"]}>
        <Text fontSize={["custom-md", "custom-lg"]} ml={["-18px", 0]}>
          {convertFirstLetterToCapital(expense.recurringExpenseTitle)}
        </Text>
      </GridItem>
      <GridItem
        colSpan={[8, 1]}
        display={"flex"}
        alignItems={["center", "flex-start"]}
        pl={["6px", "32px"]}
        spaceX={["6px", "0"]}
      >
        {isMobile && (
          <Text fontSize={["custom-md", "custom-md"]} width={"30%"}>
            Amount :
          </Text>
        )}
        <Text fontSize={["custom-md", "custom-lg"]}>
          {formatToRupees(expense.recurringExpenseAmount)}
        </Text>
      </GridItem>
      <GridItem
        colSpan={[8, 1]}
        display={"flex"}
        alignItems={["center", "flex-start"]}
        pl={["6px", "32px"]}
        spaceX={["6px", "0"]}
      >
        {isMobile && (
          <Text fontSize={["custom-md", "custom-md"]} width={"30%"}>
            Account :
          </Text>
        )}
        <Text fontSize={["custom-md", "custom-lg"]}>
          {convertFirstLetterToCapital(account.accountName)}
        </Text>
      </GridItem>
      <GridItem
        colSpan={[8, 1]}
        display={"flex"}
        alignItems={["center", "flex-start"]}
        pl={["6px", "32px"]}
        spaceX={["6px", "0"]}
      >
        {isMobile && (
          <Text fontSize={["custom-md", "custom-md"]} width={"30%"}>
            Category :
          </Text>
        )}
        <Text fontSize={["custom-md", "custom-lg"]}>
          {convertFirstLetterToCapital(expense.recurringExpenseCategory)}
        </Text>
      </GridItem>
      <GridItem
        display={"flex"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        pl={["6px", "32px"]}
        colSpan={[8, 1]}
        spaceX={"12px"}
      >
        <Button
          variant={"outline"}
          size={["xs", "sm"]}
          width={"100px"}
          borderRadius={"12px"}
          borderColor={"brand.500"}
          cursor={"pointer"}
          onClick={onEditClick}
          fontSize={["custom-sm", "custom-sm"]}
        >
          Edit
        </Button>
        <Button
          variant={"solid"}
          size={["xs", "sm"]}
          width={"120px"}
          borderRadius={"12px"}
          cursor={"pointer"}
          backgroundColor={"green.200"}
          borderColor={"green.700"}
          color={"green"}
          transition={"all 0.3s"}
          _hover={{ backgroundColor: "green.600", color: "white" }}
          onClick={() => {
            setIsConfirmForAddModalOpen(true);
          }}
          fontSize={["custom-sm", "custom-sm"]}
        >
          {isAdding ? (
            <ThreeDots color={"green"} height={"32px"} width={"32px"} />
          ) : (
            "Add expense"
          )}
        </Button>
        <VStack
          backgroundColor={"red.100"}
          borderRadius={"8px"}
          p={["4px", "6px"]}
          transition={"all 0.3s"}
          height={"100%"}
          _hover={{ shadow: "md" }}
          cursor={"pointer"}
          onClick={() => {
            setIsConfirmModalOpen(true);
          }}
        >
          {isLoading ? (
            <ThreeDots width={"16px"} height={"16px"} color="red" />
          ) : (
            <Forbidden2 size={18} color={"red"} />
          )}
        </VStack>
      </GridItem>
    </HStack>
  );
};

export default RecurringExpensesListItem;
