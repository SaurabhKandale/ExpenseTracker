import { Input, VStack, Text, HStack, List } from "@chakra-ui/react";
import { InfoCircle } from "iconsax-react";
import { FunctionComponent } from "react";
import { Tooltip } from "../ui/tooltip";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

interface CustomInputFieldProps {
  placeholder: string;
  onChange: (str: any) => void;
  value: string;
  type?: string;
  fieldTitle?: string;
  fieldError?: boolean;
  maxLimit?: number;
  isCreation?: boolean;
  inputMode?: string;
}

const PasswordTooltip = () => {
  return (
    <List.Root p={"8px"} width={"200%"}>
      <List.Item>Must be at least 8 characters long</List.Item>
      <List.Item>Must contain at least one uppercase letter</List.Item>
      <List.Item>Must contain at least one lowercase letter</List.Item>
      <List.Item>Must contain at least one number</List.Item>
      <List.Item>Must contain at least one special character</List.Item>
    </List.Root>
  );
};

const CustomInputField: FunctionComponent<CustomInputFieldProps> = ({
  placeholder,
  onChange,
  value,
  type = "text",
  fieldTitle,
  fieldError,
  maxLimit,
  isCreation,
  inputMode,
}) => {
  const isMobile = useIsMobileHook();

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
          // width={"100%"}
          fontSize={["custom-sm", "custom-md"]}
          marginLeft={"6px"}
          color={fieldError ? "red" : "black"}
        >
          {fieldTitle || ""}
        </Text>
        {fieldTitle === "Password" && (
          <Tooltip
            content={<PasswordTooltip />}
            openDelay={100}
            closeDelay={100}
          >
            <InfoCircle
              size={isMobile ? 14 : 16}
              style={{
                marginLeft: isMobile ? "-4px" : "-2px",
              }}
              color={fieldError && fieldTitle === "Password" ? "red" : "black"}
            />
          </Tooltip>
        )}
      </HStack>
      <Input
        type={type || "text"}
        placeholder={placeholder}
        borderRadius={"12px"}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        width={"100%"}
        border={fieldError ? "1px solid red" : "1px solid #E2E8F0"}
        _focus={{
          outline: "none",
        }}
        max={new Date().toISOString().split("T")[0]}
        backgroundColor={isCreation ? "white" : "transparent"}
        fontSize={["custom-xs", "custom-md"]}
      />
      <HStack
        width={"100%"}
        justifyContent={"flex-end"}
        alignItems={"center"}
        gap={"6px"}
      >
        {maxLimit && (
          <Text
            fontSize={["custom-xs", "custom-sm"]}
            color={value.length >= maxLimit ? "red" : "black"}
            mt={"4px"}
          >
            {value.length}/{maxLimit}
          </Text>
        )}
      </HStack>
    </VStack>
  );
};

export default CustomInputField;
