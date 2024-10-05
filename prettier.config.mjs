/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  plugins: ['@ianvs/prettier-plugin-sort-imports', 'prettier-plugin-tailwindcss'],
  tailwindFunctions: ['clsx', 'cva', 'ctl', 'tw', 'cn'],

  trailingComma: 'es5',
  tabWidth: 2,
  singleQuote: true,
  jsxSingleQuote: true,
  printWidth: 80,

  importOrder: ['^react$', '', '<THIRD_PARTY_MODULES>', '', '^@/', '^~/', '^@/(.*)$', '^[./]'],
}

export default config
