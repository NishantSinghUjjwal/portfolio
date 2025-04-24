"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Code, Mail, Zap, Briefcase, BookOpen } from "lucide-react";

// Add unique ID generation function
const generateUniqueId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

interface MessageOption {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  options?: MessageOption[];
}

interface ChatContextType {
  messages: ChatMessage[];
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void;
  handleUserInput: (input: string) => void;
  isTyping: boolean;
  streamingId: string | null;
  sendMessage: (content: string) => void;
  resetChat: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

interface ChatProviderProps {
  children: ReactNode;
}

interface Intent {
  patterns: string[];
  subtopics?: {
    [key: string]: string[];
  };
}

interface Intents {
  [key: string]: Intent;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [conversationContext, setConversationContext] = useState<{
    lastTopic?: string;
    mentionedProjects: string[];
    mentionedSkills: string[];
    personalInfoAsked: boolean;
    contactRequested: boolean;
    questionsAsked: number;
  }>({
    mentionedProjects: [],
    mentionedSkills: [],
    personalInfoAsked: false,
    contactRequested: false,
    questionsAsked: 0,
  });

  // Portfolio information
  const portfolioInfo = {
    name: "Nishant Singh Ujjwal",
    role: "Software Engineer / Web Developer",
    location: "Nashik, Maharashtra, India",
    education: "Computer Science",
    email: "nishantujjwal2000@gmail.com",
    linkedin: "www.linkedin.com/in/nishant-ujjwal",
    github: "github.com/nishantujjwal",
    website: "nishantujjwal.dev",
    funFact: "am self-motivated and detail-oriented",
    skills: {
      frontend: ["React.js", "Next.js", "JavaScript", "TypeScript", "Tailwind CSS"],
      backend: ["Node.js", "MongoDB", "PostgreSQL", "GraphQL"],
      devops: ["Git"],
    },
    projects: [
      {
        name: "Portfolio Website",
        description: "A modern web portfolio showcasing skills and projects with interactive features",
        techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
        liveUrl: "https://nishantujjwal.dev",
        codeUrl: "https://github.com/nishantujjwal/portfolio",
        challengesSolved: "Implemented an AI-like chat interface that helps visitors navigate the portfolio and learn about my skills and experience."
      },
      {
        name: "Project Dashboard",
        description: "A comprehensive dashboard for tracking project metrics and performance",
        techStack: ["React.js", "Node.js", "MongoDB"],
        liveUrl: "https://dashboard.example.com",
        codeUrl: "https://github.com/nishantujjwal/dashboard",
        challengesSolved: "Created responsive visualizations that work across all devices while maintaining performance."
      },
      {
        name: "Task Management App",
        description: "A cross-platform task management solution with real-time updates",
        techStack: ["React.js", "Node.js", "PostgreSQL"],
        liveUrl: "https://tasks.example.com",
        codeUrl: "https://github.com/nishantujjwal/tasks",
        challengesSolved: "Built a robust offline-first architecture that syncs when connectivity is restored."
      }
    ],
    experience: [
      {
        company: "Dynamic Tech Company",
        role: "Full Stack Developer",
        period: "2023-Present",
        achievements: ["Developed and maintained complex web applications", "Reduced API response time by 40%", "Collaborated with team members to deliver high-quality solutions"]
      }
    ],
    interests: ["Open source contribution", "Web development", "Continuous learning", "Staying current with industry trends"],
    about: "Self-motivated and detail-oriented Full Stack Software Developer with over three years of experience in web development, including one year of professional experience in a dynamic company environment. Proficient in React.js and Node.js, with a strong foundation in both frontend and backend technologies. Adept at designing, developing, and maintaining complex web applications, and committed to continuous learning and staying current with industry trends."
  };

  // Generate welcome message on initial render
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeId = generateUniqueId();
      const welcomeMessage: ChatMessage = {
        id: welcomeId,
        role: "assistant",
        content: `Hi! I'm an AI assistant for ${portfolioInfo.name}'s portfolio. I can help you explore their:

• Experience and skills
• Projects and achievements
• Contact information

What would you like to know about?`,
        timestamp: new Date().getTime(),
        options: [
          { 
            label: "Skills & Experience", 
            value: "Tell me about your skills and experience", 
            icon: <Zap className="h-4 w-4" /> 
          },
          { 
            label: "View Projects", 
            value: "Show me your projects", 
            icon: <Code className="h-4 w-4" /> 
          },
          { 
            label: "Contact Info", 
            value: "How can I contact you?", 
            icon: <Mail className="h-4 w-4" /> 
          },
        ],
      };
      setMessages([welcomeMessage]);
    }
  }, [messages.length]);

  const addMessage = useCallback((message: Omit<ChatMessage, "id" | "timestamp">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateUniqueId(),
      timestamp: new Date().getTime(),
    };
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // Initialize API integration flag
  const useApiIntegration = true; // Always try to use the API route first

  // API helper function for making chat completions requests
  const callChatApi = async (messages: any[]) => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages,
        model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8"
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Error calling API');
    }
    
    return await response.json();
  };

  // Response function with API or fallback
  const streamResponse = async (content: string, options?: MessageOption[]) => {
    const messageId = generateUniqueId();
    setStreamingId(messageId);
    setIsTyping(true);

    // Create and add the initial message
    const initialMessage: ChatMessage = {
      id: messageId,
      role: "assistant",
      content: "",
      timestamp: new Date().getTime(),
      options: undefined,
    };
    setMessages(prev => [...prev, initialMessage]);

    try {
      if (useApiIntegration) {
        // Call the API route
        const response = await callChatApi([
          {
            "role": "system", 
            "content": `You are an AI assistant for ${portfolioInfo.name}'s portfolio website. Format your response using markdown.`
          },
          {"role": "assistant", "content": content}
        ]);

        // Get the AI response
        const aiContent = response.choices[0]?.message?.content || content;
        
        // Update the message with the API response
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.id === messageId) {
            lastMessage.content = aiContent;
            lastMessage.options = options;
          }
          return newMessages;
        });
      } else {
        // Fallback to the provided content (without API)
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.id === messageId) {
            lastMessage.content = content;
            lastMessage.options = options;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error("Error in response generation:", error);
      
      // Fallback to the provided content in case of API error
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.id === messageId) {
          lastMessage.content = content;
          lastMessage.options = options;
        }
        return newMessages;
      });
    }

    // Clean up
    setIsTyping(false);
    setStreamingId(null);
  };

  const handleUserInput = useCallback((input: string) => {
    // Add user message
    addMessage({
      role: "user",
      content: input,
    });
    
    // Generate response with Together AI
    generateResponse(input);
  }, [addMessage]);

  const generateResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      if (useApiIntegration) {
        // API integration path
        // Get all previous messages for context
        const messageHistory = messages.map(msg => ({
          role: msg.role as "user" | "assistant" | "system",
          content: msg.content
        }));
        
        // Add a system message with portfolio information
        const systemMessage = {
          role: "system" as const,
          content: `You are an AI assistant for ${portfolioInfo.name}'s portfolio website. 
          
Information about ${portfolioInfo.name}:
- Role: ${portfolioInfo.role}
- Location: ${portfolioInfo.location}
- Education: ${portfolioInfo.education}
- Email: ${portfolioInfo.email}
- LinkedIn: ${portfolioInfo.linkedin}
- GitHub: ${portfolioInfo.github}
- Website: ${portfolioInfo.website}

Skills:
- Frontend: ${portfolioInfo.skills.frontend.join(", ")}
- Backend: ${portfolioInfo.skills.backend.join(", ")}
- DevOps: ${portfolioInfo.skills.devops.join(", ")}

Projects:
${portfolioInfo.projects.map(p => `- ${p.name}: ${p.description} (${p.techStack.join(", ")})`).join("\n")}

About:
${portfolioInfo.about}

Provide helpful, friendly responses about these topics. Use markdown formatting.`
        };
        
        // Create the final message array
        const completeMessageHistory = [
          systemMessage,
          ...messageHistory,
          {
            role: "user" as const, 
            content: userMessage
          }
        ];
        
        // Call the Together AI API through our API route
        const response = await callChatApi(completeMessageHistory);
        
        // Get the response from the API
        const aiContent = response.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response";
        
        // Generate appropriate options based on the content
        const options = generateOptionsFromContent(aiContent);
        
        // Add the assistant's response
        addMessage({
          role: "assistant",
          content: aiContent,
          options: options,
        });
      } else {
        // Fallback path - use simple pattern matching for demo purposes
        let response = "";
        let options: MessageOption[] = [];
        
        const query = userMessage.toLowerCase();
        
        // Simple pattern matching
        if (query.includes("skill") || query.includes("experience") || query.includes("tech")) {
          response = `I work with various technologies across the stack:

**Frontend:** ${portfolioInfo.skills.frontend.join(", ")}
**Backend:** ${portfolioInfo.skills.backend.join(", ")}
**DevOps:** ${portfolioInfo.skills.devops.join(", ")}

Would you like to know more about any specific area?`;
          options = [
            { label: "Frontend Details", value: "Tell me about your frontend skills", icon: <Code className="h-4 w-4" /> },
            { label: "Backend Details", value: "Tell me about your backend skills", icon: <Code className="h-4 w-4" /> },
            { label: "View Projects", value: "Show me your projects", icon: <Briefcase className="h-4 w-4" /> }
          ];
        } else if (query.includes("frontend")) {
          response = `In frontend development, I specialize in:

**React.js** - Building efficient, reusable UI components
**Next.js** - Server-side rendering and static site generation
**TypeScript** - Type-safe code that scales
**JavaScript** - Modern ES6+ features
**Tailwind CSS** - Utility-first responsive designs

I focus on creating responsive, accessible, and performant user interfaces with modern web technologies.`;
          options = [
            { label: "Backend Skills", value: "What about your backend skills?", icon: <Code className="h-4 w-4" /> },
            { label: "View Projects", value: "Show me your frontend projects", icon: <Briefcase className="h-4 w-4" /> }
          ];
        } else if (query.includes("backend")) {
          response = `For backend development, I work with:

**Node.js** - Server-side JavaScript runtime
**MongoDB** - NoSQL database for flexible data models
**PostgreSQL** - Robust relational database
**GraphQL** - Efficient API queries and data fetching

I have experience building scalable APIs, designing database schemas, and implementing efficient data access patterns.`;
          options = [
            { label: "Frontend Skills", value: "What frontend technologies do you use?", icon: <Code className="h-4 w-4" /> },
            { label: "View Projects", value: "Show me your backend projects", icon: <Briefcase className="h-4 w-4" /> }
          ];
        } else if (query.includes("project")) {
          response = `Here are some of my key projects:

${portfolioInfo.projects.map(project => 
`**${project.name}**
${project.description}
**Tech Stack:** ${project.techStack.join(", ")}
`).join("\n")}`;
          options = portfolioInfo.projects.map(project => ({
            label: project.name,
            value: `Tell me more about ${project.name}`,
            icon: <Briefcase className="h-4 w-4" />
          }));
        } else if (query.includes("contact")) {
          response = `You can reach me through:

📧 **Email:** ${portfolioInfo.email}
🔗 **LinkedIn:** ${portfolioInfo.linkedin}
🐙 **GitHub:** ${portfolioInfo.github}
🌐 **Website:** ${portfolioInfo.website}

Feel free to connect for professional opportunities or collaborations!`;
          options = [
            { label: "View Projects", value: "Show me your projects first", icon: <Briefcase className="h-4 w-4" /> },
            { label: "Experience", value: "Tell me about your experience", icon: <BookOpen className="h-4 w-4" /> }
          ];
        } else {
          response = `I can tell you about my skills, projects, experience, or how to get in touch. What would you like to know?`;
          options = [
            { label: "Skills", value: "Tell me about your skills", icon: <Zap className="h-4 w-4" /> },
            { label: "Projects", value: "Show me your projects", icon: <Briefcase className="h-4 w-4" /> },
            { label: "Contact", value: "How can I contact you?", icon: <Mail className="h-4 w-4" /> }
          ];
        }
        
        // Add the assistant's response
        addMessage({
          role: "assistant",
          content: response,
          options: options,
        });
      }
    } catch (error) {
      console.error("Error generating response:", error);
      
      // Fallback response in case of error
      addMessage({
        role: "assistant",
        content: "I'm sorry, I encountered an error processing your request. Please try again later.",
        options: [
          { label: "Start Over", value: "reset", icon: <Zap className="h-4 w-4" /> }
        ],
      });
    }
    
    setIsTyping(false);
  };
  
  // Helper function to generate options based on content
  const generateOptionsFromContent = (content: string): MessageOption[] => {
    const options: MessageOption[] = [];
    
    // Add skill-related options
    if (content.toLowerCase().includes("frontend") || content.toLowerCase().includes("react")) {
      options.push({ label: "Backend Skills", value: "What about your backend skills?", icon: <Code className="h-4 w-4" /> });
    }
    
    if (content.toLowerCase().includes("backend") || content.toLowerCase().includes("node")) {
      options.push({ label: "Frontend Skills", value: "Tell me about your frontend skills", icon: <Code className="h-4 w-4" /> });
    }
    
    // Add project-related options
    if (content.toLowerCase().includes("project")) {
      options.push({ label: "View All Projects", value: "Show me your projects", icon: <Briefcase className="h-4 w-4" /> });
    }
    
    // Add contact option if not already discussed
    if (!content.toLowerCase().includes("email") && !content.toLowerCase().includes("contact")) {
      options.push({ label: "Contact Info", value: "How can I contact you?", icon: <Mail className="h-4 w-4" /> });
    }
    
    // Ensure we always have at least one option
    if (options.length === 0) {
      options.push(
        { label: "Skills", value: "Tell me about your skills", icon: <Zap className="h-4 w-4" /> },
        { label: "Projects", value: "Show me your projects", icon: <Briefcase className="h-4 w-4" /> }
      );
    }
    
    return options;
  };

  const value = {
    messages,
    addMessage,
    handleUserInput,
    isTyping,
    streamingId,
    sendMessage: handleUserInput,
    resetChat: () => setConversationContext({
      mentionedProjects: [],
      mentionedSkills: [],
      personalInfoAsked: false,
      contactRequested: false,
      questionsAsked: 0,
    }),
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}; 