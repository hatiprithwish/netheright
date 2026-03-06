1. route.ts is the entry point of an API.
2. Create Zod type & TS type for request body in `FeatureNameApiRequest.ts`
3. Create type for response body in `FeatureNameApiResponse.ts` - All responses should extend `ApiResponse` interface. If it's a paginated list API, it should extend both `ApiResponse` and `HasMoreData` interfaces.
4. Send the body to repository.
5. All logic & data transformation happens inside repo before reaching data access layer
6. Create seperate interfaces in `FeatureNameSqlRequest.ts` file. There's should not be any optional field in these types. Only nullable fields are allowed.
7. Response body for PUT/PATCH api will always be `ApiResponse.ts`
8. Never use `any` in type
