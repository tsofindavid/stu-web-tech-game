import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";

export default defineConfig({
	base: './',
	esbuild: {
		jsxFactory: "h",
		jsxFragment: "Fragment",
		minifyIdentifiers: false,
	},
	css: {
		modules: {
			localsConvention: "camelCase",
			generateScopedName: "[local]"
		}
	},
	build: {
		minifyIdentifiers: false,
	},
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
		},
	},
});
