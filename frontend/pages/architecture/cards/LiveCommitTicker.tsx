import { GitCommit } from "lucide-react";

export function LiveCommitTicker() {
  // In a real implementation, this would fetch from GitHub API
  const latestCommit = {
    message: "refactor: optimize vector embeddings",
    timeAgo: "4 hours ago",
  };

  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-2 text-sm">
      <GitCommit className="h-4 w-4 text-primary" />
      <span className="font-medium">Latest Commit:</span>
      <span className="text-muted-foreground">
        &quot;{latestCommit.message}&quot;
      </span>
      <span className="text-xs text-muted-foreground">
        - {latestCommit.timeAgo}
      </span>
    </div>
  );
}
