import { marked } from "marked";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Message } from "./interface";
import { handleSend } from "./api";

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const q1 = "How many People logged in the today?",
    q2 = "What were the actions taken last week?";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", parts: [{ text: input }] };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    await handleSend(input, messages, setMessages).finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-window">
        {messages.map((msg, index) => {
          const messageText = msg.parts[0]?.text;
          if (!messageText) return null;

          return (
            <div key={index} className={`chat-bubble ${msg.role}`}>
              <div
                dangerouslySetInnerHTML={{ __html: marked.parse(messageText) }}
              />
            </div>
          );
        })}
        {isLoading && (
          <div className="chat-bubble model">
            <div className="loading-dots">
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <div className="sample_questions">
        <div
          className="question_bubble"
          onClick={() => {
            setInput(q1);
          }}
        >
          {q1}
        </div>
        <div
          className="question_bubble"
          onClick={() => {
            setInput(q2);
          }}
        >
          {q2}
        </div>
      </div>
      <form className="chat-input-form" onSubmit={handleSendHandler}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the IFM Dashboard..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
}
