import { HStack, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import {
  MonthwiseTransactions,
  TransactionsGroupedByDate,
  UserDetails,
} from "../../../types";
import { apiService } from "../../../Api/apiService";
import ExpenseListItem from "./ExpenseListItem";
import Loader from "../../Common/Loader";
import { useDispatchHook, useSelectorHook } from "../../../app/hooks";
import {
  addMonthwiseTransactions,
  getMonthwiseTransactions,
} from "../../../Slices/TransactionSlice";
import NoContent from "../../Common/NoContent";
import {
  convertMMMMto,
  convertToDateFormat,
  formatToCustomDateIST,
  formatToRupees,
  getDayFromDate,
} from "../../../utils";
import TransactionsListHeader from "./TransactionsListHeader";
import DatePicker from "react-datepicker";
import { ArrowDown2, ArrowLeft2 } from "iconsax-react";
import { ThreeDots } from "react-loader-spinner";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface TransactionsProps {
  userDetails: UserDetails;
}

const Transactions: FunctionComponent<TransactionsProps> = ({
  userDetails,
}) => {
  const monthwiseTransactions: MonthwiseTransactions = useSelectorHook(
    getMonthwiseTransactions
  );
  const datePickerRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatchHook();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [selectedMonth, setSelectedMonth] = useState<Date>(
    !monthwiseTransactions?.monthName?.length
      ? new Date()
      : new Date(convertMMMMto(monthwiseTransactions?.monthName || ""))
  );
  const isMobile = useIsMobileHook();

  console.log(monthwiseTransactions);

  const handleFetchExpenses = async (date?: string) => {
    setIsLoading(true);
    try {
      const response: MonthwiseTransactions = await apiService.get(
        `/transaction/get/${date}`
      );
      dispatch(addMonthwiseTransactions(response));
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!monthwiseTransactions?.monthName?.length)
      handleFetchExpenses(
        convertToDateFormat(selectedMonth.toLocaleDateString())
      );

    return () => {
      console.log("component unmounted");
    };
  }, []);

  return (
    <VStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      //   backgroundColor={"brand.100"}
      borderRadius={"16px"}
      gap={["12px","24px"]}
      overflowY={"auto"}
      height={"100%"}
      pb={[12, "0"]}
    >
      <HStack
        width={["100%", "70%"]}
        backgroundColor={"brand.900"}
        borderRadius={"16px"}
        color={"white"}
        p={["12px 16px", "12px 32px"]}
        justifyContent={"space-between"}
        alignItems={["center", "center"]}
        flexDir={["row", "row"]}
        gap={["0px", "0px"]}
      >
        <HStack justifyContent={"flex-start"} alignItems={"center"}>
          <ArrowDown2
            size={14}
            color="white"
            variant={"Linear"}
            fontWeight={"bold"}
            onClick={() => {
              datePickerRef.current.setOpen(true);
            }}
            cursor={"pointer"}
          />
          <DatePicker
            ref={datePickerRef}
            selected={selectedMonth}
            showMonthYearPicker
            dateFormat={"MMMM yyyy"}
            onChange={(date) => {
              setSelectedMonth(date as Date);
              handleFetchExpenses(
                convertToDateFormat(date?.toLocaleDateString() || "")
              );
            }}
            className="date-picker"
            maxDate={new Date()}
            onKeyDown={(e) => e.preventDefault()}
          />
        </HStack>
        <HStack
          fontWeight={500}
          onClick={() => {
            datePickerRef.current.setOpen(true);
          }}
          justifyContent={"space-between"}
          alignItems={["flex-start", "center"]}
          minW={["", "50%"]}
          gap={["20px", "24px"]}
          fontSize={["sm", "md"]}
          flexDir={"row"}
        >
          <HStack
            // flexDir={["column", "row"]}
            gap={"12px"}
            alignItems={"flex-start"}
          >
            {!isMobile && (
              <Text fontSize={["custom-md", "custom-lg"]}>Total Transaction :</Text>
            )}

            <Text color={["red.500", "white"]} fontSize={["custom-md", "custom-lg"]}>
              {isLoading ? (
                <ThreeDots color={"white"} height={"18px"} width={"18px"} />
              ) : (
                ` ${formatToRupees(monthwiseTransactions?.totalMonthlyExpenditure)}`
              )}
            </Text>
          </HStack>
          <HStack
            // flexDir={["column", "row"]}
            gap={"12px"}
            alignItems={"flex-start"}
          >
            {!isMobile && <Text fontSize={["custom-md", "custom-lg"]}>Extra Income :</Text>}
            <Text color={["green.500", "white"]} fontSize={["custom-md", "custom-lg"]}>
              {isLoading ? (
                <ThreeDots color={"white"} height={"18px"} width={"18px"} />
              ) : (
                ` ${formatToRupees(monthwiseTransactions?.totalMonthlyExtraIncome)}`
              )}
            </Text>
          </HStack>
        </HStack>
      </HStack>
      {isLoading ? (
        <VStack w={"100%"} height={["50vh", "100%"]}>
          <Loader size="md" />
        </VStack>
      ) : !isLoading &&
        !monthwiseTransactions?.transactionsGroupedByDate?.length ? (
        <NoContent text="No expenses to show." />
      ) : (
        <VStack width={"100%"} gap={["12px","24px"]} height={"100%"} overflowY={"auto"}>
          {monthwiseTransactions.transactionsGroupedByDate?.map(
            (item: TransactionsGroupedByDate, index) => {
              return (
                item.transactions.length > 0 && (
                  <VStack
                    width={"100%"}
                    justifyContent={"flex-start"}
                    alignItems={"flex-start"}
                    gap={["0", "12px"]}
                    key={index}
                    fontSize={["sm", "md"]}
                  >
                    <HStack
                      width={"100%"}
                      backgroundColor={"brand.300"}
                      borderRadius={"16px"}
                      gap={["8px", "0px"]}
                      justifyContent={"space-between"}
                      p={["16px 16px", "12px 32px"]}
                      fontWeight={500}
                      flexDir={["row", "row"]}
                      alignItems={["flex-start", "center"]}
                      borderBottomRadius={["0px", "16px"]}
                      borderBottom={["0.5px solid", "none"]}
                      borderColor={"brand.700"}
                    >
                      <HStack alignItems={"center"}>
                        <Text fontSize={["custom-md", "custom-lg"]}>{weekDays[getDayFromDate(item.date) - 1]}</Text>
                        <Text>
                          {formatToCustomDateIST(new Date(item.date))}
                        </Text>
                      </HStack>

                      <HStack
                        gap={["32px", "32px"]}
                        flexDir={"row"}
                        alignItems={["flex-start", "center"]}
                      >
                        <Text color={["red.600", "black"]} fontSize={["custom-md", "custom-lg"]}>
                          {!isMobile ? "Total Transaction : " : ""}
                          {formatToRupees(item.totalExpenditureOnDate)}
                        </Text>
                        <Text color={["green.600", "black"]} fontSize={["custom-md", "custom-lg"]}>
                          {!isMobile ? "Extra Income : " : ""}
                          {formatToRupees(item.totalExtraIncomeOnDate)}
                        </Text>
                      </HStack>
                    </HStack>
                    <VStack
                      width={"100%"}
                      gap={"0px"}
                      backgroundColor={"brand.100"}
                      borderRadius={"16px"}
                    >
                      {!isMobile && <TransactionsListHeader />}

                      {item.transactions.map((transaction) => (
                        <ExpenseListItem
                          transactionData={transaction}
                          isLast={
                            item.transactions.indexOf(transaction) ===
                            item.transactions.length - 1
                          }
                          accountName={
                            userDetails.userAccounts.find(
                              (account) =>
                                account.accountId === transaction.accountId
                            )?.accountName || ""
                          }
                          toAccountName={
                            userDetails.userAccounts.find(
                              (account) =>
                                account.accountId ===
                                transaction.accountIdToWhichMoneyTransferred
                            )?.accountName || ""
                          }
                          isAccountActive={
                            transaction.transactionType === "CREDIT"
                              ? userDetails.userAccounts.find(
                                  (account) =>
                                    account.accountId ===
                                    transaction.accountIdToWhichMoneyTransferred
                                )?.accountStatus === "active" || false
                              : transaction.transactionType === "TRANSFER"
                                ? (userDetails.userAccounts.find(
                                    (account) =>
                                      account.accountId ===
                                      transaction.accountIdToWhichMoneyTransferred
                                  )?.accountStatus === "active" &&
                                    userDetails.userAccounts.find(
                                      (account) =>
                                        account.accountId ===
                                        transaction.accountId
                                    )?.accountStatus === "active") ||
                                  false
                                : userDetails.userAccounts.find(
                                    (account) =>
                                      account.accountId ===
                                      transaction.accountId
                                  )?.accountStatus === "active" || false
                          }
                          key={transaction.transactionId}
                          userDetails={userDetails}
                        />
                      ))}
                    </VStack>
                  </VStack>
                )
              );
            }
          )}
        </VStack>
      )}
    </VStack>
  );
};

export default Transactions;
