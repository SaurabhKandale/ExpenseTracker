import { HStack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface TabCardProps {
  tabTitle: string;
  tabIcon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

const TabCard: FunctionComponent<TabCardProps> = ({
  tabTitle,
  tabIcon,
  isActive,
  onClick,
}) => {
  const isMobile = useIsMobileHook();

  return (
    <HStack
      width={"100%"}
      p={["9px 6px", "24px 32px"]}
      backgroundColor={isActive ? "white" : "brand.200"}
      color={"black"}
      borderRadius={["0", "16px"]}
      justifyContent={"flex-start"}
      alignItems={"center"}
      cursor={"pointer"}
      onClick={onClick}
      gap={["6px", "12px"]}
      transition={"all 0.3s"}
      border={["none", "1px solid transparent"]}
      borderBottom={['2px solid',"1px solid"]}
      borderColor={[isActive ? "brand.900" : "transparent", isActive ? "brand.900" : "transparent"]}
      _hover={{
        backgroundColor: isActive ? "white" : "brand.300",
      }}
      flexDir={isMobile ? "column" : "row"}
    >
      {tabIcon}
      <Text fontSize={["xs", "custom-lg"]} fontWeight={["normal", "semibold"]}>
        {tabTitle}
      </Text>
    </HStack>
  );
};

export default TabCard;
