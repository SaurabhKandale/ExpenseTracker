import { Box, Button, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import CustomInputField from "../Common/CustomInputField";
import { Link, useNavigate } from "react-router-dom";
import UserSignUp from "./UserSignUp";
import { ThreeDots } from "react-loader-spinner";
import useToastHook from "../../Hooks/useToastHook";
import { apiService } from "../../Api/apiService";
import useIsMobileHook from "../../Hooks/useIsMobileHook";
import axios from "axios";

interface UserLoginProps {
  isSignUp?: boolean;
}

const UserLogin: FunctionComponent<UserLoginProps> = ({ isSignUp }) => {
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPassword, setUserPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToastHook();
  const navigate = useNavigate();

  const handleEmailUpdate = (email: string) => {
    setUserEmail(email);
  };
  const handlePasswordUpdate = (password: string) => {
    setUserPassword(password);
  };
  const isMobile = useIsMobileHook();

  const handleLoginFunction = async () => {
    setIsLoading(true);
    try {
      const response: any = await axios.post(
        "http://localhost:8082/auth/login",
        {
          email: userEmail.toLowerCase(),
          password: userPassword,
        }
      );
      console.log(response);
      localStorage.setItem("token", response.data.token);
      navigate("/app/profile");
    } catch (err: any) {
      showToast({
        description:
          err.response?.data?.message || "An error occurred while signing in",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack width={"100vw"} height={"100vh"} p={"0"} m={"0"}>
      <HStack
        width={"100%"}
        m={"0"}
        height={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
        display={"flex"}
        flexDir={["column", "row"]}
      >
        {!isMobile && (
          <VStack flex={"1"} height={"100%"}>
            <Image
              src="/loginImage.png"
              height={"100%"}
              width={"100%"}
              objectFit={"cover"}
            />
          </VStack>
        )}
        <VStack
          flex={"1"}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
          backgroundImage={isMobile ? `url(/loginImage.png)` : ""}
          backgroundPosition={"center"}
          backgroundSize={"cover"}
          backgroundRepeat={"no-repeat"}
          width={"100%"}
        >
          {isSignUp ? (
            <UserSignUp />
          ) : (
            <VStack
              py={["64px", "88px"]}
              gap={["16px", "28px"]}
              width={["90%", "65%"]}
              borderRadius={"36px"}
              px={["32px", "68px"]}
              justifyContent={"center"}
              alignItems={"center"}
              shadow={"2xl"}
              boxShadow={"16px 16px 88px 12px rgba(0, 0, 0, 0.2)"}
              backgroundColor={"white"}
            >
              <CustomInputField
                placeholder={"User Email"}
                onChange={handleEmailUpdate}
                value={userEmail}
                fieldTitle={"Enter Email"}
              />
              <CustomInputField
                placeholder="User Password"
                value={userPassword}
                onChange={handlePasswordUpdate}
                fieldTitle="Enter Password"
                type="password"
              />
              <HStack width={"100%"} px={"32px"} justifyContent={"center"}>
                <Button
                  variant={"solid"}
                  size={["md", "xl"]}
                  px={["22px", "44px"]}
                  fontSize={["custom-sm", "custom-md"]}
                  borderRadius={"12px"}
                  onClick={handleLoginFunction}
                >
                  {isLoading ? (
                    <ThreeDots color={"white"} width={"32px"} height={"32px"} />
                  ) : (
                    " Sign In"
                  )}
                </Button>
              </HStack>
              <Box
                height={"1px"}
                backgroundColor={"brand.900"}
                width={"100%"}
              />
              <HStack
                width={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
                gap={"4px"}
              >
                <Text fontSize={["custom-sm", "custom-md"]}>
                  Don't have an account?
                </Text>
                <Link to={"/signup"}>
                  <Text
                    fontSize={["custom-sm", "custom-md"]}
                    color={"link.700"}
                    fontWeight={"semibold"}
                    cursor={"pointer"}
                  >
                    Sign Up
                  </Text>
                </Link>
              </HStack>
            </VStack>
          )}
        </VStack>
      </HStack>
    </VStack>
  );
};

export default UserLogin;
