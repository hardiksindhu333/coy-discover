import { defineConfig } from "vitest/config";
import path from "node:path";

process.env.DATABASE_URL = "file:./test.db";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
