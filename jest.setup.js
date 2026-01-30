// import { TextEncoder, TextDecoder } from "util";
// import "@testing-library/jest-dom";
 global.TextEncoder = require("util").TextEncoder;
global.TextDecoder = require("util").TextDecoder;

// @testing-library/jest-dom
const jestDom = require("@testing-library/jest-dom");
expect.extend(jestDom);

// Mock Vite import.meta.env for Jest
Object.defineProperty(global, "import", {
  value: { meta: { env: { VITE_API_BASE_URL: "http://localhost:8000" } } },
});

// Optional: suppress console.error in tests
global.console.error = (...args) => {};
