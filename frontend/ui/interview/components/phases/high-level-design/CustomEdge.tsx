import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { useInterviewStore } from "../../../zustand";
import { X } from "lucide-react";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edges = useInterviewStore((state) => state.edges);
  const updateEdge = useInterviewStore((state) => state.setEdges);
  const { deleteElements } = useReactFlow();

  const onLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = evt.target.value;
    updateEdge(
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            label: newLabel,
          };
        }
        return edge;
      }),
    );
  };

  const onDelete = () => {
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            pointerEvents: "all",
          }}
          className="nodrag nopan flex items-center gap-1 bg-white border border-slate-200 rounded p-1 shadow-sm"
        >
          <input
            className="w-24 text-center text-xs bg-transparent outline-none text-slate-700"
            value={(label as string) || ""}
            onChange={onLabelChange}
            placeholder="Label..."
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
          <button
            onClick={onDelete}
            className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
