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
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-2xl w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center space-y-8">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-6">
              <CheckCircle2 className="w-16 h-16 text-green-600" />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold text-slate-900">
              Interview Completed!
            </h1>
            <p className="text-lg text-slate-600">
              Great job! Your interview session has been successfully completed.
            </p>
          </div>

          {/* Description */}
          <div className="bg-slate-50 rounded-xl p-6 space-y-3">
            <p className="text-slate-700">
              Your performance has been evaluated and a detailed scorecard has
              been generated. You can view your results and feedback in your
              dashboard.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={handleGoToDashboard}
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-md hover:shadow-lg"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
