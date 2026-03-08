export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isStreaming?: boolean;   // ← add only if missing
};