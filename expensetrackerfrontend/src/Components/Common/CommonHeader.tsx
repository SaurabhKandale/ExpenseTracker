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
    </HStack>
  );
};

export default CommonHeader;
