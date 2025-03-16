import { HStack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface IncomeTabsSectionSingleTabProps {
  tabName: string;
  isSelected: boolean;
  onClick: (str: string) => void;
}

const IncomeTabsSectionSingleTab: FunctionComponent<
  IncomeTabsSectionSingleTabProps
> = ({ tabName, onClick, isSelected }) => {
  return (
    <HStack
      p={"12px 32px"}
      borderRadius={"16px"}
      width={"50%"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={isSelected ? "brand.700" : "transparent"}
      transition={"all 0.3"}
      onClick={() => {
        onClick(tabName);
      }}
      cursor={"pointer"}
      fontWeight={600}
    >
      <Text fontSize={["sm", "md"]}>
        {tabName === "add" ? "Add Money" : "Transfer money"}
      </Text>
    </HStack>
  );
};

export default IncomeTabsSectionSingleTab;
