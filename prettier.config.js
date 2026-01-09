/** @type {import("prettier").Config} */
module.exports = {
    semi: true,
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 120,
    tabWidth: 4,
    useTabs: false,
    bracketSpacing: true,
    arrowParens: 'avoid',
    endOfLine: 'auto',
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            options: {
                parser: 'typescript',
            },
        },
        {
            files: ['*.spec.ts', '*.test.ts'],
            options: {
                printWidth: 120,
            },
        },
    ],
};