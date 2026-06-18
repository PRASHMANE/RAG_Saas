import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";

import { getCurrentUser } from "../api/auth";
import { askQuestion } from "../api/chat";

import { useAuthStore } from "../store/authStore";
import { useDocumentStore } from "../store/documentStore";

export default function Chat() {
  const setUser = useAuthStore((state) => state.setUser);

  const selectedDocument = useDocumentStore(
    (state) => state.selectedDocument
  );

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await getCurrentUser();
        setUser(user);
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };

    loadUser();
  }, [setUser]);

  const handleSend = async () => {
    const trimmed = question.trim();

    if (!trimmed || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: trimmed,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const response = await askQuestion(trimmed);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto px-6 py-10">
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 ? (
              <div className="text-center text-zinc-400">
                {selectedDocument
                  ? `Ask questions about ${selectedDocument.filename}`
                  : "Upload a PDF to start chatting"}
              </div>
            ) : (
              messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.role === "user"
                        ? "bg-[#303030]"
                        : "bg-[#2a2a2a]"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-[#2a2a2a] px-4 py-3 text-zinc-400">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800 p-4">
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-[#303030] p-3">
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={loading}
              className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
              placeholder={
                selectedDocument
                  ? "Ask about your PDF..."
                  : "Upload a PDF first..."
              }
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="rounded-lg bg-[#10a37f] px-4 py-2 disabled:opacity-50"
            >
              ➤
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}