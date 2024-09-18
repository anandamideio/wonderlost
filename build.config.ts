import { defineBuildConfig } from "unbuild"

export default defineBuildConfig({
  "declaration": true,
  "failOnWarn": false,
  "clean": true,
  "dependencies": ['consola'],
  "externals": [
    "/scripts/greensock/esm/all.js",
    "../../../../../scripts/greensock/esm/all.js"
  ],
  "rollup": {
    "inlineDependencies": true,
    "dts": {
      "compilerOptions": {
        "composite": false
      },
    },
    "esbuild": {
      "tsconfigRaw": {
        "compilerOptions": {
          "experimentalDecorators": true,
          "target": "ESNext"
        },
      }
    }
  }
})
