module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['plugin:react/recommended', 'standard'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: ['react'],
    ignorePatterns: ['/dist/*'],
    rules: {
        indent: ['error', 4],
        semi: ['error', 'never'],
        quotes: ['error', 'single'],
        'no-tabs': 0,
        curly: [2, 'all']
    }
}
