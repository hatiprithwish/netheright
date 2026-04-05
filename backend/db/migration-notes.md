1. Make sure `tables.ts` is updated with the latest schema changes.
2. Run `pnpm db:generate` to generate the migration file.
3. Run `pnpm db:migrate` to apply the migration to the database. (For prod migration, change the DATABASE_URL to point to the prod database)
4. (Only for new enviorment setup): Execute `data_setup.sql` to setup the initial data.
