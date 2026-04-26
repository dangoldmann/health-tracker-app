import { config } from "@repo/eslint-config/react-internal";

export default [
  ...config,
  {
    ignores: [
      ".expo/**",
      "dist/**",
      "node_modules/**",
      "babel.config.js",
      "metro.config.js",
      "tailwind.config.js",
    ],
  },
];
