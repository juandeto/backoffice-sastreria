fetch git origin and stash any uncommitted changes
rebase against origin/dev, handling merge conflicts; get approval from the user for "risky" merges and ensure tests pass before continuing
apply any stashed changes over the new base
run `pnpm install`
`pnpm typecheck`, `pnpm lint:fix`, run unit tests, `pnpm format:write`
for any failing checks, perform a concise fix following repository rules
