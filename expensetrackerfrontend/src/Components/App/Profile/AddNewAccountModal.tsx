import { Button, HStack, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import {
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogHeader,
} from "../../ui/dialog";
import { CloseCircle } from "iconsax-react";
import CustomInputField from "../../Common/CustomInputField";
import useToastHook from "../../../Hooks/useToastHook";
import { apiService } from "../../../Api/apiService";
import { ThreeDots } from "react-loader-spinner";
import { useDispatchHook } from "../../../app/hooks";
import {
  addUserAccountToUserDetails,
  updateUserAccountDetails,
} from "../../../Slices/UserSlice";
import { UserAccount } from "../../../types";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface AddNewAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  isEdit?: boolean;
  accountDetails?: UserAccount;
}

const AddNewAccountModal: FunctionComponent<AddNewAccountModalProps> = ({
  isOpen,
  onClose,
  userId,
  isEdit,
  accountDetails,
}) => {
  const [accountName, setAccountName] = useState<string>(
    isEdit ? accountDetails?.accountName || "" : ""
  );
  const [monthlyIncome, setMonthlyIncome] = useState<number | undefined>(
    isEdit ? accountDetails?.monthlyIncome || 0 : undefined
  );
  const [fieldError, setFieldError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToastHook();
  const dispatch = useDispatchHook();
  const isMobile = useIsMobileHook();

  const validate = () => {
    if (accountName.trim().length < 1) {
      setFieldError("accountName");
      showToast({
        description: "Account name cannot be empty",
        type: "error",
      });
      return false;
    }
    if (!monthlyIncome) {
      setFieldError("monthlyIncome");
      showToast({
        description: "Monthly income cannot be empty",
        type: "error",
      });
      return false;
    }
    return true;
  };

  const handleAddAccount = async () => {
    if (validate()) {
      try {
        setIsLoading(true);

        const accountResponse: any = await apiService.post("/account/add", {
          accountName,
          monthlyIncome,
          userId: userId,
        });
        showToast({
          description: "Account added successfully",
          type: "success",
        });
        setIsLoading(false);
        dispatch(addUserAccountToUserDetails(accountResponse));
        onClose();
      } catch (err: any) {
        showToast({
          description:
            err.response?.data?.message ||
            "An error occurred while adding account",
          type: "error",
        });
        setIsLoading(false);
      }
    }
  };

  const handleEditAccount = async () => {
    if (validate()) {
      try {
        setIsLoading(true);

        const accountResponse: any = await apiService.put(`/account/update`, {
          accountName: accountName,
          monthlyIncome: monthlyIncome,
          accountId: accountDetails?.accountId,
          userId: accountDetails?.userId,
          accountBalance: accountDetails?.accountBalance,
        });

        showToast({
          description: "Account updated successfully",
          type: "success",
        });
        setIsLoading(false);
        dispatch(updateUserAccountDetails(accountResponse));
        onClose();
      } catch (err: any) {
        showToast({
          description:
            err.response?.data?.message ||
            "An error occurred while updating account",
          type: "error",
        });
        setIsLoading(false);
      }
    }
  };

  return (
    // <VStack alignItems="start">
    <DialogRoot open={isOpen} onOpenChange={onClose} size="lg" placement={['center','top']}>
      {
        //@ts-ignore
        <DialogContent>
          <DialogHeader borderBottom={"1px solid black"}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              {/* <DialogTitle>Prepare Chakra V3</DialogTitle> */}
              <Text fontSize={["custom-md", "custom-lg"]} fontWeight={"semibold"}>
                {isEdit ? "Edit Account" : "Add New Account"}
              </Text>
              <CloseCircle
                color={"#000"}
                size={isMobile ? 18 : 20}
                onClick={onClose}
                cursor={"pointer"}
              />
            </HStack>
          </DialogHeader>
          <DialogBody>
            <VStack
              py={"24px"}
              gap={["16px","28px"]}
              justifyContent={"flex-start"}
              alignItems={"flex-start"}
            >
              <CustomInputField
                fieldTitle="Account Name"
                placeholder={"Account name"}
                onChange={(str: string) => {
                  setAccountName(str);
                  if (fieldError === "accountName") {
                    setFieldError("");
                  }
                }}
                value={accountName}
                type="text"
                fieldError={fieldError === "accountName"}
              />
              <CustomInputField
                placeholder={"Monthly income for the account (in INR)"}
                fieldTitle="Monthly Income for the Account (in INR)"
                onChange={(str: number) => {
                  setMonthlyIncome(str);
                  if (fieldError === "monthlyIncome") {
                    setFieldError("");
                  }
                }}
                value={monthlyIncome?.toString() || ""}
                type="number"
                fieldError={fieldError === "monthlyIncome"}
              />
              <Text fontSize={["custom-xs", "custom-sm"]} mt={"-10px"}>
                {
                  //text for balance will be updated next month onwards
                  "If you change the monthly income for this account, the updated income will be added next month onwards. If you want to add money instantly, use Add Income tab."
                }
              </Text>
              <HStack
                width={"100%"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                gap={"12px"}
                mt={"12px"}
              >
                <Button
                  colorScheme={"red"}
                  onClick={onClose}
                  variant={"outline"}
                  borderRadius={"12px"}
                  width={["100px","120px"]}
                  size={["sm", "md"]}
                  fontSize={["custom-xs", "custom-sm"]}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme={""}
                  width={["100px","120px"]}
                  borderRadius={"12px"}
                  onClick={isEdit ? handleEditAccount : handleAddAccount}
                  size={["sm", "md"]}
                  fontSize={["custom-xs", "custom-sm"]}
                >
                  {isLoading ? (
                    <ThreeDots color={"white"} width={"32px"} height={"32px"} />
                  ) : isEdit ? (
                    "Submit"
                  ) : (
                    "Add Account"
                  )}
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      }
    </DialogRoot>
    // </VStack>
  );
};

export default AddNewAccountModal;
