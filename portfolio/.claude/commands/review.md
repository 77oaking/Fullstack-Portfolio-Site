Run a thorough review on the working tree.

Steps:

1. Run `npm run lint` and report any failures.
2. Run `npm run test --workspaces --if-present` and report any failures.
3. Run `git diff --stat` and `git diff` to see what's changed; summarize the diff in 5 sentences.
4. Look for obvious issues: hard-coded secrets, hard-coded colors instead of CSS vars, missing guards on admin endpoints, missing `MongoIdValidationPipe` on `:id` params, missing Swagger decorators on new endpoints, schema/DTO/interface drift between apps.
5. List concrete fix suggestions. Don't auto-fix without permission.
