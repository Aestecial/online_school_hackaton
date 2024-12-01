"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (!inputText.trim()) return;

  setLoading(true);
  setIsTyping(true);

  const newMessage = { text: inputText, sender: "user" };
  setMessages((prevMessages) => [...prevMessages, newMessage]);

  try {
    const response = await fetch(
      `https://devayin.ru/api/ai/?text=если+просят+код+то+напиши+язык+программирования+внутри+тройных+апострофов${inputText}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = { text: data.response, sender: "ai" };
    setMessages((prevMessages) => [...prevMessages, aiMessage]);
  } catch (error) {
    console.error("Error fetching data:", error);
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: "Ошибка получения ответа", sender: "ai" },
    ]);
  } finally {
    setLoading(false);
    setIsTyping(false);
    setInputText("");
  }
};

  const renderMessage = (text) => {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            return !inline && match ? (
              <div className="code-container relative">
                <SyntaxHighlighter
                  style={tomorrow}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {codeString}
                </SyntaxHighlighter>
                <CopyToClipboard text={codeString}>
                  <button className="absolute top-2 right-2 bg-gray-200 text-gray-800 px-2 py-1 rounded hover:bg-gray-300">
                    Copy
                  </button>
                </CopyToClipboard>
              </div>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          pre({ node, className, children, ...props }) {
            return (
              <pre className={`${className} overflow-x-auto`} {...props}>
                {children}
              </pre>
            );
          },
          p({ node, className, children, ...props }) {
            return (
              <p className={`${className} break-words`} {...props}>
                {children}
              </p>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 ${
              message.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-2 rounded ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-400 text-white max-w-80vw"
              }`}
            >
              <div className="max-w-full overflow-x-auto">
                <div className="max-w-screen-md mx-auto">
                  {renderMessage(message.text)}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="my-2 text-left">
            <div className="inline-block p-2 text-white rounded bg-gray-400">
              печатает...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-white shadow-md">
        <div className="flex">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message here..."
            className="flex-grow px-4 py-2 border text-black border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
