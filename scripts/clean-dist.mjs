import { rmSync } from "node:fs";

rmSync("dist", { force: true, recursive: true });
rmSync(".cache/tsbuildinfo/tsconfig.build.tsbuildinfo", { force: true });
