import { create } from "zustand";
import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

interface InterviewState {
  // Graph canvas state only (high-interactivity UI)
  nodes: Node[];
  edges: Edge[];
  isHighLevelDesignSubmitted: boolean;

  // Actions
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: Record<string, unknown>) => void;
  setHighLevelDesignSubmitted: (submitted: boolean) => void;
  reset: () => void;
}

export const useInterviewStore = create<InterviewState>((set, get) => ({
  nodes: [],
  edges: [],
  isHighLevelDesignSubmitted: false,

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
  setHighLevelDesignSubmitted: (submitted) =>
    set({ isHighLevelDesignSubmitted: submitted }),
  reset: () => {
    set({
      nodes: [],
      edges: [],
      isHighLevelDesignSubmitted: false, // Reset submission status too
    });
  },
}));
