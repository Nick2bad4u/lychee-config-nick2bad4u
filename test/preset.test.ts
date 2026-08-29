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

const readExcludedUrlPatterns = (config: string): readonly RegExp[] => {
    const lines = config.split(/\r?\n/v);
    const openingIndex = lines.indexOf("exclude = [");
    const closingIndex = lines.indexOf("]", openingIndex + 1);

    if (openingIndex === -1 || closingIndex === -1) {
        throw new Error("Could not find the Lychee exclude array");
    }

    return lines.slice(openingIndex + 1, closingIndex).flatMap((line) => {
        const value = line.trim();

        if (!value.startsWith("'") || !value.endsWith("',")) {
            return [];
        }

        const pattern = value.slice(1, -2);
        // eslint-disable-next-line security/detect-non-literal-regexp -- The test compiles trusted, repository-owned Lychee patterns using the closest compatible JavaScript regex mode.
        const expression = new RegExp(pattern, "u");

        return [expression];
    });
};

const isExcludedUrl = (url: string, patterns: readonly RegExp[]): boolean =>
    patterns.some((pattern) => pattern.test(url));

const httpsUrl = (hostAndPath: string): string =>
    [
        "https:",
        "//",
        hostAndPath,
    ].join("");

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
        expect.assertions(19);

        const config = await readFile(configPath, "utf8");

        expect(config).toContain('verbose = "warn"');
        expect(config).toContain('format = "detailed"');
        expect(config).toContain('mode = "emoji"');
        expect(config).toContain("no_progress = true");
        expect(config).toContain('output = ".lychee.report.md"');
        expect(config).toMatch(/^cache\s*=\s*true$/mv);
        expect(config).toContain('max_cache_age = "7d"');
        expect(config).toContain(
            'cache_exclude_status = "401, 403, 408, 425, 429, 500.."'
        );
        expect(config).toMatch(/^max_concurrency\s*=\s*12$/mv);
        expect(config).toContain('method = "get"');
        expect(config).not.toContain('    "429",');
        expect(config).toContain("require_https = true");
        expect(config).toMatch(/^include_mail\s*=\s*false$/mv);
        expect(config).toContain("exclude_all_private = true");
        expect(config).toContain(
            String.raw`'(^|[\\/])\.lycheecache(?:[\\/]|$)'`
        );
        expect(config).toContain(
            String.raw`'(^|[\\/])\.lychee\.report\.(?:md|txt|json|xml)$'`
        );
        expect(config).toContain('[hosts."github.com"]');
        expect(config).toContain('[hosts."api.inaturalist.org"]');
        expect(config).not.toContain("github_token");
    });

    it("excludes deliberate Google test fixtures narrowly", async () => {
        expect.assertions(3);

        const config = await readFile(configPath, "utf8");

        expect(config).toContain(
            String.raw`'^https?://script\.google\.com/macros/s/test/exec(?:[/?#].*)?$'`
        );
        expect(config).toContain(
            String.raw`'^https?://photos\.app\.goo\.gl/(?:example|abcdefghijkl)(?:[/?#].*)?$'`
        );
        expect(config).toContain(
            String.raw`'^https?://photos\.google\.com/share/example(?:[/?#].*)?$'`
        );
    });

    it("excludes evidenced bot-blocked web routes narrowly", async () => {
        expect.assertions(2);

        const config = await readFile(configPath, "utf8");
        const patterns = readExcludedUrlPatterns(config);
        const expectedExcludedUrls = [
            httpsUrl("medium.com/@example/example-post"),
            httpsUrl("stackoverflow.com/"),
            httpsUrl("stackoverflow.com/a/123"),
            httpsUrl("stackoverflow.com/q/123"),
            httpsUrl("stackoverflow.com/questions/123/example"),
            httpsUrl("packagephobia.com/"),
            httpsUrl("packagephobia.com/result?p=example"),
            httpsUrl("www.reddit.com/r/typescript"),
            httpsUrl("www.reddit.com?context=3"),
            httpsUrl("reddit.com#popular"),
        ];
        const expectedCheckedUrls = [
            httpsUrl("stackoverflow.com/tags/typescript/info"),
            httpsUrl("stackoverflow.com/users/123/example"),
            httpsUrl("packagephobia.com/api/v1/package"),
            httpsUrl("old.reddit.com/r/typescript"),
            httpsUrl("oauth.reddit.com/api/v1/me"),
            httpsUrl("www.walmart.com/definitely-not-a-real-product-9f7a"),
            httpsUrl("www.office.com/interview"),
            httpsUrl("www.nature.com/articles/definitely-not-real-9f7a"),
        ];

        expect(
            expectedExcludedUrls.filter((url) => !isExcludedUrl(url, patterns))
        ).toStrictEqual([]);
        expect(
            expectedCheckedUrls.filter((url) => isExcludedUrl(url, patterns))
        ).toStrictEqual([]);
    });
});
