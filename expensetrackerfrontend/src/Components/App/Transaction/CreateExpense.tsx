import { VStack, Text, HStack, Textarea, Button } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import CustomInputField from "../../Common/CustomInputField";
import {
  convertFirstLetterToCapital,
  convertToDateFormat,
  formatToRupees,
  mergeDateAndTimeToIST,
} from "../../../utils";
import { TickCircle } from "iconsax-react";
import useToastHook from "../../../Hooks/useToastHook";
import { Transaction, UserAccount, UserDetails } from "../../../types";
import { apiService } from "../../../Api/apiService";
import { ThreeDots } from "react-loader-spinner";
import { useDispatchHook } from "../../../app/hooks";
import {
  addTransaction,
  updateTransaction,
} from "../../../Slices/TransactionSlice";
import { updateUserAccountDetails } from "../../../Slices/UserSlice";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface CreateNewExpenseProps {
  userDetails: UserDetails;
  transactionDetails?: Transaction;
  isEdit?: boolean;
  onClose?: () => void;
}

const CreateNewExpense: FunctionComponent<CreateNewExpenseProps> = ({
  userDetails,
  transactionDetails,
  isEdit,
  onClose,
}) => {
  const { showToast } = useToastHook();
  const dispatch = useDispatchHook();
  const isMobile = useIsMobileHook();

  const categories = [
    "food",
    "groceries",
    "shopping",
    "household",
    "entertainment",
    "travel",
    "healthcare",
    "bills",
    "education",
    "investment",
    "bike and car",
    "appearels",
    "others",
  ];
  const [selectedCategory, setSelectedCategory] = useState<string>(
    transactionDetails?.transactionCategory || ""
  );
  const [description, setDescription] = useState<string>(
    transactionDetails?.transactionDescription || ""
  );
  const [selectedAccount, setSelectedAccount] = useState<string>(
    transactionDetails?.accountId || ""
  );
  const [paymentDate, setPaymentDate] = useState<string>(
    transactionDetails
      ? convertToDateFormat(
          new Date(transactionDetails?.transactionDate).toLocaleDateString()
        )
      : convertToDateFormat(new Date().toLocaleDateString())
  );
  const [paymentTime, setPaymentTime] = useState<string>(
    isEdit
      ? new Date(transactionDetails?.transactionDate || "")
          .toLocaleTimeString()
          .substring(0, 5)
      : new Date().toLocaleTimeString().substring(0, 5)
  );

  const [paymentAmount, setPaymentAmount] = useState<number | undefined>(
    transactionDetails?.transactionAmount || undefined
  );
  const [fieldError, setFieldError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleCancel = () => {
    setPaymentDate("");
    setPaymentTime("");
    setPaymentAmount(undefined);
    setDescription("");
    setSelectedCategory("");
    setSelectedAccount("");
  };

  const validate = () => {
    if (!paymentDate) {
      setFieldError("paymentDate");
      showToast({
        description: "Payment Date cannot be empty",
        type: "warning",
      });
      return false;
    }
    if (!paymentTime) {
      setFieldError("paymentTime");
      showToast({
        description: "Payment Time cannot be empty",
        type: "warning",
      });
      return false;
    }
    if (!paymentAmount) {
      setFieldError("paymentAmount");
      showToast({
        description: "Payment Amount cannot be empty",
        type: "warning",
      });
      return false;
    }
    if (!selectedCategory) {
      setFieldError("selectedCategory");
      showToast({
        description: "Please select a category",
        type: "warning",
      });
      return false;
    }
    if (!selectedAccount) {
      setFieldError("selectedAccount");
      showToast({
        description: "Please select an account",
        type: "warning",
      });
      return false;
    }
    if (selectedAccount) {
      const accountUsedForTransaction: UserAccount | undefined =
        userDetails.userAccounts.find(
          (account: UserAccount) => account.accountId === selectedAccount
        );
      if (
        accountUsedForTransaction &&
        accountUsedForTransaction.accountBalance < paymentAmount
      ) {
        setFieldError("paymentAmount");
        showToast({
          description: `Insufficient balance (${formatToRupees(accountUsedForTransaction.accountBalance)}) in the selected account. Please select another account.`,
          type: "warning",
        });
        return false;
      }
    }
    return true;
  };

  const updateAccountUsedForTransaction = (
    response: Transaction,
    isEdit?: boolean,
    oldTransactionDetails?: Transaction
  ) => {
    const accountUsedForTransaction: UserAccount | undefined =
      userDetails.userAccounts.find(
        (account: UserAccount) => account.accountId === response.accountId
      );
    const oldAccountUsedForTransaction: UserAccount | undefined =
      userDetails.userAccounts.find(
        (account: UserAccount) =>
          account.accountId === oldTransactionDetails?.accountId
      );

    if (isEdit && accountUsedForTransaction && oldAccountUsedForTransaction) {
      if (
        accountUsedForTransaction.accountId ===
        oldAccountUsedForTransaction.accountId
      ) {
        const updatedAccount = {
          ...accountUsedForTransaction,
          accountBalance:
            accountUsedForTransaction.accountBalance +
            (oldTransactionDetails?.transactionAmount || 0) -
            response.transactionAmount,
        };
        dispatch(updateUserAccountDetails(updatedAccount));
      } else {
        const oldAccountUpdated = {
          ...oldAccountUsedForTransaction,
          accountBalance:
            oldAccountUsedForTransaction.accountBalance +
            (oldTransactionDetails?.transactionAmount || 0),
        };
        const newAccountUpdated = {
          ...accountUsedForTransaction,
          accountBalance:
            accountUsedForTransaction.accountBalance -
            response.transactionAmount,
        };
        dispatch(updateUserAccountDetails(oldAccountUpdated));
        dispatch(updateUserAccountDetails(newAccountUpdated));
      }
    } else if (accountUsedForTransaction) {
      const updatedAccount = {
        ...accountUsedForTransaction,
        accountBalance:
          accountUsedForTransaction.accountBalance - response.transactionAmount,
      };
      dispatch(updateUserAccountDetails(updatedAccount));
    }
  };

  const handleCreateExpense = async (isEdit?: boolean) => {
    if (!validate()) return;
    const date = mergeDateAndTimeToIST(paymentDate, paymentTime);
    const payLoad = {
      userId: userDetails.userId,
      transactionDate: date,
      transactionAmount:
        typeof paymentAmount === "string"
          ? parseInt(paymentAmount)
          : paymentAmount || 0,
      transactionCategory: selectedCategory,
      transactionDescription: description,
      accountId: selectedAccount,
      transactionType: "DEBIT",
      accountIdToWhichMoneyTransferred: "",
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
          await apiService.post(`/transaction/create`, payLoad);
      showToast({
        description: isEdit
          ? "Expense updated successfully."
          : "Expense added successfully.",
        type: "success",
      });
      setIsLoading(false);
      dispatch(isEdit ? updateTransaction(response) : addTransaction(response));
      updateAccountUsedForTransaction(response, isEdit, transactionDetails);
    } catch (err: any) {
      showToast({
        description:
          err.response?.data?.message ||
          "An error occurred while adding transaction",
        type: "error",
      });
      setIsLoading(false);
      console.log(err);
    } finally {
      // handleCancel();
      isEdit && onClose && onClose();
    }
  };

  return (
    <VStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      backgroundColor={"brand.100"}
      borderRadius={isEdit ? "0" : "24px"}
      p={isEdit ? "24px" : ["24px", "32px"]}
      gap={["16px", "24px"]}
      mb={[!isEdit ? "12" : "0", "0px"]}
      //   border={"1px solid black"}
    >
      {!isEdit && (
        <Text
          fontSize={["custom-md", "custom-lg"]}
          fontWeight={"semibold"}
          width={"100%"}
        >
          Create New Expense
        </Text>
      )}
      <HStack
        width={"100%"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        gap={"12px"}
      >
        <CustomInputField
          type={"date"}
          fieldTitle={"Payment Date"}
          placeholder={""}
          onChange={(date: string) => {
            if (fieldError === "paymentDate") setFieldError("");
            setPaymentDate(date);
          }}
          value={paymentDate.split("T")[0]}
          isCreation={true}
          fieldError={fieldError === "paymentDate"}
        />
        <CustomInputField
          type={"time"}
          fieldTitle={"Payment Time"}
          placeholder={""}
          onChange={(date: string) => {
            if (fieldError === "paymentTime") setFieldError("");
            setPaymentTime(date);
          }}
          value={paymentTime.split("T")[0]}
          isCreation={true}
          fieldError={fieldError === "paymentTime"}
        />
      </HStack>
      <CustomInputField
        type={"number"}
        fieldTitle={"Amount(INR)"}
        placeholder={"0"}
        onChange={(amount: number) => {
          if (fieldError === "paymentAmount") setFieldError("");
          setPaymentAmount(amount);
        }}
        value={paymentAmount ? paymentAmount.toString() : ""}
        isCreation={true}
        fieldError={fieldError === "paymentAmount"}
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
          color={fieldError === "selectedCategory" ? "red" : "black"}
        >
          Select Category
        </Text>
        <HStack
          width={"100%"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          flexWrap={"wrap"}
          overflowX={"hidden"}
        >
          {categories.map((category) => (
            <HStack
              key={category}
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
                if (fieldError === "selectedCategory") setFieldError("");
                setSelectedCategory(
                  selectedCategory === category ? "" : category
                );
              }}
              width={["", "136px"]}
              justifyContent={"center"}
              alignItems={"center"}
              gap={"4px"}
              margin={["0", "4px"]}
              ml={"0"}
            >
              {selectedCategory === category && (
                <TickCircle
                  size={isMobile ? 10 : 14}
                  color={"black"}
                  variant="Bold"
                />
              )}
              <Text fontSize={["custom-xs", "custom-sm"]} fontWeight={"medium"}>
                {convertFirstLetterToCapital(category)}
              </Text>
            </HStack>
          ))}
        </HStack>
      </VStack>
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
          Select Account
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
                    setSelectedAccount(
                      selectedAccount === account.accountId
                        ? ""
                        : account.accountId
                    );
                  }}
                  width={["", "220px"]}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={"4px"}
                  margin={["0", "4px"]}
                  ml={"0"}
                >
                  {selectedAccount === account.accountId && (
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
      <HStack
        width={"100%"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap={["12px", "24px"]}
        pt={"12px"}
      >
        <Button
          variant={"outline"}
          borderRadius={"12px"}
          width={["100px", "140px"]}
          size={["sm", "md"]}
          fontSize={["custom-sm", "custom-md"]}
          onClick={isEdit ? onClose : handleCancel}
        >
          Cancel
        </Button>
        <Button
          width={["100px", "140px"]}
          borderRadius={"12px"}
          onClick={() => handleCreateExpense(isEdit)}
          size={["sm", "md"]}
          fontSize={["custom-sm", "custom-md"]}
        >
          {isLoading ? (
            <ThreeDots color={"white"} width={"32px"} height={"32px"} />
          ) : isEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </HStack>
    </VStack>
  );
};

export default CreateNewExpense;
