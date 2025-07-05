module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,html,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        global: {
          background1: "var(--global-bg-1)",
          background2: "var(--global-bg-2)",
          background3: "var(--global-bg-3)",
          background4: "var(--global-bg-4)",
          background5: "var(--global-bg-5)",
          text1: "var(--global-text-1)",
          text2: "var(--global-text-2)",
          text3: "var(--global-text-3)",
          text4: "var(--global-text-4)",
          text5: "var(--global-text-5)"
        },
        header: {
          background1: "var(--header-bg-1)"
        },
        dropdown: {
          text1: "var(--dropdown-text-1)"
        },
        pagination: {
          background1: "var(--pagination-bg-1)"
        }
      },
      fontFamily: {
        'helvetica': ['Helvetica Neue', 'sans-serif']
      }
    }
  },
  plugins: []
};