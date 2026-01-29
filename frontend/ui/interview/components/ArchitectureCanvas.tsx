"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useInterviewStore } from "../zustand";
// import { Button } from "@/components/ui/button"; // Assuming ui components exist, or I should use html button
import { Plus, Trash2, Wand2 } from "lucide-react";
import { sdiService } from "../server/sdi.service"; // Wait, can't import server service in client component

// We need an API call for analysis, not direct service import
// So I will just add the button UI here and let the parent handle the analysis or call fetch directly.

export function ArchitectureCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setEdges,
    addNode,
    setNodes,
  } = useInterviewStore();

  const onConnect = useCallback(
    (params: Connection) => setEdges(addEdge(params, edges)),
    [edges, setEdges],
  );

  const handleAddNode = () => {
    const id = `node-${nodes.length + 1}`;
    const newNode: Node = {
      id,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: `Component ${nodes.length + 1}` },
      // type: 'custom' // if we implemented custom node
    };
    addNode(newNode);
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
  };

  return (
    <div className="h-full w-full bg-slate-50 border rounded-xl overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />

        <Panel position="top-right" className="flex gap-2">
          <button
            onClick={handleAddNode}
            className="bg-white p-2 rounded shadow-md hover:bg-slate-50 border"
            title="Add Node"
          >
            <Plus className="w-5 h-5 text-slate-700" />
          </button>
          <button
            onClick={clearCanvas}
            className="bg-white p-2 rounded shadow-md hover:bg-slate-50 border"
            title="Clear Canvas"
          >
            <Trash2 className="w-5 h-5 text-red-500" />
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
}
