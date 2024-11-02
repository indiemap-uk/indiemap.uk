import eslint from '@eslint/js'
import prettier from 'eslint-config-prettier'
import perfectionist from 'eslint-plugin-perfectionist'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommendedTypeChecked,
	{
		languageOptions: {
			parserOptions: {
				extraFileExtensions: ['.svelte'],
				projectService: true,
				tsconfigRootDir: import.meta.dirname,
			},
		},
	},
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	perfectionist.configs['recommended-natural'],
	{
		rules: {
			'@typescript-eslint/await-thenable': 'error',
			'@typescript-eslint/no-floating-promises': 'error',
			// Turning off all no-unsafe-* as they keep reporting nonsense 😡
			'@typescript-eslint/no-unsafe-argument': 'off',
			'@typescript-eslint/no-unsafe-assignment': 'off',
			'@typescript-eslint/no-unsafe-call': 'off',
			// no unused is turned off as TS already checks this
			'@typescript-eslint/no-unused-vars': 'off',
		},
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: tseslint.parser,
			},
		},
	},
	// Disable type-related checks in .js files
	{
		extends: [tseslint.configs.disableTypeChecked],
		files: ['**/*.js'],
	},
	{
		ignores: ['**/build/', '**/.svelte-kit/', '**/dist/', '**/zapatos/schema.d.ts'],
	},
)
