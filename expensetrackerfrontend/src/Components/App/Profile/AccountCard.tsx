import { Button, HStack, Text, GridItem } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { convertFirstLetterToCapital, formatToRupees } from "../../../utils";
import { ThreeDots } from "react-loader-spinner";
import useIsMobileHook from "../../../Hooks/useIsMobileHook";

interface AccountCardProps {
  index: number;
  accountId: string;
  accountName: string;
  monthlyIncome: number;
  isLoading?: boolean;
  onRemoveClick: () => void;
  onEditClick: () => void;
  accountBalance: number;
}

const AccountCard: FunctionComponent<AccountCardProps> = ({
  index,
  accountName,
  monthlyIncome,
  accountId,
  isLoading,
  onRemoveClick,
  onEditClick,
  accountBalance,
}) => {
  const isMobile = useIsMobileHook();

  return (
    <HStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      backgroundColor={"brand.200"}
      p={["20px","16px"]}
      borderRadius={"16px"}
      display={"grid"}
      gridTemplateColumns={[
        "1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr",
        "0.3fr 2fr 1.5fr 2fr 2fr",
      ]}
      gridTemplateRows={isMobile ? "1fr 1fr 1fr" : "1fr"}
      spaceY={["16px", "0px"]}
      gap={[0, "12px"]}
      pt={["0px", "16px"]}
    >
      <GridItem
        colSpan={1}
        mt={["16px", "0"]}
        alignItems={"flex-start"}
        pl={["6px", "28px"]}
      >
        <Text fontSize={["custom-md", "custom-lg"]}>{index}.</Text>
      </GridItem>
      <GridItem colSpan={[7, 1]} alignItems={"flex-start"} pl={["6px", "32px"]}>
        <Text fontSize={["custom-md", "custom-lg"]} fontWeight={'normal'} ml={["-18px", 0]}>
          {convertFirstLetterToCapital(accountName)}
        </Text>
      </GridItem>
      <GridItem
        colSpan={[8, 1]}
        alignItems={["center", "flex-start"]}
        display={"flex"}
        pl={["6px", "32px"]}
        spaceX={["6px", ""]}
      >
        {isMobile && (
          <Text fontSize={["custom-md", "custom-lg"]} width={"45%"}>
            Monthly Income :{" "}
          </Text>
        )}
        <Text fontWeight={'normal'} fontSize={["custom-md", "custom-lg"]}>
          {formatToRupees(monthlyIncome)}
        </Text>
      </GridItem>
      <GridItem
        colSpan={[8, 1]}
        alignItems={["center", "flex-start"]}
        display={"flex"}
        pl={["6px", "32px"]}
        spaceX={["6px", ""]}
      >
        {isMobile && (
          <Text fontSize={["custom-md", "custom-lg"]} width={"45%"}>
            Acc Balance :{" "}
          </Text>
        )}
        <Text fontWeight={'normal'} fontSize={["custom-md", "custom-lg"]}>
          {formatToRupees(accountBalance)}
        </Text>
      </GridItem>
      <GridItem
        alignItems={"flex-start"}
        justifyContent={"flex-start"}
        // gap={"12px"}
        spaceX={"12px"}
        pl={["6px", "32px"]}
        colSpan={[7, 1]}
      >
        <Button
          variant={"outline"}
          size={["xs", "sm"]}
          width={["80px","90px"]}
          borderRadius={"12px"}
          borderColor={"brand.500"}
          cursor={"pointer"}
          onClick={onEditClick}
          fontSize={["xs", "custom-sm"]}
        >
          Edit
        </Button>
        <Button
          variant={"solid"}
          size={["xs", "sm"]}
          width={["80px","90px"]}
          borderRadius={"12px"}
          cursor={"pointer"}
          backgroundColor={"red.200"}
          borderColor={"red.700"}
          color={"red"}
          transition={"all 0.3s"}
          _hover={{ backgroundColor: "red.500", color: "white" }}
          onClick={onRemoveClick}
          fontSize={["xs", "custom-sm"]}
        >
          {isLoading ? (
            <ThreeDots color={"red"} height={"32px"} width={"32px"} />
          ) : (
            "Remove"
          )}
        </Button>
      </GridItem>
    </HStack>
  );
};

export default AccountCard;
