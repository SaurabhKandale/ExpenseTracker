import { VStack, Text, HStack, Button } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";

interface LogoutModalProps {}

const LogoutComponent: FunctionComponent<LogoutModalProps> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    // handle logout
    setIsLoading(true);
    try {
      await localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack
      width={"100%"}
      backgroundColor={"brand.100"}
      borderRadius={"24px"}
      minH={"500px"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      p={"32px"}
      gap={"24px"}
    >
      <Text fontSize={['custom-md','custom-lg']} fontWeight={"semibold"}>
        Logout
      </Text>
      <Text color={"brand.700"} fontSize={['custom-md',"custom-lg"]}>
        Are you sure you want to logout?
      </Text>
      <HStack>
        <Button borderRadius={"12px"} p={"12px 16px"} onClick={handleLogout} fontSize={['custom-sm','custom-md']}>
          {isLoading ? (
            <ThreeDots color={"white"} height={"32px"} width={"32px"} />
          ) : (
            "Yes, Logout"
          )}
        </Button>
      </HStack>
    </VStack>
  );
};

export default LogoutComponent;
