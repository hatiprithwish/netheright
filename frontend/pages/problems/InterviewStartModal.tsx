"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createInterviewSession } from "@/frontend/api/mutations";
import { Loader2, ArrowRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/frontend/hooks/useAuth";
import { Button } from "@/frontend/components/shadcn/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/frontend/components/shadcn/dialog";
import { INTERVIEW_PHASES } from "./utils";

interface InterviewStartModalProps {
  problemId: number;
  problemTitle: string;
  onClose: () => void;
}

export function InterviewStartModal({
  problemId,
  problemTitle,
  onClose,
}: InterviewStartModalProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isCreating, setIsCreating] = useState(false);

  const handleStartInterview = async () => {
    if (!isAuthenticated) {
      return toast.error("Please sign in before attending an interview");
    }

    setIsCreating(true);
    try {
      const response = await createInterviewSession({ problemId });
      if (response?.interview) {
        router.push(`/interview/${problemId}/${response.interview.id}`);
      }
    } catch (err) {
      toast.error("Failed to start interview. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl p-0 gap-0 border-border bg-card overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-card border-b border-border px-6 py-4 flex flex-row items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1 text-left pointer-events-auto">
            <DialogTitle className="text-2xl font-bold text-foreground">
              Start Interview: {problemTitle}
            </DialogTitle>
            <DialogDescription className="flex items-center gap-2 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Estimated time: ~45 mins</span>
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[80vh]">
          <div className="bg-secondary/30 rounded-lg p-6 border border-border space-y-4">
            <h3 className="font-semibold">What to expect:</h3>

            {INTERVIEW_PHASES.map((phase, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div
                  className={`shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${phase.colorClass}`}
                >
                  <phase.icon className="w-5 h-5" />
                </div>
                <div className="pt-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    Phase {idx + 1}
                  </p>
                  <p className="text-sm text-foreground/80 leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={handleStartInterview}
            disabled={isCreating}
            size="lg"
            className="w-full py-6 font-semibold text-lg shadow-lg active:scale-[0.98]"
          >
            {isCreating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" /> Starting...
              </>
            ) : (
              <>
                Begin Session <ArrowRight className="ml-2 w-5 h-5" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
