import { FunctionComponent } from "react";
import { DialogRoot, DialogContent, DialogHeader } from "../ui/dialog";
import { Button, DialogBody, HStack, VStack, Text } from "@chakra-ui/react";
import { CloseCircle } from "iconsax-react";
import { ThreeDots } from "react-loader-spinner";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

interface ConfirmationModalProps {
  text: string;
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: () => void;
  isLoading?: boolean;
}

const ConfirmationModal: FunctionComponent<ConfirmationModalProps> = ({
  text,
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading,
}) => {
  const isMobile = useIsMobileHook();

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={onClose}
      size="lg"
      placement={["center", "top"]}
    >
      {
        //@ts-ignore
        <DialogContent>
          <DialogHeader borderBottom={"0.5px solid black"}>
            <HStack alignItems={"center"} justifyContent={"space-between"}>
              {/* <DialogTitle>Prepare Chakra V3</DialogTitle> */}
              <Text fontSize={["custom-md", "custom-lg"]} fontWeight={"semibold"}>
                {title}
              </Text>
              <CloseCircle
                color={"#000"}
                onClick={onClose}
                cursor={"pointer"}
                size={isMobile ? 18 : 20}
              />
            </HStack>
          </DialogHeader>
          <DialogBody>
            <VStack py={"24px"} gap={"28px"}>
              <HStack
                width={"100%"}
                justifyContent={"flex-start"}
                alignItems={"center"}
              >
                <Text fontSize={["custom-sm", "custom-md"]}>{text}</Text>
              </HStack>
              <HStack
                width={"100%"}
                justifyContent={"flex-end"}
                alignItems={"center"}
                gap={"12px"}
                mt={"12px"}
              >
                <Button
                  colorScheme={"red"}
                  onClick={onClose}
                  variant={"outline"}
                  borderRadius={"12px"}
                  width={["100px", "140px"]}
                  size={["sm", "md"]}
                  fontSize={["custom-xs", "custom-sm"]}
                >
                  Cancel
                </Button>
                <Button
                  colorScheme={""}
                  width={["100px", "140px"]}
                  borderRadius={"12px"}
                  onClick={onConfirm}
                  size={["sm", "md"]}
                  fontSize={["custom-xs", "custom-sm"]}
                >
                  {isLoading ? (
                    <ThreeDots color={"white"} height={"32px"} width={"32px"} />
                  ) : (
                    "Confirm"
                  )}
                </Button>
              </HStack>
            </VStack>
          </DialogBody>
        </DialogContent>
      }
    </DialogRoot>
  );
};

export default ConfirmationModal;
