import { VStack, Text } from "@chakra-ui/react";
import { Warning2 } from "iconsax-react";
import { FunctionComponent } from "react";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

interface NoContentPropr {
  text: string;
}

const NoContent: FunctionComponent<NoContentPropr> = ({ text }) => {
  const isMobile = useIsMobileHook();

  return (
    <VStack
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      borderRadius={"24px"}
      minH={"500px"}
      backgroundColor={"brand.100"}
      gap={"32px"}
    >
      <Warning2 size={isMobile ? "64px" : "124px"} color={"black"} />
      <Text fontSize={["md", "xl"]}>{text}</Text>
    </VStack>
  );
};

export default NoContent;
