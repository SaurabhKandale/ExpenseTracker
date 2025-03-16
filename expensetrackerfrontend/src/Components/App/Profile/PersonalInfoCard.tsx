import { VStack, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface PersonalInfoCardProps {
  type: string;
  value: string;
}

const PersonalInfoCard: FunctionComponent<PersonalInfoCardProps> = ({
  type,
  value,
}) => {
  return (
    <VStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"flex-start"}
      gap={"4px"}
      backgroundColor={"brand.200"}
      //   shadow={"lg"}
      borderRadius={"16px"}
      p={["16px", "16px 24px"]}
    >
      <Text fontSize={["sm", "custom-lg"]} marginLeft={"6px"} color={"black"}>
        {type}
      </Text>
      <Text
        fontSize={["sm", "custom-lg"]}
        marginLeft={"6px"}
        color={"black"}
        fontWeight={"medium"}
      >
        {value}
      </Text>
    </VStack>
  );
};

export default PersonalInfoCard;
