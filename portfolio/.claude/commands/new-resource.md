Scaffold a new API resource end-to-end matching the project's conventions.

Resource name: $ARGUMENTS

Conventions to follow (see CLAUDE.md and docs/ARCHITECTURE.md for full detail):

- Mongoose schema in `apps/api/src/schema/<name>.schema.ts` using raw `new mongoose.Schema()`, `timestamps: true`, `versionKey: false`.
- DTOs in `apps/api/src/dto/<name>.dto.ts` with `class-validator` decorators. Include: `Create<Name>Dto`, `Update<Name>Dto` (use `PartialType`), `FilterAndPagination<Name>Dto`.
- Feature module under `apps/api/src/pages/<name>s/` with `<name>s.module.ts`, `<name>s.controller.ts`, `<name>s.service.ts`. Mirror the existing `apps/api/src/pages/projects/` exactly.
- Register the module in `apps/api/src/app.module.ts`.
- Add a TypeScript interface to `libs/shared-types/src/index.ts` matching the schema.
- Mutating endpoints: `@UseGuards(AdminJwtAuthGuard)`. Read endpoints: public (unless noted otherwise).
- Always return `ResponsePayload`. Validate `:id` params with `MongoIdValidationPipe`.
- Add Swagger decorators (`@ApiTags`, `@ApiOperation`, `@ApiBearerAuth` where appropriate).

After scaffolding, run `npm run lint -w apps/api` and confirm it passes. Suggest the next step (admin CRUD page, public service in UI) but don't implement those without confirmation.
