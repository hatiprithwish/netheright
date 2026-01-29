import { create } from "zustand";
import { persist } from "zustand/middleware";
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
  phase: InterviewPhaseIntEnum;

  // Graph State
  nodes: Node[];
  edges: Edge[];

  // Actions
  setSessionId: (id: string) => void;
  setPhase: (phase: InterviewPhaseIntEnum) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>()(
  persist(
    (set, get) => ({
      sessionId: null,
      phase: InterviewPhaseIntEnum.RequirementsGathering,
      nodes: [],
      edges: [],

      setSessionId: (id) => set({ sessionId: id }),
      setPhase: (phase) => set({ phase }),

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
      reset: () =>
        set({
          sessionId: null,
          phase: InterviewPhaseIntEnum.RequirementsGathering,
          nodes: [],
          edges: [],
        }),
    }),
    {
      name: "interview-storage",
    },
  ),
);
