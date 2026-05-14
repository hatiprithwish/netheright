"use client";

import { useState } from "react";
import { KeyRound, Plus, Trash2, Copy, Check, Terminal, Eye, EyeOff } from "lucide-react";
import { useGetMcpKeys, type McpKey } from "@/frontend/api/cachedQueries";
import { createMcpKey, revokeMcpKey } from "@/frontend/api/mutations";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      title="Copy"
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function NewKeyModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const [rawKey, setRawKey] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const result = await createMcpKey(name.trim());
      setRawKey(result.key);
      onCreated();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl shadow-xl p-6 w-full max-w-md mx-4">
        {rawKey ? (
          <>
            <div className="flex items-center gap-2 mb-1">
              <Check className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-bold">Key created</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Copy this key now — it won't be shown again.
            </p>
            <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2.5 mb-5 font-mono text-sm border border-border">
              <span className="flex-1 truncate select-all">
                {visible ? rawKey : "•".repeat(rawKey.length)}
              </span>
              <button
                onClick={() => setVisible((v) => !v)}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
              >
                {visible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <CopyButton text={rawKey} />
            </div>
            <div className="bg-muted/60 rounded-lg p-3 mb-5 text-xs text-muted-foreground font-mono leading-relaxed border border-border">
              <div className="flex items-center justify-between mb-1.5">
                <p className="font-semibold text-foreground font-sans text-xs">Remote MCP server URL</p>
                <CopyButton text={`${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp?key=${visible ? rawKey : "<your-key>"}`} />
              </div>
              {`${typeof window !== "undefined" ? window.location.origin : ""}/api/mcp?key=${visible ? rawKey : "<your-key>"}`}
            </div>
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-1">New API key</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Give this key a name so you can identify it later.
            </p>
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              placeholder="e.g. Claude Desktop (Personal)"
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 mb-5"
            />
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating || !name.trim()}
                className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {creating ? "Creating…" : "Create key"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const { data, isLoading, handleRefresh } = useGetMcpKeys();
  const [showModal, setShowModal] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  const keys = (data?.keys ?? []).filter((k: McpKey) => !k.revokedAt);

  const handleRevoke = async (keyId: string) => {
    setRevokingId(keyId);
    try {
      await revokeMcpKey(keyId);
      handleRefresh();
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and integrations</p>
        </div>

        {/* MCP Keys section */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          {/* Section header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <KeyRound className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h2 className="font-semibold text-foreground">MCP API Keys</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Authenticate Claude Desktop or other MCP clients
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              New key
            </button>
          </div>

          {/* How to use */}
          <div className="px-6 py-4 bg-muted/40 border-b border-border">
            <div className="flex items-start gap-2.5">
              <Terminal className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Paste the URL into claude.ai → Settings → Connectors → Add custom connector.
                No local setup needed. Your database credentials never leave the server.
              </p>
            </div>
          </div>

          {/* Key list */}
          {isLoading ? (
            <div className="px-6 py-8 space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : keys.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center px-6">
              <KeyRound className="w-10 h-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-foreground">No active keys</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create a key to connect Claude Desktop to your flashcards
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {keys.map((key: McpKey) => (
                <li key={key.id} className="flex items-center justify-between px-6 py-4 group">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{key.name}</p>
                      <p className="text-xs text-muted-foreground">
                        Created {formatDate(key.createdAt)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(key.id)}
                    disabled={revokingId === key.id}
                    title="Revoke key"
                    className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {revokingId === key.id ? "Revoking…" : "Revoke"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {showModal && (
        <NewKeyModal
          onClose={() => setShowModal(false)}
          onCreated={handleRefresh}
        />
      )}
    </div>
  );
}
