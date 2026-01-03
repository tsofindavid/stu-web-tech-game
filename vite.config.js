import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import { writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";

async function generateAndSaveLevels() {
	try {
		const currentFile = fileURLToPath(import.meta.url);
		const currentDir = dirname(currentFile);
		const rootDir = currentDir;

		const generatorPath = join(rootDir, "src", "services", "levelGenerator.js");
		const indicatorPath = join(rootDir, "src", "pages", "game", "classes", "items", "indicator.item.js");
		const baseItemPath = join(rootDir, "src", "pages", "game", "classes", "items", "base.item.js");

		let indicatorCode = readFileSync(indicatorPath, "utf-8");
		indicatorCode = indicatorCode.replace(
			/from "\.\/base\.item"/,
			`from "./temp-base.item.js"`
		);

		const tempIndicatorPath = join(rootDir, "temp-indicator.item.js");
		writeFileSync(tempIndicatorPath, indicatorCode);

		const tempBaseItemPath = join(rootDir, "temp-base.item.js");
		const baseItemCode = readFileSync(baseItemPath, "utf-8");
		writeFileSync(tempBaseItemPath, baseItemCode);

		let generatorCode = readFileSync(generatorPath, "utf-8");
		
		const relativeIndicatorPath = `./temp-indicator.item.js`;
		generatorCode = generatorCode.replace(
			/from "@\/pages\/game\/classes\/items\/indicator\.item\.js"/,
			`from "${relativeIndicatorPath}"`
		);

		const tempPath = join(rootDir, "temp-generator.js");
		writeFileSync(tempPath, generatorCode);

		const fileUrl = `file:///${tempPath.replace(/\\/g, "/")}`;
		const module = await import(fileUrl);

		const generateLevels = module.generateLevels;

		const levelCount = 30;
		const levels = generateLevels(levelCount);

		const outputPath = join(rootDir, "public", "levels.json");
		const levelsJson = JSON.stringify(levels, null, "\t");
		writeFileSync(outputPath, levelsJson, "utf-8");

		try {
			writeFileSync(tempPath, "");
			writeFileSync(tempIndicatorPath, "");
			writeFileSync(tempBaseItemPath, "");
		} catch (e) {
		}

		return levels;
	} catch (err) {
		console.error("Chyba pri generovani levelov:", err);
		throw err;
	}
}

function generateLevelsPlugin() {
	return {
		name: "generate-levels",
		async configureServer(server) {
			server.middlewares.use("/api/generate-levels", async (req, res, next) => {
				if (req.method === "POST") {
					try {
						const levels = await generateAndSaveLevels();

						res.setHeader("Content-Type", "application/json");

						const response = {
							success: true,
							levels: levels,
						};

						res.end(JSON.stringify(response));
					} catch (error) {
						res.statusCode = 500;
						const errorResponse = {
							success: false,
							error: error.message,
						};
						res.end(JSON.stringify(errorResponse));
					}
				} else {
					next();
				}
			});
		},
	};
}

export default defineConfig({
	base: './',
	plugins: [generateLevelsPlugin()],
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
