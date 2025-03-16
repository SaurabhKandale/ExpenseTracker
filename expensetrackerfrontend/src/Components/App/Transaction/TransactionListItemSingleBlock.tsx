import { Box, GridItem } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface TransactionListItemSingleBlockProps {
  isLast?: boolean;
  isLastRight?: boolean;
  children: React.ReactNode;
}

const TransactionListItemSingleBlock: FunctionComponent<
  TransactionListItemSingleBlockProps
> = ({ isLast, isLastRight, children }) => {
  return (
    <GridItem
      p={["6px 12px 8px 16px", "16px 12px 12px 12px"]}
      borderRightWidth={["none", isLastRight ? "0" : "0.5px"]}
      borderBottomWidth={["0", isLast ? "0" : "0.5px"]}
      borderColor={"brand.600"}
      display={"flex"}
      justifyContent={["flex-start", "center"]}
      gap={"14px"}
      height={"100%"}
      colSpan={[2, 1]}
      alignItems={["center", "center"]}
      pl={["16px", "12px"]}
    >
      {children}
    </GridItem>
  );
};

export default TransactionListItemSingleBlock;
