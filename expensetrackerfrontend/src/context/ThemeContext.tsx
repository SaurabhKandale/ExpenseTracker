import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { ChakraProvider } from "@chakra-ui/react";
import {
  applyBrandCssVariables,
  colorThemes,
  createAppSystem,
  getThemeById,
  THEME_STORAGE_KEY,
} from "../theme";

export type ColorTheme = (typeof colorThemes)[number];

interface ThemeContextValue {
  themeId: string;
  currentTheme: ColorTheme;
  setThemeId: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: FunctionComponent<ThemeProviderProps> = ({
  children,
}) => {
  const [themeId, setThemeIdState] = useState<string>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored && colorThemes.some((theme) => theme.id === stored)
      ? stored
      : colorThemes[0].id;
  });

  const currentTheme = useMemo(() => getThemeById(themeId), [themeId]);

  const system = useMemo(
    () => createAppSystem(currentTheme.brand),
    [currentTheme]
  );

  const setThemeId = (id: string) => {
    if (!colorThemes.some((theme) => theme.id === id)) return;
    setThemeIdState(id);
    localStorage.setItem(THEME_STORAGE_KEY, id);
  };

  const value = useMemo(
    () => ({ themeId, currentTheme, setThemeId }),
    [themeId, currentTheme]
  );

  useLayoutEffect(() => {
    applyBrandCssVariables(currentTheme.brand);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={value}>
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within ThemeProvider");
  }
  return context;
};
