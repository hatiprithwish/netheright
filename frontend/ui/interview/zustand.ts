import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { InterviewPhaseIntEnum } from "@/schemas";

interface InterviewState {
  sessionId: string | null;
  problemId: number | null;
  phase: InterviewPhaseIntEnum;
  maxReachedPhase: InterviewPhaseIntEnum;
  isHighLevelDesignSubmitted: boolean;
  isCompleted: boolean;
  pendingPhaseTransitionFromUser: number | null;

  // Graph State
  nodes: Node[];
  edges: Edge[];

  // Actions
  setSessionId: (id: string) => void;
  setProblemId: (id: number) => void;
  setPhase: (phase: InterviewPhaseIntEnum) => void;
  setHighLevelDesignSubmitted: (submitted: boolean) => void;
  setCompleted: (completed: boolean) => void;
  setPendingPhaseTransition: (phase: number | null) => void;
  confirmPhaseTransition: () => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      problemId: null,
      phase: InterviewPhaseIntEnum.RequirementsGathering,
      maxReachedPhase: InterviewPhaseIntEnum.RequirementsGathering,
      nodes: [],
      edges: [],
      isHighLevelDesignSubmitted: false,
      isCompleted: false,
      pendingPhaseTransitionFromUser: null,

      setSessionId: (id) => set({ sessionId: id }),
      setProblemId: (id) => set({ problemId: id }),
      setPhase: (phase) => {
        const currentMax = get().maxReachedPhase;
        if (phase > currentMax) {
          set({ phase, maxReachedPhase: phase });
        } else {
          set({ phase });
        }
      },
      setHighLevelDesignSubmitted: (submitted) =>
        set({ isHighLevelDesignSubmitted: submitted }),
      setCompleted: (completed) => set({ isCompleted: completed }),
      setPendingPhaseTransition: (phase) =>
        set({ pendingPhaseTransitionFromUser: phase }),
      confirmPhaseTransition: () => {
        const pendingPhase = get().pendingPhaseTransitionFromUser;
        if (pendingPhase !== null) {
          const currentMax = get().maxReachedPhase;
          if (pendingPhase > currentMax) {
            set({
              phase: pendingPhase,
              maxReachedPhase: pendingPhase,
              pendingPhaseTransitionFromUser: null,
            });
          } else {
            set({ phase: pendingPhase, pendingPhaseTransitionFromUser: null });
          }
        }
      },

      onNodesChange: (changes) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      setNodes: (nodes) => set({ nodes }),
      setEdges: (edges) => set({ edges }),
      addNode: (node) => set({ nodes: [...get().nodes, node] }),
      updateNodeData: (id, data) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
      },
      reset: () => {
        set({
          sessionId: null,
          problemId: null,
          phase: InterviewPhaseIntEnum.RequirementsGathering,
          maxReachedPhase: InterviewPhaseIntEnum.RequirementsGathering,
          isHighLevelDesignSubmitted: false,
          isCompleted: false,
          nodes: [],
          edges: [],
          pendingPhaseTransitionFromUser: null,
        });
        // Clear localStorage to ensure complete cleanup
        localStorage.removeItem("interview-storage");
      },
    }),
    {
      name: "interview-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
