import { createTheme } from "@mantine/core";

export const theme = createTheme({
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    xxl: "3rem",
    xxxl: "4rem",
    xxxxl: "6rem",
  },

  primaryColor: "brand",

  colors: {
    brand: [
      "#e6eded",
      "#a6c8c6",
      "#78aeab",
      "#6da9a6",
      "#5b9491",
      "#4e8481",
      "#284e4c",
      "#224543",
      "#1d3c3b",
      "#173334",
    ],

    secondary: [
      "#fefce8",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
    ],

    success: [
      "#f0fdf4",
      "#dcfce7",
      "#bbf7d0",
      "#86efac",
      "#4ade80",
      "#22c55e",
      "#16a34a",
      "#15803d",
      "#166534",
      "#14532d",
    ],

    warning: [
      "#fffbeb",
      "#fef3c7",
      "#fde68a",
      "#fcd34d",
      "#fbbf24",
      "#f59e0b",
      "#d97706",
      "#b45309",
      "#92400e",
      "#78350f",
    ],

    error: [
      "#fef2f2",
      "#fee2e2",
      "#fecaca",
      "#fca5a5",
      "#f87171",
      "#ef4444",
      "#dc2626",
      "#b91c1c",
      "#991b1b",
      "#7f1d1d",
    ],

    neutral: [
      "#fafafa",
      "#f4f4f5",
      "#e4e4e7",
      "#d4d4d8",
      "#a1a1aa",
      "#71717a",
      "#52525b",
      "#3f3f46",
      "#27272a",
      "#18181b",
    ],
    light: [
      "#fff9e9",
      "#fdf2d5",
      "#fde4a4",
      "#fdd56f",
      "#fdc946",
      "#fdc130",
      "#fdbd25",
      "#e1a61b",
      "#c89312",
      "#ad7e00",
    ],
  },

  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    xxl: "1.5rem",
    xxxl: "1.875rem",
    xxxxl: "2.25rem",
  },

  radius: {
    xs: "0.25rem",
    sm: "0.375rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    xxl: "1.5rem",
    xxxl: "2rem",
  },

  shadows: {
    xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    xxl: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  },

  headings: {
    sizes: {
      h1: {
        fontSize: "6rem",
        fontWeight: "700",
        lineHeight: "1",
      },
      h2: {
        fontSize: "4.5rem",
        fontWeight: "700",
        lineHeight: "1",
      },
      h3: {
        fontSize: "2.5rem",
        fontWeight: "700",
        lineHeight: "1",
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: "700",
        lineHeight: "1",
      },
      h5: {
        fontSize: "1rem",
        fontWeight: "700",
        lineHeight: "1",
      },
      h6: {
        fontSize: "0.75rem",
        fontWeight: "700",
        lineHeight: "1rem",
      },
    },
  },

  breakpoints: {
    xs: "30em",
    sm: "48em",
    md: "64em",
    lg: "74em",
    xl: "90em",
  },
});
