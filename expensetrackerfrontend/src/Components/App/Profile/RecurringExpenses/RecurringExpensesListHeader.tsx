import { HStack, Text } from "@chakra-ui/react";
import { InfoCircle } from "iconsax-react";
import { FunctionComponent } from "react";
import { Tooltip } from "../../../ui/tooltip";

interface RecurringExpensesListHeaderProps {}

const RecurringExpensesListHeader: FunctionComponent<
  RecurringExpensesListHeaderProps
> = ({}) => {
  return (
    <HStack
      width={"100%"}
      display={"grid"}
      gridTemplateColumns={"0.3fr 2fr 1fr 1.5fr 1fr 2.3fr"}
      backgroundColor={"brand.900"}
      borderRadius={"16px"}
      color={"white"}
      gap={"0px"}
    >
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-lg']}>No.</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-lg']}>Expense Title</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        gap={"6px "}
        height={"100%"}
      >
        <Text fontSize={['custom-lg']}> Amount</Text>
        {/* <Tooltip
          content={
            "This is the income you expect to receive in this account on the 1st of every month."
          }
          openDelay={100}
          closeDelay={100}
        >
          <InfoCircle color={"white"} size={"16px"} />
        </Tooltip> */}
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-lg']}> Account</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-lg']}> Category</Text>
      </HStack>

      <HStack
        p={"12px 12px 12px 32px"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-lg']}>Options</Text>
      </HStack>
    </HStack>
  );
};

export default RecurringExpensesListHeader;
