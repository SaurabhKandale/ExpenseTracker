import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import CustomInputField from "../../Common/CustomInputField";
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
import useToastHook from "../../../Hooks/useToastHook";
import { apiService } from "../../../Api/apiService";
import {
  addTransaction,
  updateTransaction,
} from "../../../Slices/TransactionSlice";
import { ThreeDots } from "react-loader-spinner";
import CustomNumberInputField from "../../Common/CustomNumberInputField";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface AddMoneyToAccountProps {
  isEdit?: boolean;
  transactionDetails?: Transaction;
  onClose?: () => void;
}

const AddMoneyToAccount: FunctionComponent<AddMoneyToAccountProps> = ({
  isEdit,
  transactionDetails,
  onClose,
}) => {
  const [amount, setAmount] = useState<number | undefined>(
    transactionDetails?.transactionAmount
  );
  const userDetails: UserDetails = useSelectorHook(selectUserDetails);
  const [selectedAccountId, setSelectedAccountId] = useState<string>(
    transactionDetails?.accountIdToWhichMoneyTransferred || ""
  );
  const [fieldError, setFieldError] = useState<string>("");
  const { showToast } = useToastHook();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(
    transactionDetails?.transactionDescription || ""
  );
  const dispatch = useDispatchHook();
  const isMobile = useIsMobileHook();

  const validate = () => {
    if (!amount) {
      setFieldError("amount");
      showToast({
        description: "Amount cannot be empty",
        type: "warning",
      });
      return false;
    }
    if (!selectedAccountId) {
      setFieldError("selectedAccount");
      showToast({
        description: "Select an account to add money.",
        type: "warning",
      });
      return false;
    }
    return true;
  };

  const clearFields = () => {
    setAmount(undefined);
    setSelectedAccountId("");
    setDescription("");
  };

  const handleDescriptionUpdate = (description: string) => {
    if (description.length > 50) {
      showToast({
        description: "Description cannot exceed 50 characters",
        type: "warning",
      });
      return;
    }
    setDescription(description);
  };

  const handleAccountUpdate = (isEdit?: boolean) => {
    if (
      isEdit &&
      transactionDetails?.accountIdToWhichMoneyTransferred !== selectedAccountId
    ) {
      const usedAccount = userDetails.userAccounts.find(
        (account) =>
          account.accountId ===
          transactionDetails?.accountIdToWhichMoneyTransferred
      );
      if (usedAccount && amount) {
        dispatch(
          updateUserAccountDetails({
            ...usedAccount,
            accountBalance:
              usedAccount.accountBalance -
              (transactionDetails?.transactionAmount || 0),
          })
        );
      }
    }
    const usedAccount = userDetails.userAccounts.find(
      (account) => account.accountId === selectedAccountId
    );
    if (usedAccount && amount) {
      dispatch(
        updateUserAccountDetails({
          ...usedAccount,
          accountBalance:
            transactionDetails &&
            transactionDetails.accountIdToWhichMoneyTransferred !==
              selectedAccountId
              ? usedAccount.accountBalance + amount
              : transactionDetails
                ? usedAccount.accountBalance +
                  amount -
                  transactionDetails.transactionAmount
                : usedAccount.accountBalance + amount,
        })
      );
    }
  };

  const handleAddMoneyToAccount = async () => {
    if (!validate()) return;

    const payLoad = {
      transactionAmount: amount!,
      transactionCategory: "Income",
      transactionDate: transactionDetails
        ? transactionDetails.transactionDate
        : convertDateInISOtoIST(new Date()).substring(0, 19),
      accountId: "",
      userId: userDetails.userId,
      transactionType: "CREDIT",
      accountIdToWhichMoneyTransferred: selectedAccountId!,
      transactionDescription: description,
    };

    setIsLoading(true);
    try {
      const response: any = isEdit
        ? // ? await apiService.put(`/transaction/update`, {
          //     ...payLoad,
          //     transactionId: transactionDetails?.transactionId,
          //   })
          await apiService.put(
            `/transaction/update/${transactionDetails?.transactionId}`,
            payLoad
          )
        : // : await apiService.post("/transaction/add", payLoad);
          await apiService.post("/transaction/create", payLoad);
      showToast({
        description: "Money added successfully.",
        type: "success",
      });
      setIsLoading(false);
      if (isEdit) {
        dispatch(updateTransaction(response));
      } else {
        dispatch(addTransaction(response));
      }
      handleAccountUpdate(isEdit);
      setIsLoading(false);
      clearFields();
      isEdit && onClose && onClose();
    } catch (err: any) {
      showToast({
        description:
          err.response?.data?.message ||
          "An error occurred while adding money.",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  return (
    <VStack
      width={"100%"}
      borderRadius={isEdit ? "0px" : "24px"}
      backgroundColor={"brand.100"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      p={["24px 24px", "24px 32px"]}
      gap={["16px", "24px"]}
    >
      <Text fontSize={["custom-sm", "custom-md"]} fontWeight={500}>
        Add Money to one of your accounts.
      </Text>

      <CustomNumberInputField
        placeholder={"Enter amount"}
        onChange={function (str: number): void {
          if (fieldError === "amount") setFieldError("");
          setAmount(isNaN(str) ? undefined : str);
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
          Select account to add money
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
                    if (fieldError === "selectedAccount") setFieldError("");
                    selectedAccountId === account.accountId
                      ? setSelectedAccountId("")
                      : setSelectedAccountId(account.accountId);
                  }}
                  width={["", "220px"]}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"4px"}
                  margin={["0px", "4px"]}
                  ml={"0"}
                >
                  {selectedAccountId === account.accountId && (
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
        onClick={!isLoading ? handleAddMoneyToAccount : () => {}}
        fontSize={["custom-xs", "custom-sm"]}
      >
        {isLoading ? (
          <ThreeDots height={"16px"} width={"16px"} color="white" />
        ) : isEdit ? (
          "Submit"
        ) : (
          "Add Money"
        )}
      </Button>
    </VStack>
  );
};

export default AddMoneyToAccount;
