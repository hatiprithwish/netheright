"use client";

import { InterviewHistoryList } from "@/frontend/ui/dashboard/components/InterviewHistoryList";
import { useInterviewHistory } from "@/frontend/ui/hooks/useInterviewHistory";
import { BarChart3, Plus } from "lucide-react";

interface DashboardContentProps {
  userName: string;
  userEmail: string;
  userImage?: string;
}

export function DashboardContent({
  userName,
  userEmail,
  userImage,
}: DashboardContentProps) {
  const { interviews, isLoading } = useInterviewHistory();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userImage && (
              <img
                src={userImage}
                alt={userName}
                className="h-16 w-16 rounded-full border-4 border-white shadow-md"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Welcome back, {userName.split(" ")[0]}!
              </h1>
              <p className="text-slate-600">{userEmail}</p>
            </div>
          </div>
          <a
            href="/interview"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Start New Interview
          </a>
        </div>

        {/* Stats Summary */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-blue-100 p-2">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Total Interviews
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {interviews.length}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-green-100 p-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                Completed
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {interviews.filter((i) => i.status === 2).length}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-full bg-yellow-100 p-2">
                <BarChart3 className="w-5 h-5 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-slate-600">
                In Progress
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {interviews.filter((i) => i.status === 1).length}
            </p>
          </div>
        </div>

        {/* Interview History */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Interview History
          </h2>
          <InterviewHistoryList interviews={interviews} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
