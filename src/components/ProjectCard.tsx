import { ExternalLink, Github } from 'lucide-react';
import { Project } from '../App';

const ProjectCard = ({ image, description, tags, liveUrl, githubUrl, title }: Project) => {
    return (
        <div className=' w-full rounded-xl overflow-clip'>
            <div className="relative aspect-[2/1] overflow-hidden">
                <img
                    src={image || "/placeholder.svg"}
                    alt={title}
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
            </div>
            <div className='bg-zinc-900 p-4 flex flex-col gap-4'>
                <div>
                    <div className=' flex gap-4'>
                        <h1 className="text-2xl text-white">{title}</h1>
                        <div className="flex gap-4">
                            <button
                                className="gap-2 text-zinc-400 border-zinc-800 hover:text-white hover:border-orange-500"
                            >
                                <a href={githubUrl}>
                                    <Github className="w-4 h-4" />
                                </a>
                            </button>
                            <button
                                className="gap-2 text-zinc-400 border-zinc-800 hover:text-white hover:border-orange-500"
                            >
                                <a href={liveUrl}>
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </button>
                        </div>
                    </div>
                    <p className="text-zinc-400">{description}</p>
                </div>
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <div
                                key={tag}
                                className="bg-orange-600/10 text-orange-500 hover:bg-orange-600/20 rounded-full px-2 text-sm"
                            >
                                {tag}
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ProjectCard