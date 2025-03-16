import { VStack, Text, HStack } from "@chakra-ui/react";
import { AddSquare } from "iconsax-react";
import { FunctionComponent } from "react";
import { RecurringExpense, UserAccount, UserDetails } from "../../../../types";
import RecurringExpensesListHeader from "./RecurringExpensesListHeader";
import RecurringExpensesListItem from "./RecurringExpensesListItem";
import useIsMobileHook from "../../../../Hooks/useIsMobileHook";
import { useNavigate } from "react-router-dom";

interface RecurringExpensesListProps {
  recurringExpenses: RecurringExpense[];
  userDetails: UserDetails;
}

const RecurringExpensesList: FunctionComponent<RecurringExpensesListProps> = ({
  recurringExpenses,
  userDetails,
}) => {
  const isMobile = useIsMobileHook();
  const navigate = useNavigate();

  return (
    <VStack
      width={"100%"}
      backgroundColor={"brand.100"}
      borderRadius={"24px"}
      p={["24px", "32px"]}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      gap={"24px"}
    >
      <HStack
        width={"100%"}
        flexDir={"row"}
        justifyContent={["space-between", "flex-start"]}
        alignItems={"flex-start"}
        gap={["0", "4px"]}
      >
        <VStack alignItems={"flex-start"} gap={["2px", "4px"]}>
          <Text fontSize={["custom-lg", "custom-xl"]} fontWeight={"semibold"}>
            Recurring Expenses
          </Text>
          <Text fontSize={["custom-xs", "custom-sm"]}>
            You can have at most 10 recurring expenses.
          </Text>
        </VStack>
        {isMobile && (
          <HStack
            width={"100px"}
            justifyContent={"center"}
            alignItems={"center"}
            backgroundColor={"brand.200"}
            p={["8px 0px", "8px 12px"]}
            borderRadius={"12px"}
            border={"1px solid transparent"}
            cursor={"pointer"}
            _hover={{
              borderColor: "brand.900",
              transition: "all 0.3s",
            }}
            onClick={() => {
              navigate("/app/recurring_expense");
            }}
          >
            <AddSquare size={isMobile ? "12px" : "14px"} color={"black"} />
            <Text fontSize={["custom-xs", "custom-sm"]} color={"black"}>
              Add new
            </Text>
          </HStack>
        )}
      </HStack>
      {!recurringExpenses.length ? (
        <Text fontSize={["custom-sm", "custom-md"]}>No recurring expenses added!</Text>
      ) : (
        <VStack
          width={"100%"}
          justifyContent={"flex-start"}
          alignItems={"flex-start"}
          gap={"12px"}
        >
          {!isMobile && <RecurringExpensesListHeader />}
          {recurringExpenses.map((expense, index) => (
            <RecurringExpensesListItem
              key={expense.recurringExpenseId}
              index={index + 1}
              expense={expense}
              account={
                userDetails.userAccounts.find(
                  (account) =>
                    account.accountId === expense.recurringExpenseAccountId
                )!
              }
              userId={userDetails.userId}
            />
          ))}
        </VStack>
      )}
    </VStack>
  );
};

export default RecurringExpensesList;
