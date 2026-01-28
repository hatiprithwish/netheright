"use client";

import { useChat } from "@ai-sdk/react";
import { useSdiStore } from "../../zustand";
import { ArchitectureCanvas } from "../ArchitectureCanvas";
import { useRef, useEffect } from "react";
import { Send } from "lucide-react";

export function DeepDiveStep() {
  const { sessionId } = useSdiStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/sdi/chat",
    body: {
      sessionId,
      phase: "deep_dive",
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full gap-4">
      <div className="w-1/3 flex flex-col bg-slate-50 border rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b bg-amber-50">
          <h2 className="font-semibold text-lg text-amber-900">Phase 3: Deep Dive</h2>
          <p className="text-sm text-amber-700">Defend your design choices under scrutiny.</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
          {messages.length === 0 && (
             <div className="text-center text-muted-foreground py-10">
               <p>The interviewer will now grill you on specific components.</p>
             </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex items-start gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                 <div className={`p-3 rounded-lg text-sm ${m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white border'}`}>
                    {m.content}
                 </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white border-t">
           <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              className="flex-1 bg-slate-50 border rounded-md px-3 py-2 text-sm"
              value={input}
              onChange={handleInputChange}
              placeholder="Defend your design..."
            />
            <button type="submit" className="bg-primary text-primary-foreground px-3 rounded-md">
                <Send className="w-4 h-4" />
            </button>
           </form>
        </div>
      </div>

      <div className="flex-1 relative">
         <ArchitectureCanvas />
      </div>
    </div>
  );
}
