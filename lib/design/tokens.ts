export const designTokens = {
  colors: {
    // Primary brand colors
    primary: {
      50: "oklch(0.985 0 0)",
      100: "oklch(0.97 0 0)",
      200: "oklch(0.922 0 0)",
      300: "oklch(0.708 0 0)",
      400: "oklch(0.556 0 0)",
      500: "oklch(0.439 0 0)",
      600: "oklch(0.269 0 0)",
      700: "oklch(0.205 0 0)",
      800: "oklch(0.145 0 0)",
      900: "oklch(0.1 0 0)",
    },
    // Accent colors for categories and highlights
    accent: {
      blue: "oklch(0.6 0.118 184.704)",
      green: "oklch(0.769 0.188 70.08)",
      amber: "oklch(0.828 0.189 84.429)",
      red: "oklch(0.577 0.245 27.325)",
    },
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "3rem", // 48px
    "3xl": "4rem", // 64px
    "4xl": "6rem", // 96px
  },

  borderRadius: {
    sm: "calc(var(--radius) - 4px)",
    md: "calc(var(--radius) - 2px)",
    lg: "var(--radius)",
    xl: "calc(var(--radius) + 4px)",
    "2xl": "calc(var(--radius) + 8px)",
  },

  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    glass: "0 8px 32px 0 rgb(0 0 0 / 0.1), inset 0 1px 0 0 rgb(255 255 255 / 0.1)",
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
    toast: 1070,
  },

  typography: {
    fontSizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },

    letterSpacing: {
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
    },
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
} as const

export type DesignTokens = typeof designTokens
