import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm here to help you learn about ghost asset recovery and capital recovery. What questions do you have?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sendMessageMutation = trpc.chatbot.sendMessage.useMutation();

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        message: userMessage,
        conversationHistory: messages,
      });

      if (response.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: response.message },
        ]);

        // Show lead captured notification
        if (response.leadSubmitted) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content: `Great! I've captured your email (${response.leadEmail}) and our team will reach out shortly.`,
            },
          ]);
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ]);
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 rounded-full p-4 shadow-lg transition-all hover:scale-110"
        style={{
          background: "#0D9488",
          color: "white",
        }}
        aria-label="Open chatbot"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-40 flex flex-col rounded-lg shadow-2xl"
          style={{
            width: "380px",
            height: "500px",
            background: "white",
            border: "1px solid #E2E8F0",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-4 rounded-t-lg text-white"
            style={{ background: "#1E3A5F" }}
          >
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", fontWeight: 700 }}>
              Legacy Asset Intelligence
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:opacity-80"
              aria-label="Close chatbot"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto p-4 space-y-3"
            style={{ background: "#F8FAFC" }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className="max-w-xs rounded-lg px-3 py-2 text-sm"
                  style={{
                    background: msg.role === "user" ? "#0D9488" : "white",
                    color: msg.role === "user" ? "white" : "#1E293B",
                    border: msg.role === "assistant" ? "1px solid #E2E8F0" : "none",
                    fontFamily: "'Source Sans 3', sans-serif",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div
                  className="rounded-lg px-3 py-2"
                  style={{ background: "white", border: "1px solid #E2E8F0" }}
                >
                  <span style={{ color: "#64748B", fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.9rem" }}>
                    Typing...
                  </span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div
            className="flex gap-2 p-3 border-t"
            style={{ borderColor: "#E2E8F0" }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded border text-sm focus:outline-none focus:ring-2"
              style={{
                borderColor: "#E2E8F0",
                fontFamily: "'Source Sans 3', sans-serif",
                "--tw-ring-color": "#0D9488",
              } as React.CSSProperties}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="p-2 rounded transition-colors"
              style={{
                background: isLoading || !input.trim() ? "#CBD5E1" : "#0D9488",
                color: "white",
              }}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
