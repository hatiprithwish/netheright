"use client";

import { memo, useState } from "react";
import { Handle, Position, type NodeProps, type Node } from "@xyflow/react";
import { Edit2, Save, X } from "lucide-react";

export type CustomNodeData = {
  name: string;
  notes: string;
};

export type CustomNode = Node<CustomNodeData, 'custom'>;

function CustomNodeComponent({ data, selected }: NodeProps<CustomNode>) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(data.name);
  const [notes, setNotes] = useState(data.notes);

  const handleSave = () => {
    data.name = name;
    data.notes = notes;
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(data.name);
    setNotes(data.notes);
    setIsEditing(false);
  };

  return (
    <div
      className={`rounded-lg border-2 bg-white shadow-lg transition-all dark:bg-zinc-900 ${
        selected ? "border-blue-500 shadow-xl" : "border-zinc-300 dark:border-zinc-700"
      }`}
      style={{ minWidth: "200px", maxWidth: "300px" }}
    >
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !h-3 !w-3 !border-2 !border-white"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-500 !h-3 !w-3 !border-2 !border-white"
      />

      {/* Node Content */}
      <div className="p-3">
        {/* Header with Edit Button */}
        <div className="mb-2 flex items-center justify-between">
          {isEditing ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 rounded border border-zinc-300 px-2 py-1 text-sm font-semibold text-zinc-900 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-50"
              placeholder="Node name"
              autoFocus
            />
          ) : (
            <h3 className="flex-1 text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              {name || "Untitled Node"}
            </h3>
          )}
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-2 rounded p-1 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
            >
              <Edit2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Notes Section */}
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded border border-zinc-300 px-2 py-1 text-xs text-zinc-700 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
              placeholder="Add notes..."
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
              >
                <Save className="h-3 w-3" />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex flex-1 items-center justify-center gap-1 rounded bg-zinc-500 px-2 py-1 text-xs font-medium text-white hover:bg-zinc-600"
              >
                <X className="h-3 w-3" />
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            {notes || "No notes"}
          </p>
        )}
      </div>
    </div>
  );
}

export default memo(CustomNodeComponent);
