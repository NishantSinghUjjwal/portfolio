import UserCard from './components/UserCard'
import ProjectCard from './components/ProjectCard'

export interface Project {
  title: string;
  image: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
}
function App() {

  const projects: Project[] = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-stack e-commerce platform built with Next.js, featuring a shopping cart, user authentication, and payment integration.",
      image: "https://codedesign.org/storage/app/media/uploaded-files/AI-in-ecommerce.jpeg",
      tags: ["Next.js", "TypeScript", "Prisma", "Stripe"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Task Management App",
      description: "A collaborative task management application with real-time updates and team workspace features.",
      image: "https://cdn.prod.website-files.com/62fcfcf2e1a4c21ed18b80e6/666a3854efcee511cbcc70af_ClickUp_e5at.webp",
      tags: ["React", "Node.js", "Socket.io", "MongoDB"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "AI Content Generator",
      description: "An AI-powered application that generates various types of content using OpenAI's GPT model.",
      image: "https://letsenhance.io/blog/content/images/2022/12/LE_AI_Generation_post.png",
      tags: ["React", "Python", "OpenAI", "FastAPI"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ]

  return (
    <div className=' bg-zinc-950 h-screen w-screen flex items-center justify-center p-8 px-36'>
      <div className=' flex w-full gap-4 h-full'>
        <UserCard />
        <div className=' w-full text-white overflow-y-auto flex flex-col h-full gap-8 custom-scrollbar pr-4'>
          {
            projects.map(project => <ProjectCard
              title={project.title}
              description={project.description}
              image={project.image}
              tags={project.tags}
              liveUrl={project.liveUrl}
              githubUrl={project.githubUrl}
            />)
          }
        </div>
      </div>
    </div>
  )
}

export default App
