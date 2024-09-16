import tseslint from 'typescript-eslint';
import { LintGolem } from '@magik_io/lint_golem';

export default tseslint.config(
  ...new LintGolem({
    // This is the only REQUIRED field; It should be `__dirname` or `import.meta.url`
    rootDir: import.meta.url,
    /** Optional fields */
    /** By default, it will look glob search for tsconfig.json / tsconfig.*.json in the root dir,
     * if your tsconfig is in a different location, you can specify it here */
    /** To disable type checking on specific files, you can specify them here */
    disableTypeCheckOn: [
    ],
    /** To ignore files / paths from linting, specify them here */
    ignoreGlobs: [
    ],
    /** To disable a rule, simply add it to the disabledRules array */
    disabledRules: [
      'n/no-unsupported-features/node-builtins',
      'n/no-missing-import',
      'n/no-unpublished-import',
      "@typescript-eslint/ban-types",
      "@typescript-eslint/no-explicit-any",
    ],
    /** To modify a rule just specify it in the rules object */
    rules: {
      'no-class-assign': 'warn'
    },
    /* Dont forget to end your call with `.config` */
  }).config
)
