import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useInterviewStore } from "../../../zustand";

export const SystemNode = memo(({ id, data, isConnectable }: NodeProps) => {
  const updateNodeData = useInterviewStore((state) => state.updateNodeData);

  const handleChange = (field: string, value: string) => {
    updateNodeData(id, { [field]: value });
  };

  return (
    <div className="bg-white border-2 border-slate-200 rounded-lg shadow-sm min-w-[200px] overflow-hidden">
      {/* Target Handle (Input) */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-slate-400"
      />

      <div className="bg-slate-50 px-3 py-2 border-b border-slate-100 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          Component
        </span>
      </div>

      <div className="p-3 space-y-3">
        <div>
          <label
            htmlFor={`name-${id}`}
            className="block text-xs font-medium text-slate-700 mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id={`name-${id}`}
            type="text"
            className="w-full text-sm border-slate-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 nodrag"
            placeholder="e.g. Load Balancer"
            value={(data.name as string) || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor={`notes-${id}`}
            className="block text-xs font-medium text-slate-700 mb-1"
          >
            Notes
          </label>
          <textarea
            id={`notes-${id}`}
            className="w-full text-xs border-slate-200 rounded-md px-2 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-300 resize-none nodrag"
            rows={2}
            placeholder="Optional details..."
            value={(data.notes as string) || ""}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
        </div>
      </div>

      {/* Source Handle (Output) */}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-slate-400"
      />
    </div>
  );
});

SystemNode.displayName = "SystemNode";
