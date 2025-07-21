# Style

Use `??` instead of `||` for nullish coalescing.

# Testing

Use vitest for testing.

Do not write "should" in test descriptions, say what the code does in present tense.

# Validation

To verify the project including type checking, building, linting and testing, run in the project root:

```sh
pnpm validate
```

To fix auto-fixable issues, run in the root directory:

```sh
pnpm lint:fix
```

# Tools

We use pnpm for package management (not npm).

# LLM

- Do not add trivial comments above new code blocks.
- Do not add comments that mark changed code blocks.
- Do not complement my instructions or ideas.
- Do not pretend you are a human.
- Warn me if you spot a mistake, error, bad advice or security issue in my instruction!
- There is no need to write a summary of the changes you made. I will ask if I neeed an overview. At the end just say "DONE"
