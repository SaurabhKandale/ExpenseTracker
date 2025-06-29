import { useEffect, useState } from "react";
import { HStack, Text, VStack } from "@chakra-ui/react";
import { apiService } from "../../Api/apiService";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatchHook, useSelectorHook } from "../../app/hooks";
import { UserDetails } from "../../types";
import { AppDispatch, RootState } from "../../app/store";
import { selectUserDetails, setUserDetails } from "../../Slices/UserSlice";
import useToastHook from "../../Hooks/useToastHook";
import {
  ClipboardText,
  Logout,
  MoneyRecive,
  MoneySend,
  User,
  WalletAdd,
  WalletMoney,
} from "iconsax-react";
import UserProfile from "./Profile/UserProfile";
import TabCard from "./AppCommon/TabCard";
import LogoutComponent from "./AppCommon/LogoutComponent";
import { InfinitySpin, Triangle } from "react-loader-spinner";
import CommonHeader from "../Common/CommonHeader";
import CreateNewExpense from "./Transaction/CreateExpense";
import Expenses from "./Transaction/Expenses";
import NoContent from "../Common/NoContent";
import IncomeTabsSection from "./Income/IncomeTabsSection";
import CreateFrequentExpense from "./Profile/RecurringExpenses/CreateRecurringExpense";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatchHook<AppDispatch>();
  const userDetails: UserDetails = useSelectorHook(selectUserDetails);
  const { showToast } = useToastHook();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [contendLoaded, setContentLoaded] = useState<boolean>(false);
  const isMobile = useIsMobileHook();

  const tabs = isMobile
    ? ["profile", "transactions", "add_expense", "add_income"]
    : [
        "profile",
        // "dashboard",
        "transactions",
        "add_expense",
        "add_income",
        "recurring_expense",
        "logout",
      ];

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    navigate("/app/" + tab);
  };

  const fetchUser = async () => {
    try {
      const response: any = await apiService.get("/user/me");
      const { username, password, ...restResponse } = response;
      dispatch(setUserDetails(restResponse as UserDetails));
    } catch (err) {
      navigate("/login");
      showToast({
        description: "An error occurred while fetching user details.",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  useEffect(() => {
    if (!contendLoaded) {
      fetchUser();
      setContentLoaded(true);
    }
    setActiveTab(params.tab || "profile");
  }, [params.tab]);

  if (isLoading) {
    return (
      <VStack
        width={"100vw"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundColor={"brand.100"}
      >
        <Triangle
          visible={true}
          height="180"
          width="180"
          color="#000"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </VStack>
    );
  }

  if (!userDetails || !userDetails.userId) {
    return (
      <VStack h={"100vh"} w={"100vw"}>
        <NoContent text="Something went wrong..." />
      </VStack>
    );
  }

  return (
    <HStack
      width={"100vw"}
      height={["auto", "100vh"]}
      p={"0"}
      margin={"0"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      flex={"100%"}
      gap={"48px"}
      display={"grid"}
      gridTemplateColumns={["1fr", "1fr 4fr"]}
      overflowY={"hidden"}
    >
      <VStack
        height={["auto", "100%"]}
        backgroundColor={"brand.100"}
        p={["0", "32px"]}
        gap={["0", "16px"]}
        position={["fixed", "initial"]}
        bottom={"0"}
        flexDir={["row", "column"]}
        width={["100%", "auto"]}
        overflowX={"auto"}
        zIndex={"10"}
        overflowY={["hidden", "hidden"]}
        shadow={["10px -4px 28px rgba(0, 0, 0, 0.1)", "none"]}
      >
        {tabs.map((tab) => (
          <TabCard
            key={tab}
            tabTitle={
              tab === "add_expense"
                ? "Add Expense"
                : tab === "add_income"
                  ? "Add Income"
                  : tab === "recurring_expense"
                    ? "Recurring Expense"
                    : `${tab.charAt(0).toUpperCase()}${tab.slice(1)}`
            }
            tabIcon={
              tab === "profile" ? (
                <User size={isMobile ? "16px" : "20px"} />
              ) : tab === "dashboard" ? (
                <ClipboardText size={isMobile ? "16px" : "20px"} />
              ) : tab === "transactions" ? (
                <WalletMoney size={isMobile ? "16px" : "20px"} />
              ) : tab === "add_expense" ? (
                <MoneySend size={isMobile ? "16px" : "20px"} />
              ) : tab === "add_income" ? (
                <MoneyRecive size={isMobile ? "16px" : "20px"} />
              ) : tab === "recurring_expense" ? (
                <WalletAdd size={isMobile ? "16px" : "20px"} />
              ) : (
                <Logout size={isMobile ? "16px" : "20px"} />
              )
            }
            isActive={activeTab === tab}
            onClick={() => handleTabChange(tab)}
          />
        ))}
      </VStack>
      <VStack
        height={"100%"}
        py={"32px"}
        pr={["16px", "32px"]}
        pl={["16px", "0px"]}
        overflowY={["auto", "hidden"]}
      >
        <CommonHeader title={userDetails.userDisplayName} />
        {params.tab === "profile" && <UserProfile />}
        {params.tab === "logout" && <LogoutComponent />}
        {params.tab === "add_expense" && (
          <CreateNewExpense userDetails={userDetails} />
        )}
        {params.tab === "transactions" && (
          <Expenses userDetails={userDetails} />
        )}
        {params.tab === "dashboard" && <NoContent text="Launcing Soon..." />}
        {params.tab === "add_income" && <IncomeTabsSection />}
        {params.tab === "recurring_expense" && <CreateFrequentExpense />}
      </VStack>
    </HStack>
  );
}

export default App;
