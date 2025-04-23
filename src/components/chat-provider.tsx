"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from "react";
import { Bot, Code, Mail, User, Zap, Briefcase, BookOpen } from "lucide-react";

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
      backend: ["Node.js", "MongoDB", "PostgreSQL"],
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
      const welcomeMessage: ChatMessage = {
        id: "welcome",
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
    console.log(newMessage);
    setMessages((prev) => [...prev, newMessage]);
  }, []);

  // Simulated streaming response
  const streamResponse = async (content: string, options?: MessageOption[]) => {
    const messageId = generateUniqueId();
    setStreamingId(messageId);
    setIsTyping(true);

    let streamedContent = '';
    const words = content.split(' ');
    
    // Create and add the initial message
    const initialMessage: ChatMessage = {
      id: messageId,
      role: "assistant",
      content: "",
      timestamp: new Date().getTime(),
      options: undefined,
    };
    setMessages(prev => [...prev, initialMessage]);

    // Stream the content
    for (let i = 0; i < words.length; i++) {
      streamedContent += (i === 0 ? '' : ' ') + words[i];
      
      // Update the message content
      setMessages(prev => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.id === messageId) {
          lastMessage.content = streamedContent + (i === words.length - 1 ? '' : '▋');
          if (i === words.length - 1) {
            lastMessage.options = options;
          }
        }
        return newMessages;
      });

      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 30));
    }

    // Clean up
    setIsTyping(false);
    setStreamingId(null);
  };

  const generateResponse = async (userMessage: string) => {
    setIsTyping(true);
    
    const query = userMessage.toLowerCase();
    const updatedContext = { ...conversationContext };
    updatedContext.questionsAsked += 1;

    // Intent recognition system
    const intents: Intents = {
      skills: {
        patterns: ['skills', 'good at', 'know', 'technologies', 'tech stack', 'abilities', 'can do', 'proficient', 'experience'],
        subtopics: {
          frontend: ['front', 'frontend', 'ui', 'react', 'javascript', 'typescript', 'css', 'html', 'tailwind'],
          backend: ['back', 'backend', 'server', 'database', 'api', 'node', 'express', 'sql', 'postgres', 'mongodb'],
          devops: ['devops', 'deployment', 'git', 'version control']
        }
      },
      projects: {
        patterns: ['project', 'portfolio', 'work', 'built', 'created', 'developed', 'showcase', 'github', 'demo'],
        subtopics: {
          portfolio: ['portfolio', 'website', 'portfolio website', 'portfolio site'],
          dashboard: ['dashboard', 'project dashboard', 'metrics', 'performance', 'visualization'],
          taskapp: ['task', 'management', 'app', 'task app', 'todo']
        }
      },
      contact: {
        patterns: ['contact', 'email', 'reach out', 'connect', 'linkedin', 'github', 'social', 'dm', 'message']
      },
      personal: {
        patterns: ['yourself', 'about you', 'background', 'interests', 'hobbies', 'passion', 'who are you', 'tell me about']
      },
      reset: {
        patterns: ['reset', 'start over', 'beginning', 'restart', 'start again', 'go back', 'fresh']
      }
    };

    // Detect intent and subtopic
    let detectedIntent = 'unknown';
    let subtopic = '';
    let highestScore = 0;

    Object.entries(intents).forEach(([intent, data]) => {
      const patterns = data.patterns;
      patterns.forEach(pattern => {
        if (query.includes(pattern)) {
          const score = pattern.length / query.length * 2;
          if (score > highestScore) {
            highestScore = score;
            detectedIntent = intent;
          }
        }
      });

      if (data.subtopics) {
        Object.entries(data.subtopics).forEach(([sub, subPatterns]) => {
          subPatterns.forEach((pattern: string) => {
            if (query.includes(pattern)) {
              const score = pattern.length / query.length * 2.5;
              if (score > highestScore) {
                highestScore = score;
                detectedIntent = intent;
                subtopic = sub;
              }
            }
          });
        });
      }
    });

    // Update conversation context
    updatedContext.lastTopic = detectedIntent;
    if (detectedIntent === 'personal') updatedContext.personalInfoAsked = true;
    if (detectedIntent === 'contact') updatedContext.contactRequested = true;

    setConversationContext(updatedContext);

    let response = '';
    let options: MessageOption[] = [];

    // Generate response based on intent
    switch (detectedIntent) {
      case 'skills':
        if (subtopic === 'frontend') {
          response = `In frontend development, I specialize in ${portfolioInfo.skills.frontend.join(", ")}. I focus on creating responsive, accessible, and performant user interfaces with modern web technologies.`;
          options = [
            { label: "Backend Skills", value: "What about your backend skills?", icon: <Code className="h-4 w-4" /> },
            { label: "View Projects", value: "Show me your frontend projects", icon: <Briefcase className="h-4 w-4" /> }
          ];
        } else if (subtopic === 'backend') {
          response = `For backend development, I work with ${portfolioInfo.skills.backend.join(", ")}. I have experience building scalable APIs and working with various database systems.`;
          options = [
            { label: "Frontend Skills", value: "What frontend technologies do you use?", icon: <Code className="h-4 w-4" /> },
            { label: "View Projects", value: "Show me your backend projects", icon: <Briefcase className="h-4 w-4" /> }
          ];
        } else {
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
        }
        break;

      case 'projects':
        if (subtopic === 'portfolio') {
          const project = portfolioInfo.projects.find(p => p.name === "Portfolio Website")!;
          response = `**${project.name}**

${project.description}

**Tech Stack:** ${project.techStack.join(", ")}
**Key Achievement:** ${project.challengesSolved}

You can view the [live site](${project.liveUrl}) or check out the [source code](${project.codeUrl}).`;
          options = [
            { label: "Other Projects", value: "What other projects have you worked on?", icon: <Briefcase className="h-4 w-4" /> },
            { label: "Tech Stack", value: "Tell me more about the tech stack", icon: <Code className="h-4 w-4" /> }
          ];
        } else {
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
        }
        break;

      case 'contact':
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
        break;

      case 'personal':
        response = `I'm ${portfolioInfo.name}, a ${portfolioInfo.role} based in ${portfolioInfo.location}.

${portfolioInfo.about}

I'm passionate about ${portfolioInfo.interests.join(", ")}.`;
        options = [
          { label: "Skills", value: "What are your technical skills?", icon: <Zap className="h-4 w-4" /> },
          { label: "Projects", value: "Show me your projects", icon: <Briefcase className="h-4 w-4" /> },
          { label: "Contact", value: "How can I contact you?", icon: <Mail className="h-4 w-4" /> }
        ];
        break;

      case 'reset':
        setConversationContext({
          mentionedProjects: [],
          mentionedSkills: [],
          personalInfoAsked: false,
          contactRequested: false,
          questionsAsked: 0,
        });

        response = `Let's start fresh! I can help you explore:

• Experience and skills
• Projects and achievements
• Contact information

What would you like to know about?`;
        options = [
          { label: "Skills & Experience", value: "Tell me about your skills and experience", icon: <Zap className="h-4 w-4" /> },
          { label: "View Projects", value: "Show me your projects", icon: <Code className="h-4 w-4" /> },
          { label: "Contact Info", value: "How can I contact you?", icon: <Mail className="h-4 w-4" /> }
        ];
        break;

      default:
        if (updatedContext.questionsAsked === 1) {
          response = `I'm here to help you learn about my experience as a ${portfolioInfo.role}. You can ask about my skills, projects, or how to get in touch. What interests you?`;
        } else if (updatedContext.lastTopic) {
          response = `I'm not sure I understood that. We were discussing ${updatedContext.lastTopic}. Would you like to know more about that or something else?`;
        } else {
          response = `I can tell you about my skills, projects, experience, or how to get in touch. What would you like to know?`;
        }
        options = [
          { label: "Skills", value: "Tell me about your skills", icon: <Zap className="h-4 w-4" /> },
          { label: "Projects", value: "Show me your projects", icon: <Briefcase className="h-4 w-4" /> },
          { label: "Contact", value: "How can I contact you?", icon: <Mail className="h-4 w-4" /> }
        ];
        break;
    }

    // Stream the response
    await streamResponse(response, options);
  };

  const handleUserInput = useCallback((input: string) => {
    // Add user message
    addMessage({
      role: "user",
      content: input,
    });
    
    // Generate response
    generateResponse(input);
  }, [addMessage, conversationContext]);

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