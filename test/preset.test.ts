import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

import {
    configFileName,
    configPath,
    packageName,
    resolveConfigPath,
} from "../src/preset.js";

interface PackageManifest {
    readonly exports: Record<string, unknown>;
    readonly files: readonly string[];
    readonly name: string;
    readonly private: boolean;
}

const readPackageManifest = async (): Promise<PackageManifest> =>
    JSON.parse(
        await readFile(new URL("../package.json", import.meta.url), "utf8")
    ) as PackageManifest;

describe("lychee-config-nick2bad4u", () => {
    it("exports a stable config file path", () => {
        expect.assertions(5);

        expect(packageName).toBe("lychee-config-nick2bad4u");
        expect(configFileName).toBe("lychee.toml");
        expect(configPath.endsWith("lychee.toml")).toBe(true);
        expect(configPath).not.toContain("package.json");
        expect(resolveConfigPath()).toBe(configPath);
    });

    it("publishes the raw Lychee config and typed helper", async () => {
        expect.assertions(5);

        const manifest = await readPackageManifest();

        expect(manifest.name).toBe(packageName);
        expect(manifest.private).toBe(false);
        expect(manifest.files).toContain("dist");
        expect(manifest.files).toContain(configFileName);
        expect(manifest.exports["./package.json"]).toBe("./package.json");
    });

    it("keeps the shared Lychee defaults focused on CI-friendly link checks", async () => {
        expect.assertions(13);

        const config = await readFile(configPath, "utf8");

        expect(config).toContain('format = "detailed"');
        expect(config).toContain('mode = "emoji"');
        expect(config).toContain("no_progress = true");
        expect(config).toContain('output = ".lychee.report.md"');
        expect(config).toContain("cache = true");
        expect(config).toContain('max_cache_age = "7d"');
        expect(config).toContain('cache_exclude_status = "429, 500.."');
        expect(config).toContain("max_concurrency = 12");
        expect(config).not.toContain('    "429",');
        expect(config).toContain("require_https = true");
        expect(config).toContain("exclude_all_private = true");
        expect(config).toContain('[hosts."github.com"]');
        expect(config).not.toContain("github_token");
    });
});
