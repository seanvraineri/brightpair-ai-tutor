import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: parseInt(process.env.PORT || "8080"),
  },
  plugins: [
    react(),
    mode === "development" &&
    componentTagger(),
    mode === "production" &&
    visualizer({
      filename: "dist/stats.html",
      open: false,
      gzipSize: true,
      brotliSize: true,
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    include: ["react-markdown"],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor": [
            "react",
            "react-dom",
            "react-router-dom",
            "@tanstack/react-query",
          ],
          "ui": [
            "@radix-ui/react-accordion",
            "@radix-ui/react-alert-dialog",
            "@radix-ui/react-aspect-ratio",
            "@radix-ui/react-avatar",
            "@radix-ui/react-checkbox",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-label",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-radio-group",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slider",
            "@radix-ui/react-switch",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
            "@radix-ui/react-tooltip",
          ],
          "charts": [
            "recharts",
            "react-grid-heatmap",
          ],
          "pdf": [
            "jspdf",
            "jspdf-autotable",
          ],
          "math": [
            "react-markdown",
            "remark-math",
            "rehype-katex",
            "katex",
          ],
          "supabase": [
            "@supabase/supabase-js",
          ],
          "utils": [
            "date-fns",
            "class-variance-authority",
            "clsx",
            "tailwind-merge",
            "framer-motion",
            "lucide-react",
            "react-hot-toast",
            "sonner",
            "cmdk",
            "vaul",
          ],
          "forms": [
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
          ],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
}));
