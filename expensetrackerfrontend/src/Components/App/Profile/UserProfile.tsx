import { FunctionComponent, useEffect, useState } from "react";
import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import { useDispatchHook, useSelectorHook } from "../../../app/hooks";
import {
  removeUserAccountById,
  selectUserDetails,
} from "../../../Slices/UserSlice";
import { UserAccount, UserDetails } from "../../../types";
import PersonalInfoCard from "./PersonalInfoCard";
import { AddSquare, Logout } from "iconsax-react";
import AddNewAccountModal from "./AddNewAccountModal";
import AccountCard from "./AccountCard";
import useToastHook from "../../../Hooks/useToastHook";
import { apiService } from "../../../Api/apiService";
import ConfirmationModal from "../../Common/ConfirmationModal";
import AccountsListHeader from "./AccountsListHeader";
import RecurringExpensesList from "./RecurringExpenses/RecurringExpensesList";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import NoContent from "../../Common/NoContent";

interface UserProfileProps {}

const UserProfile: FunctionComponent<UserProfileProps> = () => {
  const userDetails: UserDetails = useSelectorHook(selectUserDetails);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const { showToast } = useToastHook();
  const dispatch = useDispatchHook();
  const [isRemoveLoading, setIsRemoveLoading] = useState<string>("");
  const [editableAccount, setEditableAccount] = useState<UserAccount | null>();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<string>("");
  const [isConfirmLogoutModalOpen, setIsConfirmLogoutModalOpen] =
    useState<boolean>(false);
  const isMobile = useIsMobileHook();
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleRemoveAccount = async (accountId: string) => {
    try {
      setIsRemoveLoading(accountId);
      //Spring Boot Backend
      // await apiService.delete(`/account/remove/${accountId}`);
      // Node JS Backend
      await apiService.put(`/account/remove/${accountId}`);
      dispatch(removeUserAccountById(accountId));
      setIsRemoveLoading("");
    } catch (err: any) {
      setIsRemoveLoading("");
      console.log(err);
    }
  };

  useEffect(() => {
    // window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (!userDetails || !userDetails.userId) {
    return <NoContent text="Something went wrong..." />;
  }

  console.log(userDetails);

  return (
    <VStack
      width={"100%"}
      height={"100%"}
      borderRadius={"24px"}
      overflowY={"auto"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      gap={"24px"}
      pb={["48px", "0px"]}
    >
      {(isAddModalOpen || editableAccount) && (
        <AddNewAccountModal
          userId={userDetails.userId}
          isOpen={isAddModalOpen || editableAccount !== null}
          onClose={
            editableAccount
              ? () => setEditableAccount(null)
              : () => setIsAddModalOpen(false)
          }
          isEdit={editableAccount ? true : false}
          accountDetails={editableAccount || undefined}
        />
      )}
      {(isConfirmModalOpen || isConfirmLogoutModalOpen) && (
        <ConfirmationModal
          title={isConfirmLogoutModalOpen ? "Logout" : "Remove Account"}
          text={
            isConfirmLogoutModalOpen
              ? "Are you sure you want to logout?"
              : "Are you sure you want to remove this account? All associated transactions will still be visible."
          }
          isOpen={isConfirmModalOpen.length > 0 || isConfirmLogoutModalOpen}
          onClose={() => {
            isConfirmLogoutModalOpen
              ? setIsConfirmLogoutModalOpen(false)
              : setIsConfirmModalOpen("");
          }}
          onConfirm={
            isConfirmModalOpen
              ? () => {
                  handleRemoveAccount(isConfirmModalOpen);
                  setIsConfirmModalOpen("");
                }
              : () => {
                  handleLogout();
                  setIsConfirmLogoutModalOpen(false);
                }
          }
        />
      )}
      <VStack
        width={"100%"}
        height={"100%"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        backgroundColor={"brand.100"}
        gap={["16px", "24px"]}
        borderRadius={"24px"}
        p={["24px", "32px"]}
      >
        <Text
          fontSize={["custom-lg", "custom-xl"]}
          fontWeight={"semibold"}
          width={"100%"}
        >
          Personal Information
        </Text>

        <PersonalInfoCard type={"Name"} value={userDetails.userDisplayName} />
        <PersonalInfoCard type="Email" value={userDetails.userEmail} />
        <HStack
          width={"100%"}
          justifyContent={"space-between"}
          gap={["16px", "32px"]}
        >
          <PersonalInfoCard type="Gender" value={userDetails.userGender} />
          <PersonalInfoCard type="Age" value={userDetails.userAge.toString()} />
        </HStack>
      </VStack>
      <VStack
        width={"100%"}
        height={"100%"}
        justifyContent={"flex-start"}
        alignItems={"flex-start"}
        backgroundColor={"brand.100"}
        gap={["12px", "12px"]}
        borderRadius={"24px"}
        p={["24px", "32px"]}
      >
        <HStack
          width={"100%"}
          justifyContent={"space-between"}
          alignItems={["flex-start", "center"]}
          gap={"32px"}
        >
          <VStack
            justifyContent={"flex-start"}
            alignItems={"flex-start"}
            gap={["2px", "4px"]}
          >
            <Text fontSize={["custom-lg", "custom-xl"]} fontWeight={"semibold"}>
              Account Information
            </Text>
            <Text fontSize={["custom-xs", "custom-sm"]}>
              You can have at most 5 accounts.
            </Text>
          </VStack>
          <HStack
            justifyContent={"center"}
            alignItems={"center"}
            backgroundColor={"brand.200"}
            p={["6px 10px", "8px 12px"]}
            borderRadius={"12px"}
            border={"1px solid transparent"}
            cursor={"pointer"}
            _hover={{
              borderColor: "brand.900",
              transition: "all 0.3s",
            }}
            onClick={() => {
              if (
                userDetails.userAccounts.filter(
                  (account) => account.accountStatus === "active"
                ).length >= 5
              ) {
                showToast({
                  description: "You can only add 5 accounts!",
                  type: "warning",
                });
                return;
              }
              setIsAddModalOpen(true);
            }}
          >
            <AddSquare size={isMobile ? "12px" : "14px"} color={"black"} />
            <Text fontSize={["custom-xs", "custom-sm"]} color={"black"}>
              Add new
            </Text>
          </HStack>
        </HStack>
        {userDetails?.userAccounts?.length > 0 && !isMobile && (
          <AccountsListHeader />
        )}
        {userDetails?.userAccounts?.length ? (
          userDetails.userAccounts
            .filter((account) => account.accountStatus === "active")
            .map(
              (account: UserAccount, index: number) =>
                account.accountStatus === "active" && (
                  <AccountCard
                    key={account.accountId}
                    accountName={account.accountName}
                    index={index + 1}
                    monthlyIncome={account.monthlyIncome}
                    accountId={account.accountId}
                    isLoading={account.accountId === isRemoveLoading}
                    accountBalance={account.accountBalance}
                    onRemoveClick={() => {
                      if (userDetails.userAccounts.length <= 1) {
                        showToast({
                          description: "You must have atleast one account!",
                          type: "warning",
                        });
                        return;
                      }
                      setIsConfirmModalOpen(account.accountId);
                    }}
                    onEditClick={() => {
                      setEditableAccount(account);
                    }}
                  />
                )
            )
        ) : (
          <Text fontSize={["sm", "md"]} color={"black"}>
            No Accounts Found!
          </Text>
        )}
      </VStack>
      <RecurringExpensesList
        recurringExpenses={userDetails?.userRecurringExpenses || []}
        userDetails={userDetails}
      />
      {isMobile && (
        <VStack width="100%" alignItems={"flex-start"}>
          <Button
            borderRadius={"12px"}
            size={"md"}
            width={"100%"}
            cursor={"pointer"}
            fontSize={"sm"}
            color={"red.500"}
            onClick={() => {
              setIsConfirmLogoutModalOpen(true);
            }}
          >
            {isLoggingOut ? (
              <ThreeDots />
            ) : (
              <>
                <Logout size={"12px"} color={"red"} />
                Logout
              </>
            )}
          </Button>
        </VStack>
      )}
    </VStack>
  );
};

export default UserProfile;
