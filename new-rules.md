1. route.ts is the entry point of an API.
2. Create Zod type & TS type for request body in `FeatureNameApiRequest.ts`
3. Create type for response body in `FeatureNameApiResponse.ts` - All responses should extend `ApiResponse` interface. If it's a paginated list API, it should extend both `ApiResponse` and `HasMoreData` interfaces.
4. Send the body to repository.
5. All logic & data transformation happens inside repo before reaching data access layer
6. Create seperate interfaces in `FeatureNameSqlRequest.ts` file. There's should not be any optional field in these types. Only nullable fields are allowed.
7. Response body for PUT/PATCH api will always be `ApiResponse.ts`
8. Never use `any`. Always make everything type-safe
9. Most of the times, define API Response interface in data access layer. Return statements for API calls should come from there. The only exception is when we need to interact with external APIs or multiple data access layers. Then define API Response interface in repository and return statements of API calls should come from there.
10. If only one where clause exist in database query, do this `.where(eq(features.is_active, true))`. If more than one where clause exists follow this pattern:

```
.where(() => {
          const conditions = [];
          conditions.push(eq(interviews.userId, params.userId));
          if (params.status) {
            conditions.push(eq(interviews.status, params.status));
          }
          return and(...conditions);
        })
```

11. This is how you should define orderBy.

```
const sortCol =
        interviews[
          params.sortColumn as keyof Pick<
            typeof interviews,
            "id" | "status" | "created_at"
          >
        ];
      const orderExpr =
        params.sortDirection === "desc" ? desc(sortCol) : asc(sortCol);
```

Then you should use `orderExpr` directly inside `orderBy`

12. This is how you should implement pagination:
    define offset: `const offset = (params.pageNo - 1) * params.pageSize;`
    query: `query.limit(params.pageSize).offset(offset)`

13. Always format fields in the query to match Api Response body so that we don't have to loop over the result to format it further.
    Example:

```
await neonDBClient
        .select({
          id: interviews.id,
          userId: interviews.user_id,
          problemId: interviews.problem_id,
          problemTitle: problems.title,
          status: interviews.status,
          statusLabel: sql<Schemas.InterviewStatusLabelEnum>`CASE
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Completed} THEN ${Schemas.InterviewStatusLabelEnum.Completed}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Abandoned} THEN ${Schemas.InterviewStatusLabelEnum.Abandoned}
            WHEN ${interviews.status} = ${Schemas.InterviewStatusIntEnum.Deleted} THEN ${Schemas.InterviewStatusLabelEnum.Deleted}
            ELSE ${Schemas.InterviewStatusLabelEnum.Active}
            END`,
          currentPhase: interviews.phase,
          currentPhaseLabel: sql<Schemas.InterviewPhaseLabelEnum>`CASE
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.BotECalculation} THEN ${Schemas.InterviewPhaseLabelEnum.BotECalculation}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.HighLevelDesign} THEN ${Schemas.InterviewPhaseLabelEnum.HighLevelDesign}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.ComponentDeepDive} THEN ${Schemas.InterviewPhaseLabelEnum.ComponentDeepDive}
            WHEN ${interviews.phase} = ${Schemas.InterviewPhaseIntEnum.BottlenecksDiscussion} THEN ${Schemas.InterviewPhaseLabelEnum.BottlenecksDiscussion}
            ELSE ${Schemas.InterviewPhaseLabelEnum.RequirementsGathering}
            END`,
          createdAt: interviews.created_at,
        })
        .from(interviews)
        .innerJoin(problems, eq(interviews.problem_id, problems.id))
        .where(eq(interviews.id, params.interviewId))
```
