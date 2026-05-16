import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import { ArrowDown2 } from "iconsax-react";
import { FunctionComponent, useEffect, useRef, useState } from "react";
import { colorThemes } from "../../theme";
import { useThemeContext } from "../../context/ThemeContext";
import useIsMobileHook from "../../Hooks/useIsMobileHook";

const ThemeSelector: FunctionComponent = () => {
  const { themeId, currentTheme, setThemeId } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobileHook();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <Box ref={containerRef} position="relative">
      <Box
        as="button"
        onClick={() => setIsOpen((open) => !open)}
        border="none"
        borderRadius="10px"
        backgroundColor="whiteAlpha.200"
        _hover={{ backgroundColor: "whiteAlpha.300" }}
        cursor="pointer"
        px={["10px", "12px"]}
        py="6px"
      >
        <HStack gap="8px" alignItems="center">
          <Box
            width={["14px", "16px"]}
            height={["14px", "16px"]}
            borderRadius="6px"
            backgroundColor={currentTheme.previewColor}
            border="1px solid"
            borderColor="whiteAlpha.500"
            flexShrink={0}
          />
          <Text
            fontSize={["custom-xs", "custom-sm"]}
            fontWeight="medium"
            color="white"
            display={["none", "block"]}
          >
            {currentTheme.name}
          </Text>
          <ArrowDown2
            size={isMobile ? 14 : 16}
            color="white"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease",
            }}
          />
        </HStack>
      </Box>

      {isOpen && (
        <VStack
          position="absolute"
          top="calc(100% + 8px)"
          right={0}
          minWidth={["180px", "200px"]}
          backgroundColor="white"
          borderRadius="12px"
          boxShadow="0 8px 24px rgba(0, 0, 0, 0.12)"
          border="1px solid"
          borderColor="brand.300"
          py="6px"
          zIndex={20}
          alignItems="stretch"
          gap={0}
        >
          {colorThemes.map((theme) => {
            const isSelected = theme.id === themeId;
            return (
              <Box
                key={theme.id}
                as="button"
                width="100%"
                border="none"
                px="12px"
                py="10px"
                cursor="pointer"
                backgroundColor={isSelected ? "brand.100" : "transparent"}
                _hover={{ backgroundColor: "brand.200" }}
                onClick={() => {
                  setThemeId(theme.id);
                  setIsOpen(false);
                }}
              >
                <HStack gap="10px" justifyContent="flex-start" alignItems="center">
                  <Box
                    width="18px"
                    height="18px"
                    borderRadius="6px"
                    backgroundColor={theme.previewColor}
                    border="1px solid"
                    borderColor="brand.400"
                    flexShrink={0}
                  />
                  <Text
                    fontSize="custom-sm"
                    fontWeight={isSelected ? "semibold" : "medium"}
                    color="brand.900"
                    flex={1}
                    textAlign="left"
                  >
                    {theme.name}
                  </Text>
                </HStack>
              </Box>
            );
          })}
        </VStack>
      )}
    </Box>
  );
};

export default ThemeSelector;
