import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "../zustand";

export function InterviewCompletionScreen() {
  const router = useRouter();
  const reset = useInterviewStore((state) => state.reset);

  const handleGoToDashboard = () => {
    reset();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full mx-auto flex items-center justify-center">
        <div className="bg-card border border-border rounded-2xl shadow-xl p-12 text-center space-y-8 w-full">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-6 flex items-center justify-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-foreground">
              Interview Completed!
            </h1>
            <p className="text-lg text-muted-foreground">
              Great job! Your interview session has been successfully completed.
            </p>
          </div>

          {/* Description */}
          <div className="bg-muted rounded-xl p-6 space-y-3">
            <p className="text-muted-foreground">
              Your performance has been evaluated and a detailed scorecard has
              been generated. You can view your results and feedback in your
              dashboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={handleGoToDashboard}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
