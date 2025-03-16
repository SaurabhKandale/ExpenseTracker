import { VStack, HStack, Input, Text } from "@chakra-ui/react";
import { InfoCircle } from "iconsax-react";
import { type } from "os";
import { FunctionComponent } from "react";
import { NumberInputField, NumberInputRoot } from "../ui/number-input";

interface CustomNumberInputFieldProps {
  placeholder: string;
  onChange: (str: any) => void;
  value: number | undefined;
  fieldTitle?: string;
  fieldError?: boolean;
  maxLimit?: number;
}

const CustomNumberInputField: FunctionComponent<
  CustomNumberInputFieldProps
> = ({ placeholder, onChange, value, fieldTitle, fieldError, maxLimit }) => {
  return (
    <VStack
      width={"100%"}
      justifyContent={"flex-start"}
      alignItems={"center"}
      gap={"4px"}
    >
      <HStack
        justifyContent={"flex-start"}
        alignItems={"center"}
        width={"100%"}
        p={"0px"}
        m={"0"}
      >
        <Text
          fontSize={["custom-sm", "custom-md"]}
          marginLeft={"6px"}
          color={fieldError ? "red" : "black"}
        >
          {fieldTitle || ""}
        </Text>
      </HStack>

      <NumberInputRoot
        width="100%"
        borderRadius={"12px!important"}
        border={fieldError ? "1px solid red" : "1px solid #E2E8F0"}
      >
        {
          <NumberInputField
            //@ts-ignore
            border={"none"}
            outline={"none"}
            placeholder={placeholder}
            value={value}
            size={["sm", "md"]}
            onChange={(e: any) => onChange(parseFloat(e.target.value))}
            
          />
        }
      </NumberInputRoot>
    </VStack>
  );
};

export default CustomNumberInputField;
