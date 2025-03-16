import { VStack } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Triangle } from "react-loader-spinner";

interface LoaderProps {
  size?: string;
}

const Loader: FunctionComponent<LoaderProps> = ({ size }) => {
  return (
    <VStack
      width={"100%"}
      height={"100%"}
      justifyContent={"center"}
      alignItems={"center"}
      backgroundColor={"brand.100"}
      borderRadius={"16px"}
    >
      <Triangle
        visible={true}
        height={
          size === "sm"
            ? "30"
            : size === "md"
              ? "60"
              : size === "lg"
                ? "120"
                : "180"
        }
        width="180"
        color="#000"
        ariaLabel="triangle-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </VStack>
  );
};

export default Loader;
