import { HStack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
}

const CommonHeader: FunctionComponent<CommonHeaderProps> = ({
  title,
  subtitle,
}) => {
  return (
    <HStack
      width={"100%"}
      backgroundColor={"brand.900"}
      borderRadius={"16px"}
      p={["12px 24px", "12px 32px"]}
      mb={"12px"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <Text fontSize={["custom-md", "custom-lg"]} fontWeight={"semibold"} color={"white"}>
        {"Hi, " + title}
      </Text>
      {/* <HStack borderRadius={"12px"}>
        <Button
          borderRadius={"12px"}
          border={"1px solid green"}
          backgroundColor={"green.200"}
          color={"green"}
          transition={"all 0.3s"}
          _hover={{
            backgroundColor: "green.500",
            color: "white",
          }}
          size={["sm", "md"]}
        >
          <WalletAdd />
          Logout
        </Button>
      </HStack> */}
    </HStack>
  );
};

export default CommonHeader;
