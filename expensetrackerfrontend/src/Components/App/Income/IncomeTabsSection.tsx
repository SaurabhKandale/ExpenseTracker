import { HStack, VStack, Text } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import IncomeTabsSectionSingleTab from "./IncomeTabsSectionSingleTab";
import AddMoneyToAccount from "./AddMoneyToAccount";
import TransferMoneyFromAccount from "./TransferMoneyFromAccount";

interface IncomeTabsSectionProps {}

const IncomeTabsSection: FunctionComponent<IncomeTabsSectionProps> = ({}) => {
  const [isSelected, setIsSelected] = useState<String>("add");

  return (
    <VStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      gap={"24px"}
    >
      <HStack
        // p={"24px 32px"}
        width={"100%"}
        borderRadius={"20px"}
        justifyContent={"flex-start"}
        alignItems={"center"}
        backgroundColor={"brand.800"}
        p={"4px"}
        color={"white"}
      >
        <IncomeTabsSectionSingleTab
          tabName="add"
          onClick={(str: string) => setIsSelected(str)}
          isSelected={isSelected === "add"}
        />
        <IncomeTabsSectionSingleTab
          tabName="transfer"
          onClick={(str: string) => setIsSelected(str)}
          isSelected={isSelected === "transfer"}
        />
      </HStack>
      {isSelected === "add" ? (
        <AddMoneyToAccount />
      ) : (
        <TransferMoneyFromAccount />
      )}
    </VStack>
  );
};

export default IncomeTabsSection;
