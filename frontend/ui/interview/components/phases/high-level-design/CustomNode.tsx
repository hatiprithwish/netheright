import { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { useInterviewStore } from "../../../zustand";
import { Trash2 } from "lucide-react";

export const CustomNode = memo(({ id, data, isConnectable }: NodeProps) => {
  const updateNodeData = useInterviewStore((state) => state.updateNodeData);
  const { deleteElements } = useReactFlow();

  const handleChange = (field: string, value: string) => {
    updateNodeData(id, { [field]: value });
  };

  const handleDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };

  return (
    <div className="bg-card text-card-foreground border-2 border-border rounded-lg shadow-sm min-w-[200px] overflow-hidden relative group">
      {/* Target Handle (Input) */}
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 !bg-muted-foreground"
      />

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-red-500 transition-colors cursor-pointer"
          onClick={handleDelete}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="p-3 space-y-3 pt-6">
        <div>
          <label
            htmlFor={`name-${id}`}
            className="block text-xs font-medium text-foreground mb-1"
          >
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id={`name-${id}`}
            type="text"
            className="w-full text-sm bg-muted/50 border border-border rounded-md px-2 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground nodrag"
            placeholder="e.g. Load Balancer"
            value={(data.name as string) || ""}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor={`notes-${id}`}
            className="block text-xs font-medium text-foreground mb-1"
          >
            Notes
          </label>
          <textarea
            id={`notes-${id}`}
            className="w-full text-xs bg-muted/50 border border-border rounded-md px-2 py-1 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-muted-foreground resize-none nodrag"
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
        className="w-3 h-3 !bg-muted-foreground"
      />
    </div>
  );
});

CustomNode.displayName = "SystemNode";
