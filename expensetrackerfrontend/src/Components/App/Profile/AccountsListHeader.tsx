import { HStack, Text } from "@chakra-ui/react";
import { InfoCircle } from "iconsax-react";
import { FunctionComponent } from "react";
import { Tooltip } from "../../ui/tooltip";

interface AccountsListHeaderProps {}

const AccountsListHeader: FunctionComponent<AccountsListHeaderProps> = () => {
  return (
    <HStack
      width={"100%"}
      display={"grid"}
      gridTemplateColumns={"0.3fr 2fr 1.5fr 2fr 2fr"}
      backgroundColor={"brand.900"}
      borderRadius={"16px"}
      color={"white"}
      gap={"0px"}
      mt={"12px"}
      // mb={"-12px"}
    >
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-sm','custom-lg']}>No.</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-sm','custom-lg']}>Account Name</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        gap={"6px "}
        height={"100%"}
      >
        <Text fontSize={['custom-sm','custom-lg']}>Monthly Income</Text>
        <Tooltip
          content={
            "This is the income you expect to receive in this account on the 1st of every month."
          }
          openDelay={100}
          closeDelay={100}
        >
          <InfoCircle color={"white"} size={"16px"} />
        </Tooltip>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-sm','custom-lg']}>Current Account Balance</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 32px"}
        borderColor={"brand.300"}
        height={"100%"}
      >
        <Text fontSize={['custom-sm','custom-lg']}>Options</Text>
      </HStack>
    </HStack>
  );
};

export default AccountsListHeader;
