/** @type {import('tailwindcss').Config} */

/** Colors **/
const colors = {
  // Named colors
  "light-grey": "#efefef",

  // Theme
  "primary-500": "#045FD0",
  default: "#444",
  disabled: "#777777",
  window: "#fafafa",

  // button colors

  // Specific component color
  "ui-label": "#5f5f5f",
  "ui-label-disabled": "#8f8f8f",
  "ui-input-bg-hover": "#fafafa",
  "ui-input-border": "#e4e4e7",
  "ui-input-disabled-bg": "#eeeeee",
  "ui-input-disabled-text": "#787878",
  "ui-input-disabled-border": "#dedede",
  "ui-input-invalid-bg": "#fffbfb",
  "ui-input-invalid-border": "#ff5d5d",
};

/** Border radius **/
const borderRadius = {
  "2xs": ".2rem",
  xs: ".4rem",
  s: ".6rem",
  m: ".8rem",
  l: "1rem",
  xl: "1.2rem",
  "2xl": "1.4rem",
  "3xl": "1.6rem",
  "4xl": "1.8rem",
  "5xl": "2rem",
};

/** Font size **/
const fontSize = {
  xs: "1rem",
  s: "1.2rem",
  m: "1.4rem",
  l: "1.6rem",
  xl: "1.8rem",
  "2xl": "2rem",
  "3xl": "2.2rem",
  "4xl": "2.4rem",
  "5xl": "2.6rem",
  "6xl": "2.8rem",
  "8xl": "3rem",
};

/** Spacing **/
const spacing = {
  0: "0rem",
  ".1": ".1rem",
  ".2": ".2rem",
  ".4": ".4rem",
  ".6": ".6rem",
  ".8": ".8rem",
  1: "1rem",
  1.2: "1.2rem",
  1.4: "1.4rem",
  1.6: "1.6rem",
  1.8: "1.8rem",
  2: "2rem",
  2.2: "2.2rem",
  2.4: "2.4rem",
  2.6: "2.6rem",
  2.8: "2.8rem",
  3: "3rem",
  3.2: "3.2rem",
  3.4: "3.4rem",
  3.6: "3.6rem",
  3.8: "3.8rem",
};

module.exports = {
  content: ["./projects/yk-components/src/**/*.{html,ts}"],
  theme: {
    spacing,
    borderRadius,
    fontSize,
    extend: {
      colors,
      transformOrigin: {
        "top-center": "top center",
      },
      width: {
        "min-page-width": "min(100%, 600px)",
      },
      transitionProperty: {
        "border-color": "border-color",
        "ui-label": "transform, font-size",
        scale: "scale",
      },
      transitionDuration: {
        60: "60ms",
      },
      transitionTimingFunction: {
        "ui-label": "cubic-bezier(0, 0, .2, 1)",
      },
      boxShadow: {
        input: "rgb(0 0 0 / 10%) 0px 1px 2px 0px",
        btn: "0 1px 4px 2px rgba(0,0,0,0.20)",
        "btn-default": "0 1px 2px 0px rgba(0,0,0,0.15)",
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
    plugins: [],
  },
};
