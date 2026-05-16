import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const fontSizes = {
  "custom-lg": "15px",
  "custom-xl": "18px",
  "custom-md": "14px",
  "custom-sm": "13px",
  "custom-xs": "11px",
};

export const colorThemes = [
  {
    id: "default",
    name: "Classic Gray",
    previewColor: "#adb5bd",
    brand: {
      100: "#f8f9fa",
      200: "#e9ecef",
      300: "#dee2e6",
      400: "#ced4da",
      500: "#adb5bd",
      600: "#6c757d",
      700: "#495057",
      800: "#343a40",
      900: "#212529",
    },
  },
  {
    id: "purple",
    name: "Lavender",
    previewColor: "#916dd5",
    brand: {
      100: "#ebe0ff",
      200: "#dac7ff",
      300: "#c7adff",
      400: "#ac8bee",
      500: "#916dd5",
      600: "#7151a9",
      700: "#573d7f",
      800: "#46325d",
      900: "#3f3649",
    },
  },
  {
    id: "yellow",
    name: "Sunshine",
    previewColor: "#f9df60",
    brand: {
      100: "#fef9df",
      200: "#fdf2bf",
      300: "#fbec9f",
      400: "#fae580",
      500: "#f9df60",
      600: "#f8d840",
      700: "#f6d220",
      800: "#f5cb00",
      900: "#fdc500",
    },
  },
  {
    id: "amber-night",
    name: "Amber Night",
    previewColor: "#fcbc5d",
    brand: {
      100: "#fcec5d",
      200: "#fcd45d",
      300: "#fccc5d",
      400: "#fcc75d",
      500: "#fcbc5d",
      600: "#fcb75d",
      700: "#fcac5d",
      800: "#370617",
      900: "#03071e",
    },
  },
];

export const THEME_STORAGE_KEY = "expense-tracker-color-theme";

export const getThemeById = (themeId) =>
  colorThemes.find((theme) => theme.id === themeId) ?? colorThemes[0];

/** Syncs brand palette to CSS variables for react-datepicker and global styles */
export const applyBrandCssVariables = (brandColors) => {
  const root = document.documentElement;
  Object.entries(brandColors).forEach(([shade, color]) => {
    root.style.setProperty(`--brand-${shade}`, color);
  });
};

export const createAppSystem = (brandColors) =>
  createSystem(
    defaultConfig,
    defineConfig({
      theme: {
        tokens: {
          colors: {
            brand: brandColors,
            link: {
              700: "#7b2cbf",
            },
          },
          fontSizes,
        },
      },
    })
  );

export const system = createAppSystem(colorThemes[0].brand);
