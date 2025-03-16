import { useBreakpointValue } from "@chakra-ui/react";

const useIsMobileHook = () => {
  return useBreakpointValue({ base: true, md: false });
};

export default useIsMobileHook;