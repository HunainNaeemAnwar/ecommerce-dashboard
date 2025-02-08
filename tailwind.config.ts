import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        Satoshi: "var(--font-satoshi-medium)",
        Integral: "var(--font-integral-cf)",
        Poppins: "var(--font-poppins)",
      },
    },
  },
  plugins: [],
} satisfies Config;
