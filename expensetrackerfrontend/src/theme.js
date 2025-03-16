import { createSystem, defaultConfig } from "@chakra-ui/react";
import { defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  theme: {
    tokens: {
      colors: {
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
        link: {
          700: "#7b2cbf",
        },

        // brand:{
        //   100: "#ebe0ff",
        //   200: "#dac7ff",
        //   300: "#c7adff",
        //   400: "#ac8bee",
        //   500: "#916dd5",
        //   600: "#7151a9",
        //   700: "#573d7f",
        //   800: "#46325d",
        //   900: "#3f3649",
        // }

        // brand:{
        //   100: "#fef9df",
        //   200: "#fdf2bf",
        //   300: "#fbec9f",
        //   400: "#fae580",
        //   500: "#f9df60",
        //   600: "#f8d840",
        //   700: "#f6d220",
        //   800: "#f5cb00",
        //   900: "#fdc500",
        // }

        //orange to black
        // brand:{
        //   100: "#fcec5d",
        //   200: "#fcd45d",
        //   300: "#fccc5d",
        //   400: "#fcc75d",
        //   500: "#fcbc5d",
        //   600: "#fcb75d",
        //   700: "#fcac5d",
        //   800: "#370617",
        //   900: "#03071e",
        // }

      },
      fontSizes:{
        "custom-lg": "15px",
        "custom-xl": "18px",
        "custom-md": "14px",
        "custom-sm": "13px",
        "custom-xs": "11px",
      }
    },
  },
});

export const system = createSystem(defaultConfig, customConfig);
