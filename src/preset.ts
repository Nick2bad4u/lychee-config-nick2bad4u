import * as path from "node:path";
import { fileURLToPath } from "node:url";

/** Packaged Lychee TOML config filename. */
export const configFileName = "lychee.toml" as const;

/** Published package name for this shared Lychee config. */
export const packageName = "lychee-config-nick2bad4u" as const;

/**
 * Resolves the packaged Lychee config from an ESM module URL.
 *
 * @param fromUrl - Module URL to resolve from.
 *
 * @returns Absolute path to the packaged Lychee config file.
 */
export function resolveConfigPath(fromUrl: string = import.meta.url): string {
    return path.join(
        path.dirname(fileURLToPath(fromUrl)),
        "..",
        configFileName
    );
}

/** Absolute path to the packaged Lychee config file. */
export const configPath: string = resolveConfigPath();
