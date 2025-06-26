"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Helper to generate stable IDs (incremental counter)
let messageIdCounter = 1;
const getNextMessageId = () => messageIdCounter++;

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

function formatAIResponse(input: string): string {
  return `🤖 I'm here to assist you with PDF summaries, questions, translations, and more! Just upload your file and ask away.`;
}

function generateSummaryFromText(text: string): string {
  const lines = text.trim().split("\n");
  const firstLines = lines.slice(0, 8).join("\n");
  return `📄 **PDF Summary Preview:**\n\n${firstLines}\n\n_You can ask more specific questions for deeper insights!_`;
}

export default function ChatbotUI() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [parsedPdfText, setParsedPdfText] = useState("");

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js";
    script.onload = () => {
      // @ts-ignore
      window["pdfjsLib"].GlobalWorkerOptions.workerSrc =
        "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js";
    };
    document.body.appendChild(script);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: getNextMessageId(),
      role: "user",
      content: input.trim(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    const inputLower = input.toLowerCase();

    const staticReply = (() => {
      if (["hi", "hello", "hey"].includes(inputLower)) {
        return "👋 Hello! How can I assist you today?";
      }
      if (inputLower.includes("who developed") || inputLower.includes("your developer")) {
        return "👩‍💻 I was developed by Anushka Midda.";
      }
      if (inputLower.includes("best feature") || inputLower.includes("what can you do")) {
        return `✨ My best features include:\n- PDF summarization\n- Question answering\n- Translation\n- Insight extraction\n\nUpload a PDF or type a question to get started!`;
      }
      if (inputLower.includes("i have a pdf") || inputLower.includes("upload pdf")) {
        return `📎 Sure! Please upload your PDF file using the file picker below. I’m ready to process it.`;
      }
      if (inputLower.includes("summarize")) {
        if (!parsedPdfText) {
          return "⚠️ Please upload a PDF first so I can summarize it.";
        }
        return generateSummaryFromText(parsedPdfText);
      }
      return null;
    })();

    if (staticReply) {
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId(),
          role: "ai",
          content: staticReply,
        },
      ]);
      setIsTyping(false);
      return;
    }

    const fullInputWithContext = `${input.trim()}\n\n[PDF Content]:\n${parsedPdfText}`;
    const formattedMessages = [
      ...messages,
      { ...userMessage, content: fullInputWithContext },
    ];

    try {
      const geminiInput = formattedMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }],
      }));

      const res = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAITYPg_usf3HRo0JGn-pFak4oYrs8ON64",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: geminiInput }),
        }
      );

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        formatAIResponse(input);

      const aiMessage: Message = {
        id: getNextMessageId(),
        role: "ai",
        content: aiText,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      console.error("Gemini Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: getNextMessageId(),
          role: "ai",
          content: "⚠️ Failed to get a response from Gemini API.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== "application/pdf") return;

    setUploadedFileName(file.name);

    const reader = new FileReader();
    reader.onload = async function () {
      const typedArray = new Uint8Array(this.result as ArrayBuffer);

      // @ts-ignore
      const pdf = await window["pdfjsLib"].getDocument(typedArray).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const strings = content.items.map((item: any) => item.str);
        text += strings.join(" ") + "\n";
      }

      setParsedPdfText(text);
      console.log("📄 PDF Extracted:\n", text);
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardContent className="flex flex-col h-[80vh]">
          <h1 className="text-2xl font-bold text-center pt-4 pb-2">My Chatbot</h1>
          <h2 className="text-lg font-semibold pb-2 text-center">Chat with Gemini</h2>

          <ScrollArea className="flex-1 overflow-y-auto border rounded-md p-4 bg-white">
            <div ref={containerRef} className="flex flex-col gap-2">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "p-3 rounded-lg max-w-[80%]",
                    msg.role === "user"
                      ? "bg-blue-100 self-end ml-auto text-right"
                      : "bg-gray-200 self-start mr-auto text-left"
                  )}
                >
                  {msg.content}
                </div>
              ))}

              {isTyping && (
                <div className="bg-gray-200 self-start p-3 italic text-sm text-gray-500 rounded-lg max-w-[80%]">
                  Typing...
                </div>
              )}

              {uploadedFileName && (
                <div className="bg-green-100 text-green-700 p-2 rounded-md max-w-[80%] self-start">
                  ✅ Uploaded: {uploadedFileName}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-2">
            <Input type="file" accept="application/pdf" onChange={handleFileUpload} />
          </div>

          <div className="mt-4 flex gap-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} disabled={isTyping}>
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
