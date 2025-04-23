# PortfolioGPT

An interactive, chat-based portfolio website built with Next.js, TypeScript, and shadcn/ui. This portfolio is designed to look and feel exactly like ChatGPT, providing an engaging way to showcase your skills, projects, and information through a familiar AI chat interface.

## Features

- 💬 Interactive chat interface identical to ChatGPT
- 🔄 Real-time response streaming effect
- 🎨 Dark/light mode theming
- 💻 Fully responsive design with mobile sidebar
- ⚙️ Easy customization
- 🚀 Built with modern technologies (Next.js, TypeScript, Tailwind CSS)
- 🎮 Fun easter eggs and surprises

## Preview

The interface mimics ChatGPT with:
- A dark sidebar navigation
- Conversation history
- Message streaming effect
- User/AI message styling
- Responsive mobile design
- Theme switching

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfoliogpt.git
   cd portfoliogpt
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Customization

### Personalize Your Portfolio

Edit the `portfolioInfo` object in `src/components/chat-provider.tsx`:

```typescript
const portfolioInfo = {
  name: "Your Name",
  role: "Your Role",
  location: "Your Location",
  education: "Your Education",
  email: "your.email@example.com",
  linkedin: "linkedin.com/in/yourprofile",
  github: "github.com/yourusername",
  website: "yourwebsite.com",
  funFact: "something interesting about you",
  
  // Edit your skills
  skills: {
    frontend: ["React", "TypeScript", "Next.js", "etc."],
    backend: ["Node.js", "Express", "etc."],
    devops: ["Docker", "AWS", "etc."],
  },
  
  // Edit your projects
  projects: [
    {
      name: "Project Name",
      description: "Project description",
      techStack: ["Tech1", "Tech2", "Tech3"],
      liveUrl: "https://project-url.com",
      codeUrl: "https://github.com/yourusername/project",
    },
    // Add more projects...
  ]
};
```

### Chat Responses and Text Streaming

The portfolio uses a text streaming effect similar to ChatGPT to make responses appear more natural. You can adjust:

- Streaming speed in the `streamText` function
- Response content and options in the various response functions
- Add additional conversation paths in the `processInput` function

### Customize Theming

This project uses shadcn/ui components with Tailwind CSS. You can customize the theme by editing:

- `src/app/globals.css` - For CSS variables and global styles
- `tailwind.config.js` - For Tailwind configuration

## Deployment

Deploy your portfolio to Vercel:

1. Push your code to a GitHub repository
2. Import the repository in Vercel
3. Deploy

## Inspiration

This project was inspired by ChatGPT's user interface, bringing the familiar and engaging conversational experience to a personal portfolio.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by [OpenAI's ChatGPT](https://chat.openai.com/)

# Portfolio Chat with OpenAI Integration

This portfolio website features an AI-powered chat interface that leverages OpenAI's API to create a more dynamic and interactive user experience.

## Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up your OpenAI API key**:
   - Sign up for an OpenAI account at [https://platform.openai.com/signup](https://platform.openai.com/signup)
   - Create an API key in your OpenAI dashboard
   - Copy your API key
   - Add your API key to the `.env.local` file:
     ```
     OPENAI_API_KEY=your-api-key-here
     ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Features

- **ChatGPT-style UI**: Clean interface with light/dark theme toggle
- **Real AI responses**: Uses OpenAI's GPT-3.5-turbo to generate responses
- **Custom portfolio information**: Easily customizable in `src/components/chat-provider.tsx`
- **Suggested responses**: Dynamic buttons to guide conversation
- **Mobile responsive**: Works on all device sizes

## Customization

To customize the portfolio information, edit the `portfolioInfo` object in `src/components/chat-provider.tsx`. Update your:

- Personal information (name, role, contact details)
- Skills (frontend, backend, devops)
- Projects (with descriptions and links)

## Using Free Tier OpenAI API

This project uses OpenAI's API which offers free credits for new users. Be mindful of usage limits:

- Free tier provides a limited number of tokens
- Set reasonable `max_tokens` limits in API calls
- Monitor your usage in the OpenAI dashboard
- Consider adding rate limiting for production use

## License

MIT
