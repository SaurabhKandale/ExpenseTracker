import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { Transaction, UserAccount, UserDetails } from "../../../types";
import { useDispatchHook, useSelectorHook } from "../../../app/hooks";
import {
  selectUserDetails,
  updateUserAccountDetails,
} from "../../../Slices/UserSlice";
import { TickCircle } from "iconsax-react";
import {
  convertDateInISOtoIST,
  convertFirstLetterToCapital,
} from "../../../utils";
import CustomInputField from "../../Common/CustomInputField";
import useToastHook from "../../../Hooks/useToastHook";
import { apiService } from "../../../Api/apiService";
import {
  addTransaction,
  updateTransaction,
} from "../../../Slices/TransactionSlice";
import { ThreeDots } from "react-loader-spinner";
import CustomNumberInputField from "../../Common/CustomNumberInputField";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface TransferMoneyFromAccountProps {
  isEdit?: boolean;
  transactionDetails?: Transaction;
  onClose?: () => void;
}

const TransferMoneyFromAccount: FunctionComponent<
  TransferMoneyFromAccountProps
> = ({ isEdit, transactionDetails, onClose }) => {
  const userDetails: UserDetails = useSelectorHook(selectUserDetails);
  const [fromAccountId, setFromAccountId] = useState<string>(
    transactionDetails?.accountId || ""
  );
  const [toAccountId, setToAccountId] = useState<string>(
    transactionDetails?.accountIdToWhichMoneyTransferred || ""
  );
  const [amount, setAmount] = useState<number | undefined>(
    transactionDetails?.transactionAmount
  );
  const [fieldError, setFieldError] = useState<string>("");
  const { showToast } = useToastHook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useDispatchHook();
  const [description, setDescription] = useState<string>(
    transactionDetails?.transactionDescription || ""
  );
  const isMobile = useIsMobileHook();

  const handleDescriptionUpdate = (desc: string) => {
    if (desc.length > 50) {
      showToast({
        description: "Description cannot exceed 50 characters",
        type: "warning",
      });
      return;
    }
    setDescription(desc);
  };

  const validate = () => {
    if (!amount) {
      setFieldError("amount");
      showToast({
        description: "Amount cannot be empty",
        type: "warning",
      });
      return false;
    }
    if (!fromAccountId) {
      setFieldError("fromAccountId");
      showToast({
        description: "Select an account to transfer money.",
        type: "warning",
      });
      return false;
    }
    if (!toAccountId) {
      setFieldError("toAccountId");
      showToast({
        description: "Select an account to transfer money.",
        type: "warning",
      });
      return false;
    }
    if (
      (userDetails?.userAccounts?.find(
        (account) => account.accountId === fromAccountId
      )?.accountBalance || 0) < amount
    ) {
      setFieldError("amount");
      showToast({
        description: "Insufficient balance in the selected account.",
        type: "warning",
      });
      return false;
    }
    return true;
  };

  const clearFields = () => {
    setAmount(undefined);
    setFromAccountId("");
    setToAccountId("");
    setDescription("");
  };

  const handleAccountUpdate = (isEdit?: boolean) => {
    if (!transactionDetails) return;
    if (transactionDetails?.accountId !== fromAccountId) {
      const oldFromAccount = userDetails.userAccounts.find(
        (account) => account.accountId === transactionDetails?.accountId
      );
      if (oldFromAccount) {
        dispatch(
          updateUserAccountDetails({
            ...oldFromAccount,
            accountBalance:
              oldFromAccount.accountBalance +
              transactionDetails?.transactionAmount,
          })
        );
      }
    } else {
      const oldFromAccount = userDetails.userAccounts.find(
        (account) => account.accountId === fromAccountId
      );
      if (oldFromAccount) {
        dispatch(
          updateUserAccountDetails({
            ...oldFromAccount,
            accountBalance:
              oldFromAccount.accountBalance -
              ((amount || 0)-transactionDetails?.transactionAmount),
          })
        );
      }
    }

    if (transactionDetails?.accountIdToWhichMoneyTransferred !== toAccountId) {
      const oldToAccount = userDetails.userAccounts.find(
        (account) =>
          account.accountId ===
          transactionDetails?.accountIdToWhichMoneyTransferred
      );
      if (oldToAccount) {
        dispatch(
          updateUserAccountDetails({
            ...oldToAccount,
            accountBalance:
              oldToAccount.accountBalance -
              transactionDetails?.transactionAmount,
          })
        );
      }
    } else {
      const oldToAccount = userDetails.userAccounts.find(
        (account) => account.accountId === toAccountId
      );
      if (oldToAccount) {
        dispatch(
          updateUserAccountDetails({
            ...oldToAccount,
            accountBalance:
              oldToAccount.accountBalance -
              transactionDetails?.transactionAmount +
              (amount || 0),
          })
        );
      }
    }
  };

  const handleTranasferMoney = async () => {
    if (!validate()) return;

    const payload = {
      transactionAmount: amount || 0,
      transactionCategory: "Transfer",
      transactionDescription: description,
      transactionDate: transactionDetails
        ? transactionDetails.transactionDate
        : convertDateInISOtoIST(new Date()).substring(0, 19),
      accountId: fromAccountId,
      userId: userDetails.userId,
      transactionType: "TRANSFER",
      accountIdToWhichMoneyTransferred: toAccountId,
    };

    setIsLoading(true);
    try {
      const response: any = isEdit
        ? // ? await apiService.put(`/transaction/update`, {
          //     ...payload,
          //     transactionId: transactionDetails?.transactionId,
          //   })
          await apiService.put(
            `/transaction/update/${transactionDetails?.transactionId}`,
            payload
          )
        : // : await apiService.post("/transaction/add", payload);
          await apiService.post("/transaction/create", payload);
      showToast({
        description: "Money transferred successfully.",
        type: "success",
      });
      isEdit
        ? dispatch(updateTransaction(response))
        : dispatch(addTransaction(response));
      if (isEdit) {
        handleAccountUpdate(isEdit);
      } else {
        const fromAccount: UserAccount | undefined =
          userDetails.userAccounts.find(
            (account) => account.accountId === fromAccountId
          );
        const toAccount: UserAccount | undefined =
          userDetails.userAccounts.find(
            (account) => account.accountId === toAccountId
          );
        if (fromAccount && toAccount) {
          dispatch(
            updateUserAccountDetails({
              ...fromAccount,
              accountBalance:
                fromAccount.accountBalance - response.transactionAmount,
            })
          );
          dispatch(
            updateUserAccountDetails({
              ...toAccount,
              accountBalance:
                toAccount.accountBalance + response.transactionAmount,
            })
          );
        }
      }
      clearFields();
      setIsLoading(false);
      isEdit && onClose && onClose();
    } catch (err: any) {
      showToast({
        description:
          err.response?.data?.message ||
          "An error occurred while transferring money.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <VStack
      width={"100%"}
      backgroundColor={"brand.100"}
      borderRadius={[!isEdit ? "24px" : "0", "24px"]}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      p={["24px", "24px 32px"]}
      gap={["16px", "24px"]}
      mb={[!isEdit ? "48px" : "0", ""]}
    >
      <Text fontWeight={500} fontSize={["sm", "md"]}>
        Transfer money from one account to another.
      </Text>
      <CustomNumberInputField
        placeholder={"Enter amount"}
        onChange={(e: any) => {
          if (fieldError === "amount") setFieldError("");
          setAmount(e);
        }}
        value={amount}
        fieldTitle="Enter amount"
        fieldError={fieldError === "amount"}
      />
      <VStack
        width={"100%"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        gap={"8px"}
      >
        <Text
          fontSize={["custom-sm", "custom-md"]}
          marginLeft={"6px"}
          color={fieldError === "selectedAccount" ? "red" : "black"}
        >
          From
        </Text>
        <HStack
          width={"100%"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          flexWrap={"wrap"}
          overflowX={"hidden"}
        >
          {userDetails.userAccounts.map(
            (account: UserAccount) =>
              account.accountStatus === "active" && (
                <HStack
                  key={account.accountId}
                  color={"black"}
                  backgroundColor={"brand.200"}
                  borderRadius={"12px"}
                  padding={"8px 16px"}
                  cursor={"pointer"}
                  transition={"all 0.3s"}
                  _hover={{
                    backgroundColor: "brand.300",
                  }}
                  onClick={() => {
                    setFromAccountId(account.accountId);
                    setToAccountId("");
                  }}
                  width={["auto", "220px"]}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"4px"}
                  margin={["0px", "4px"]}
                  ml={"0"}
                >
                  {fromAccountId === account.accountId && (
                    <TickCircle
                      size={isMobile ? 10 : 14}
                      color={"black"}
                      variant="Bold"
                    />
                  )}
                  <Text
                    fontSize={["custom-xs", "custom-sm"]}
                    fontWeight={"medium"}
                  >
                    {convertFirstLetterToCapital(account.accountName)}
                  </Text>
                </HStack>
              )
          )}
        </HStack>
      </VStack>
      <VStack
        width={"100%"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        gap={"8px"}
        opacity={fromAccountId.length ? 1 : 0.6}
      >
        <Text
          fontSize={["custom-sm", "custom-md"]}
          marginLeft={"6px"}
          color={fieldError === "selectedAccount" ? "red" : "black"}
        >
          To
        </Text>
        <HStack
          width={"100%"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          flexWrap={"wrap"}
          overflowX={"hidden"}
        >
          {userDetails.userAccounts.map(
            (account: UserAccount) =>
              account.accountStatus === "active" && (
                <HStack
                  key={account.accountId}
                  color={"black"}
                  backgroundColor={"brand.200"}
                  borderRadius={"12px"}
                  padding={"8px 16px"}
                  cursor={
                    !fromAccountId.length || fromAccountId === account.accountId
                      ? "not-allowed"
                      : "pointer"
                  }
                  transition={"all 0.3s"}
                  _hover={{
                    backgroundColor:
                      fromAccountId.length > 0 &&
                      fromAccountId !== account.accountId
                        ? "brand.300"
                        : "brand.200",
                  }}
                  onClick={() => {
                    fromAccountId &&
                      fromAccountId !== account.accountId &&
                      setToAccountId(account.accountId);
                  }}
                  width={["auto", "220px"]}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"4px"}
                  margin={["0px", "4px"]}
                  ml={"0"}
                  opacity={fromAccountId === account.accountId ? 0.5 : 1}
                >
                  {toAccountId === account.accountId && (
                    <TickCircle
                      size={isMobile ? 10 : 14}
                      color={"black"}
                      variant="Bold"
                    />
                  )}
                  <Text
                    fontSize={["custom-xs", "custom-sm"]}
                    fontWeight={"medium"}
                  >
                    {convertFirstLetterToCapital(account.accountName)}
                  </Text>
                </HStack>
              )
          )}
        </HStack>
      </VStack>
      <CustomInputField
        type={"text"}
        fieldTitle={"Description (Optional)"}
        placeholder={""}
        onChange={(desc: string) => handleDescriptionUpdate(desc)}
        value={description}
        maxLimit={50}
        isCreation={true}
      />
      <Button
        size={["sm", "md"]}
        borderRadius={"12px"}
        onClick={!isLoading ? handleTranasferMoney : () => {}}
        fontSize={["custom-xs", "custom-sm"]}
      >
        {isLoading ? <ThreeDots /> : isEdit ? "Transfer Money" : "Submit"}
      </Button>
    </VStack>
  );
};

export default TransferMoneyFromAccount;
