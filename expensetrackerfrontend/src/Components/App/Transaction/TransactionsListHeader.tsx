import { HStack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface TransactionsListHeaderProps {}

const TransactionsListHeader: FunctionComponent<
  TransactionsListHeaderProps
> = ({}) => {
  return (
    <HStack
      width={"100%"}
      display={"grid"}
      gridTemplateColumns={"0.7fr 1fr 1fr 1.2fr 0.8fr 2fr 1fr"}
      backgroundColor={"brand.200"}
      borderTopRadius={"16px"}
      color={"black"}
      gap={"0px"}
      justifyContent={"center"}
      borderBottom={"0.5px solid"}
      borderColor={'brand.600'}
    >
      <HStack
        p={"12px 12px 12px 12px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.600"}
        justifyContent={"center"}
      >
        <Text fontSize={'custom-lg'}>Time</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 12px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.600"}
        justifyContent={"center"}
      >
        <Text fontSize={'custom-lg'}>Amount</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 12px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.600"}
        justifyContent={"center"}
      >
        <Text fontSize={'custom-lg'}>Category</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 12px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.600"}
        justifyContent={"center"}
      >
        <Text fontSize={'custom-lg'}>Account</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 12px"}
        borderRight={"0.5px solid"}
        borderColor={"brand.600"}
        justifyContent={"center"}
      >
        <Text fontSize={'custom-lg'}>Type</Text>
      </HStack>
      <HStack
        p={"12px 12px 12px 12px"}
        borderColor={"brand.300"}
        justifyContent={"center"}
      >
        <Text fontSize={'custom-lg'}>Description</Text>
      </HStack>
    </HStack>
  );
};

export default TransactionsListHeader;
