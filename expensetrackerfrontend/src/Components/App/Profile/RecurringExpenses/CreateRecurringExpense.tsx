import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import CustomInputField from "../../../Common/CustomInputField";
import { TickCircle } from "iconsax-react";
import { convertFirstLetterToCapital } from "../../../../utils";
import { useDispatchHook, useSelectorHook } from "../../../../app/hooks";
import {
  addRecurringExpenseToUserDetails,
  selectUserDetails,
  updateRecurringExpenseDetails,
} from "../../../../Slices/UserSlice";
import { RecurringExpense, UserAccount } from "../../../../types";
import CustomNumberInputField from "../../../Common/CustomNumberInputField";
import { ThreeDots } from "react-loader-spinner";
import useToastHook from "../../../../Hooks/useToastHook";
import { apiService } from "../../../../Api/apiService";
import useIsMobileHook from "../../../../Hooks/useIsMobileHook";

interface CreateRecurringExpenseProps {
  isEdit?: boolean;
  recurringExpenseDetails?: RecurringExpense;
  onclose?: () => void;
}

const CreateRecurringExpense: FunctionComponent<CreateRecurringExpenseProps> = ({
  isEdit,
  recurringExpenseDetails,
  onclose,
}) => {
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
    recurringExpenseDetails ? recurringExpenseDetails.recurringExpenseCategory : ""
  );
  const [expenseTitle, setExpenseTitle] = useState<string>(
    recurringExpenseDetails ? recurringExpenseDetails.recurringExpenseTitle : ""
  );
  const [fieldError, setFieldError] = useState<string>("");
  const userDetails = useSelectorHook(selectUserDetails);
  const [selectedAccount, setSelectedAccount] = useState<string>(
    recurringExpenseDetails?.recurringExpenseAccountId || ""
  );
  const [amount, setAmount] = useState<number | undefined>(
    recurringExpenseDetails?.recurringExpenseAmount || undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToastHook();
  const dispatch = useDispatchHook();
  const isMobile = useIsMobileHook();


  const validate = () => {
    if (!expenseTitle.trim().length) {
      setFieldError("expenseTitle");
      showToast({
        description: "Expense title cannot be empty",
        type: "error",
      });
      return false;
    }
    if (!amount) {
      setFieldError("amount");
      showToast({
        description: "Amount cannot be empty",
        type: "error",
      });
      return false;
    }
    if (!selectedCategory) {
      setFieldError("selectedCategory");
      showToast({
        description: "Select a category",
        type: "error",
      });
      return false;
    }
    if (!selectedAccount) {
      setFieldError("selectedAccount");
      showToast({
        description: "Select an account",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleCreateExpense = async (isEdit: boolean) => {
    if (userDetails.userRecurringExpenses.length >= 10) {
      showToast({
        description: "You can only have 10 recurring expenses.",
        type: "warning",
      });
      return;
    }

    if (!validate()) return;

    const payload = {
      recurringExpenseTitle: expenseTitle,
      recurringExpenseAmount: amount,
      recurringExpenseCategory: selectedCategory,
      recurringExpenseAccountId: selectedAccount,
    };

    setIsLoading(true);
    try {
      const response: any = isEdit
        // ? await apiService.put("/recurringExpense/update", {
        ? await apiService.put(`/recurringExpense/update/${recurringExpenseDetails?.recurringExpenseId}`, {
            ...payload,
            recurringExpenseId: recurringExpenseDetails?.recurringExpenseId,
            userId: userDetails.userId,
          })
        // : await apiService.post("/recurringExpense/add", {
        :await apiService.post("/recurringExpense/create", {
            ...payload,
            recurringExpenseUserId: userDetails.userId,
          });
      showToast({
        description: isEdit
          ? "Expense updated successfully."
          : "Recurring expense created successfully.",
        type: "success",
      });
      setIsLoading(false);
      if (isEdit) {
        dispatch(updateRecurringExpenseDetails(response));
      } else {
        dispatch(addRecurringExpenseToUserDetails(response));
      }
      handleCancel();
      isEdit && onclose && onclose();
    } catch (err: any) {
      setIsLoading(false);
      showToast({
        description:
          err.response?.data?.message ||
          "An error occurred while creating recurring expense.",
        type: "error",
      });
    }
  };

  const handleCancel = () => {
    setExpenseTitle("");
    setAmount(undefined);
    setSelectedCategory("");
    setSelectedAccount("");
  };

  return (
    <VStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      backgroundColor={"brand.100"}
      borderRadius={isEdit ? "0" : "24px"}
      p={["24px","32px"]}
      gap={["16px","24px"]}
      mb={[!isEdit ? "64px" : "0", "0px"]}
      //   border={"1px solid black"}
    >
      {!isEdit && (
        <Text fontSize={["custom-md", "custom-lg"]} fontWeight={"semibold"} width={"100%"}>
          Create new recurring expense
        </Text>
      )}
      <CustomInputField
        fieldTitle="Expense title"
        placeholder={"Expense title"}
        onChange={(str: string) => {
          if (str.length > 30) {
            showToast({
              description: "Expense title cannot be more than 30 characters.",
              type: "warning",
            });
            return;
          }
          if (fieldError === "expenseTitle") setFieldError("");
          setExpenseTitle(str);
        }}
        value={expenseTitle}
        isCreation={true}
        maxLimit={30}
        fieldError={fieldError === "expenseTitle"}
      />
      <CustomNumberInputField
        placeholder={"Expense amount"}
        onChange={function (str: number): void {
          if (fieldError === "amount") setFieldError("");
          setAmount(isNaN(str) ? undefined : str);
        }}
        value={amount}
        fieldTitle="Expense amount"
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
          color={fieldError === "selectedCategory" ? "red" : "black"}
        >
          Select category
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
              padding={["6px 18px", "8px 16px"]}
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
          Select account
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
                  <Text fontSize={["custom-xs", "custom-sm"]} fontWeight={"medium"}>
                    {convertFirstLetterToCapital(account.accountName)}
                  </Text>
                </HStack>
              )
          )}
        </HStack>
      </VStack>
      <HStack
        width={"100%"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap={["10px", "16px"]}
        pt={"12px"}
      >
        <Button
          variant={"outline"}
          borderRadius={"12px"}
          width={"120px"}
          onClick={handleCancel}
          size={["sm", "md"]}
          fontSize={["custom-xs", "custom-sm"]}
        >
          Cancel
        </Button>
        <Button
          width={"120px"}
          borderRadius={"12px"}
          size={["sm", "md"]}
          fontSize={["custom-xs", "custom-sm"]}
          onClick={() => handleCreateExpense(isEdit || false)}
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

export default CreateRecurringExpense;
