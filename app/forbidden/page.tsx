// DONE_PRITH

import Link from "next/link";
import * as Schemas from "@/schemas";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background text-center">
      <p className="text-7xl font-bold text-muted-foreground">403</p>
      <h1 className="text-2xl font-semibold tracking-tight">Forbidden</h1>
      <p className="max-w-sm text-muted-foreground">
        You don&apos;t have access to this page.
      </p>
      <Link
        href={Schemas.AppStaticRoute.Home}
        className="mt-2 text-sm text-primary underline-offset-4 hover:underline"
      >
        Go back home
      </Link>
    </div>
  );
}
