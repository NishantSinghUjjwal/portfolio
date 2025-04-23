"use client";

import React, { useRef, useEffect } from "react";
import { ModeToggle } from "@/components/mode-toggle";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronDown, PlusIcon, SendIcon } from "lucide-react";
import { useChat } from "./chat-provider";
import ReactMarkdown from "react-markdown";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  options?: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
};

export type Section = "intro" | "skills" | "projects" | "about" | "contact";

export const ChatLayout: React.FC = () => {
  const { messages, handleUserInput, isTyping } = useChat();
  const [input, setInput] = React.useState("");
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    handleUserInput(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const startNewChat = () => {
    handleUserInput("Go back to the beginning");
  };

  return (
    <div className="flex h-screen flex-col">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between border-b border-black/10 dark:border-gray-700 bg-white dark:bg-[#343541] p-2">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span className="text-sm font-medium">ChatGPT</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span className="text-sm">Saved memory full</span>
          </button>
          <button className="flex items-center gap-2 rounded-lg border border-black/10 dark:border-gray-700 p-2 hover:bg-gray-50 dark:hover:bg-gray-700">
            <span className="text-sm">Temporary</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop */}
        <div className="hidden md:flex md:w-[260px] bg-gray-50 dark:bg-[#202123] flex-col">
          {/* New chat button */}
          <div className="p-2">
            <button 
              onClick={startNewChat}
              className="flex w-full items-center gap-3 rounded-md border border-black/10 dark:border-white/20 bg-white dark:bg-transparent px-3 py-3 text-[14px] leading-normal text-black dark:text-white transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-gray-500/10"
            >
              <PlusIcon className="h-4 w-4" />
              <span>New chat</span>
            </button>
          </div>
          
          {/* Chat history */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col gap-2 px-2 py-2 text-[14px]">
              {messages.length > 0 && (
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-3 hover:bg-gray-100 dark:hover:bg-[#2A2B32] text-black dark:text-white transition-colors duration-200 cursor-pointer"
                >
                  <span className="flex-1 truncate text-left">Current Chat</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </button>
              )}
            </div>
          </div>
          
          {/* User info */}
          <div className="border-t border-black/10 dark:border-white/20 p-2">
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-[14px] text-black dark:text-white hover:bg-gray-100 dark:hover:bg-[#2A2B32] transition-colors duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-full border border-black/10 dark:border-white/20 text-black dark:text-white">
                U
              </div>
              <span className="flex-1 truncate text-left">Portfolio Chat</span>
              <ModeToggle />
            </button>
          </div>
        </div>

        {/* Main chat container */}
        <div className="relative flex flex-1 flex-col bg-white dark:bg-[#343541]">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 px-6 text-gray-800 dark:text-gray-100">
              <h1 className="mb-10 text-4xl font-semibold">What can I help with?</h1>
              <div className="w-full max-w-[600px]">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-4">
                    <button className="flex-1 rounded-xl border border-black/10 dark:border-gray-700 bg-white dark:bg-[#40414F] p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Search</span>
                      </div>
                    </button>
                    <button className="flex-1 rounded-xl border border-black/10 dark:border-gray-700 bg-white dark:bg-[#40414F] p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Reason</span>
                      </div>
                    </button>
                  </div>
                  <div className="flex gap-4">
                    <button className="flex-1 rounded-xl border border-black/10 dark:border-gray-700 bg-white dark:bg-[#40414F] p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span>Create Image</span>
                      </div>
                    </button>
                    <button className="flex-1 rounded-xl border border-black/10 dark:border-gray-700 bg-white dark:bg-[#40414F] p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center gap-2 text-sm">
                        <span>More</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.length > 0 && (
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`${
                      message.role === "assistant" ? "bg-gray-50 dark:bg-[#444654]" : "bg-white dark:bg-[#343541]"
                    } border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100`}
                  >
                    <div className="relative m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-[38rem] xl:max-w-3xl">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm ${
                        message.role === "assistant" 
                          ? "bg-[#10a37f]" 
                          : "bg-black dark:bg-[#5436DA]"
                      }`}>
                        {message.role === "assistant" ? "A" : "U"}
                      </div>
                      <div className="min-h-[20px] flex-1 whitespace-pre-wrap">
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                        
                        {message.options && message.options.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {message.options.map((option) => (
                              <Button
                                key={option.value}
                                onClick={() => handleUserInput(option.value)}
                                className="inline-flex items-center gap-2 rounded-md border border-black/10 dark:border-white/20 bg-white dark:bg-transparent px-3 py-2 text-sm text-black dark:text-white hover:bg-gray-50 dark:hover:bg-[#2A2B32] transition-colors duration-200"
                              >
                                {option.icon}
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="bg-gray-50 dark:bg-[#444654] border-b border-black/10 dark:border-gray-900/50 text-gray-800 dark:text-gray-100">
                    <div className="relative m-auto flex gap-4 p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-[38rem] xl:max-w-3xl">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-sm bg-[#10a37f]">
                        A
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                        <div 
                          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                          style={{ animationDelay: "0.2s" }}
                        />
                        <div 
                          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" 
                          style={{ animationDelay: "0.4s" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className="relative mx-auto w-full max-w-4xl px-4 pt-6 pb-24">
            <div className="flex flex-col items-center">
              <div className="relative w-full">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything"
                  rows={1}
                  className="min-h-[44px] w-full resize-none bg-white dark:bg-[#40414F] rounded-xl border border-black/10 dark:border-white/20 pl-4 pr-12 py-[10px] text-black dark:text-white focus:border-black/20 dark:focus:border-white/40 focus:ring-0 focus-visible:ring-0 sm:text-sm shadow-[0_0_10px_rgba(0,0,0,0.10)]"
                />
                <div className="absolute right-2 bottom-2.5 flex gap-2">
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={!input.trim()}
                    className="h-8 w-8 rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-600 text-black dark:text-white disabled:hover:bg-transparent disabled:opacity-40"
                    variant="ghost"
                  >
                    <SendIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 