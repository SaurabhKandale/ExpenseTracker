import { FunctionComponent, useState } from "react";
import { Transaction, UserAccount, UserDetails } from "../../../types";
import { GridItem, HStack, Text, VStack } from "@chakra-ui/react";
import {
  convertFirstLetterToCapital,
  formatToRupees,
  getTimeFromDate,
} from "../../../utils";
import {
  ArrowDown2,
  ArrowDown3,
  ArrowUp2,
  ArrowUp3,
  Edit,
  Forbidden2,
  InfoCircle,
} from "iconsax-react";
import EditExpenseModal from "../../Common/EditTransactionModal";
import { apiService } from "../../../Api/apiService";
import { useDispatchHook } from "../../../app/hooks";
import { removeTransaction } from "../../../Slices/TransactionSlice";
import { ThreeDots } from "react-loader-spinner";
import ConfirmationModal from "../../Common/ConfirmationModal";
import { updateUserAccountDetails } from "../../../Slices/UserSlice";
import { Tooltip } from "../../ui/tooltip";
import useToastHook from "../../../Hooks/useToastHook";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";
import TransactionListItemSingleBlock from "./TransactionListItemSingleBlock";

interface ExpenseListItemsProps {
  transactionData: Transaction;
  accountName: string;
  isAccountActive: boolean;
  isLast: boolean;
  userDetails: UserDetails;
  toAccountName?: string;
}

const ExpenseListItem: FunctionComponent<ExpenseListItemsProps> = ({
  transactionData,
  accountName,
  isLast,
  userDetails,
  isAccountActive,
  toAccountName,
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatchHook();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const { showToast } = useToastHook();
  const isMobile = useIsMobileHook();

  console.log(userDetails.userAccounts);

  const updateAccountUsedForTransaction = (transactionData: Transaction) => {
    if (transactionData.transactionType === "CREDIT") {
      const accountToWhichMoneyAdded: UserAccount | undefined =
        userDetails.userAccounts.find(
          (account) =>
            account.accountId ===
            transactionData.accountIdToWhichMoneyTransferred,
        );

      if (accountToWhichMoneyAdded) {
        const updatedAccount: UserAccount = {
          ...accountToWhichMoneyAdded,
          accountBalance:
            accountToWhichMoneyAdded.accountBalance -
            transactionData.transactionAmount,
        };
        dispatch(updateUserAccountDetails(updatedAccount));
      }
    } else if (transactionData.transactionType === "DEBIT") {
      const accountUsedForTransaction: UserAccount | undefined =
        userDetails.userAccounts.find(
          (account) => account.accountId === transactionData.accountId,
        );

      if (accountUsedForTransaction) {
        const updatedAccount: UserAccount = {
          ...accountUsedForTransaction,
          accountBalance:
            accountUsedForTransaction.accountBalance +
            transactionData.transactionAmount,
        };
        console.log("updatedAccount", updatedAccount);
        dispatch(updateUserAccountDetails(updatedAccount));
      }
    } else {
      const accountFromWhichMoneyTransferred: UserAccount | undefined =
        userDetails.userAccounts.find(
          (account) => account.accountId === transactionData.accountId,
        );
      const accountToWhichMoneyTransferred: UserAccount | undefined =
        userDetails.userAccounts.find(
          (account) =>
            account.accountId ===
            transactionData.accountIdToWhichMoneyTransferred,
        );

      if (accountFromWhichMoneyTransferred) {
        const updatedAccountFromWhichMoneyTransferred = {
          ...accountFromWhichMoneyTransferred,
          accountBalance:
            accountFromWhichMoneyTransferred.accountBalance +
            transactionData.transactionAmount,
        };
        dispatch(
          updateUserAccountDetails(updatedAccountFromWhichMoneyTransferred),
        );
      }
      if (accountToWhichMoneyTransferred) {
        const updatedAccountToWhichMoneyTransferred = {
          ...accountToWhichMoneyTransferred,
          accountBalance:
            accountToWhichMoneyTransferred.accountBalance -
            transactionData.transactionAmount,
        };
        dispatch(
          updateUserAccountDetails(updatedAccountToWhichMoneyTransferred),
        );
      }
    }
  };

  const handleRemoveTransaction = async () => {
    try {
      setIsLoading(true);
      await apiService.delete(
        `/transaction/remove/${transactionData.transactionId}`,
      );
      showToast({
        description: "Transaction deleted successfully.",
        type: "success",
      });
      dispatch(removeTransaction(transactionData));
      updateAccountUsedForTransaction(transactionData);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
    }
  };

  return (
    <HStack
      width={"100%"}
      display={"grid"}
      //   gridTemplateColumns={"1fr 1fr 1.5fr 1.5fr 2fr 1fr"}
      gridTemplateColumns={["1fr 1fr", "0.7fr 1fr 1fr 1.2fr 0.8fr 2fr 1fr"]}
      gridTemplateRows={isMobile ? "1fr 1fr 1fr 1fr" : "1fr"}
      //   backgroundColor={"brand.900"}
      gap={"0px"}
      borderBottomRadius={isLast ? "16px" : "none"}
      fontSize={"sm"}
      backgroundColor={
        transactionData.transactionType === "DEBIT"
          ? "red.50"
          : transactionData.transactionType === "CREDIT"
            ? "green.50"
            : "#f8f9fa"
      }
      borderBottom={[isLast ? "" : "0.5px solid", "none"]}
      borderBottomColor={["brand.600", "none"]}
      pt={["12px", "0px"]}
      position={"relative"}
    >
      {isEditModalOpen && (
        <EditExpenseModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
          }}
          transaction={transactionData}
        />
      )}
      {isConfirmModalOpen && (
        <ConfirmationModal
          text={
            "Are you sure you want to delete this transaction? Don't worry, your account balance will be updated."
          }
          isOpen={isConfirmModalOpen}
          onClose={() => {
            setIsConfirmModalOpen(false);
          }}
          title={"Delete Transaction"}
          onConfirm={() => {
            handleRemoveTransaction();
          }}
        />
      )}
      <TransactionListItemSingleBlock isLast={isLast}>
        {isMobile && (
          <Text minWidth={"28%"} fontSize={["custom-sm", "custom-md"]}>
            Time :
          </Text>
        )}
        <Text fontSize={["custom-sm", "custom-md"]}>
          {getTimeFromDate(transactionData.transactionDate)}
        </Text>
      </TransactionListItemSingleBlock>
      <TransactionListItemSingleBlock isLast={isLast}>
        {isMobile && (
          <Text minWidth={"28%"} fontSize={["custom-sm", "custom-md"]}>
            Amount :
          </Text>
        )}
        <Text fontSize={["custom-sm", "custom-md"]}>
          {formatToRupees(transactionData.transactionAmount)}
        </Text>
      </TransactionListItemSingleBlock>
      <TransactionListItemSingleBlock isLast={isLast}>
        {isMobile && (
          <Text minWidth={"28%"} fontSize={["custom-sm", "custom-md"]}>
            Category :
          </Text>
        )}
        <Text fontSize={["custom-sm", "custom-md"]}>
          {convertFirstLetterToCapital(transactionData.transactionCategory)}
        </Text>
      </TransactionListItemSingleBlock>
      <TransactionListItemSingleBlock isLast={isLast}>
        {isMobile && (
          <Text minWidth={"28%"} fontSize={["custom-sm", "custom-md"]}>
            Account :
          </Text>
        )}
        {transactionData.transactionType === "TRANSFER" ? (
          <VStack gap={"0px"} fontSize={["custom-sm", "custom-md"]}>
            <HStack gap={"1"}>
              <ArrowDown2 size={14} color={"#dc2625"} variant="Bold" />
              <Text fontSize={["custom-sm", "custom-md"]}>{accountName}</Text>
            </HStack>
            <HStack gap={"1"}>
              <ArrowUp2 size={14} color={"green"} variant="Bold" />
              <Text fontSize={["custom-sm", "custom-md"]}>{toAccountName}</Text>
            </HStack>
          </VStack>
        ) : transactionData.transactionType === "CREDIT" ? (
          <HStack gap={"1"}>
            <ArrowUp2 size={14} color={"green"} variant="Bold" />
            <Text fontSize={["custom-sm", "custom-md"]}>{toAccountName}</Text>
          </HStack>
        ) : (
          <HStack gap={"1"}>
            <ArrowDown2 size={14} color={"#dc2625"} variant="Bold" />
            <Text fontSize={["custom-sm", "custom-md"]}>
              {!transactionData.accountId.length ? "-" : accountName}
            </Text>
          </HStack>
        )}
        {!isAccountActive && transactionData.transactionType !== "CREDIT" && (
          <Tooltip
            content={
              "This account is inactive. You won't be able to edit this transaction."
            }
            openDelay={100}
            closeDelay={100}
          >
            <InfoCircle size={14} color={"red"} />
          </Tooltip>
        )}
      </TransactionListItemSingleBlock>

      <TransactionListItemSingleBlock isLast={isLast}>
        {isMobile && (
          <Text width={"28%"} fontSize={["custom-sm", "custom-md"]}>
            Type :
          </Text>
        )}
        <Text fontSize={["custom-sm", "custom-md"]}>
          {convertFirstLetterToCapital(
            transactionData.transactionType.toLowerCase(),
          )}
        </Text>
      </TransactionListItemSingleBlock>

      <TransactionListItemSingleBlock isLast={isLast}>
        {isMobile && (
          <Text minWidth={"28%"} fontSize={["custom-sm", "custom-md"]}>
            Description :
          </Text>
        )}
        <Text fontSize={["custom-sm", "custom-md"]}>
          {transactionData.transactionDescription || "-"}
        </Text>
      </TransactionListItemSingleBlock>
      <TransactionListItemSingleBlock isLast={isLast} isLastRight={true}>
        <VStack
          backgroundColor={"white"}
          borderRadius={"8px"}
          p={"4px"}
          transition={"all 0.3s"}
          _hover={{ shadow: !isAccountActive ? "none" : "md" }}
          cursor={isAccountActive ? "pointer" : "default"}
          onClick={() => {
            (isAccountActive || transactionData.transactionType === "CREDIT") &&
              setIsEditModalOpen(true);
          }}
          opacity={!isAccountActive ? 0.4 : 1}
          position={["absolute", "inherit"]}
          top={["16px", "inherit"]}
          right={["54px", "inherit"]}
        >
          <Edit size={18} color={"black"} />
        </VStack>
        <VStack
          backgroundColor={"red.100"}
          borderRadius={"8px"}
          p={"4px"}
          transition={"all 0.3s"}
          _hover={{ shadow: "md" }}
          cursor={"pointer"}
          onClick={() => {
            setIsConfirmModalOpen(true);
          }}
          position={["absolute", "inherit"]}
          top={["16px", "inherit"]}
          right={["16px", "inherit"]}
        >
          {isLoading ? (
            <ThreeDots width={"22px"} height={"22px"} color="red" />
          ) : (
            <Forbidden2 size={18} color={"red"} />
          )}
        </VStack>
      </TransactionListItemSingleBlock>
    </HStack>
  );
};

export default ExpenseListItem;
