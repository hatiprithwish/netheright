"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import { InterviewHistoryList } from "@/frontend/ui/dashboard/components/InterviewHistoryList";
import { useInterviewHistory } from "@/frontend/api/cachedQueries";
import { BarChart3, LogOut, Plus, User } from "lucide-react";
import { redirect } from "next/navigation";

interface DashboardContentProps {
  userName: string;
  userEmail: string;
  userImage?: string | null;
}

function Dashboard({ userName, userEmail, userImage }: DashboardContentProps) {
  const { interviews, isLoading } = useInterviewHistory();

  const handleSignOut = () => {
    signOut();
    redirect("/");
  };
  return (
    <div className="min-h-screen bg-brand-bg text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userImage ? (
              <Image
                src={userImage}
                alt={userName}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full border-4 border-card shadow-md"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary to-primary/80 shadow-md">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, {userName.split(" ")[0]}!
              </h1>
              <p className="text-muted-foreground">{userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-card text-card-foreground border border-border rounded-lg font-medium hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer shadow-sm hover:shadow"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
            <a
              href="/problems"
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              Start New Interview
            </a>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-card rounded-xl border border-border shadow-soft p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-blue-50 dark:bg-blue-900/20 p-2">
                <BarChart3 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Total Interviews
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {interviews.length}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-soft p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 p-2">
                <BarChart3 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Completed
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {interviews.filter((i) => i.status === 2).length}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-soft p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-amber-50 dark:bg-amber-900/20 p-2">
                <BarChart3 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                In Progress
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {interviews.filter((i) => i.status === 1).length}
            </p>
          </div>

          <div className="bg-card rounded-xl border border-border shadow-soft p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-red-50 dark:bg-red-900/20 p-2">
                <BarChart3 className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                Abandoned
              </span>
            </div>
            <p className="text-3xl font-bold text-foreground">
              {interviews.filter((i) => i.status === 3).length}
            </p>
          </div>
        </div>

        {/* Interview History */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Interview History
          </h2>
          <InterviewHistoryList interviews={interviews} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
