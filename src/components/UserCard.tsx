import { Github, Instagram, Linkedin } from 'lucide-react'

const UserCard = () => {
    const skills = [
        { name: "ReactJS", level: 90 },
        { name: "NodeJS", level: 85 },
        { name: "PostgreSQL", level: 80 },
        { name: "MongoDB", level: 75 },
        { name: "Tailwind CSS", level: 95 },
        { name: "TypeScript", level: 85 },
    ]
    return (
        <div className=' w-96 min-w-96 bg-zinc-800 rounded-2xl shadow-md p-4 flex flex-col gap-4 h-full'>
            <div className=' flex flex-col justify-between h-full gap-4'>
                <div className=' flex flex-col gap-4'>
                    {/* profile pic */}
                    <div className='max-h-80 overflow-clip rounded-2xl shadow-inner'>
                        <img className=' h-full object-cover w-full object-top hover:scale-110 transition' src='/profile-pic.jpeg' />
                    </div>
                    {/* info card */}
                    <div className=''>
                        {/* info */}
                        <div className=' flex justify-between items-center'>
                            <h1 className=' text-3xl text-zinc-200 font-extrabold'>Nishant Ujjwal</h1>
                            <div className='flex justify-end gap-2 rounded-full p-2 w-fit text-zinc-500'>
                                <a target='_blank' href=' https://github.com/NishantSinghUjjwal'>
                                    <Github className=' hover:text-white ' />
                                </a>
                                <a target='_blank' href='https://www.linkedin.com/in/nishant-ujjwal/'>
                                    <Linkedin className=' hover:text-white ' />
                                </a>
                                <a target='_blank' href='https://www.instagram.com/nishant_ujjwal_27/'>
                                    <Instagram className=' hover:text-white ' />
                                </a>
                            </div>
                        </div>

                        <h2 className=' text-xl text-zinc-500 font-bond'>Software Developer</h2>
                        {/* <p className='text-zinc-500 mt-5'>
                        Full-Stack Developer skilled in{' '}
                        <span className='font-semibold text-orange-700'>ReactJS</span>,{' '}
                        <span className='font-semibold text-orange-700'>NodeJS</span>,{' '}
                        <span className='font-semibold text-orange-700'>PostgreSQL</span>,{' '}
                        <span className='font-semibold text-orange-700'>MongoDB</span>,{' '}
                        <span className='font-semibold text-orange-700'>Tailwind CSS</span>, and{' '}
                        <span className='font-semibold text-orange-700'>TypeScript</span>. I build modern, scalable web apps with a focus on clean code and user experience.
                    </p>   */}
                        {/* socials */}

                    </div>
                </div>
                <div className="mt-4 space-y-4 overflow-y-auto h-full">
                    {skills.map((skill) => (
                        <div key={skill.name} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className=' text-zinc-500'>{skill.name}</span>
                                <span className="text-orange-500">{skill.level}%</span>
                            </div>
                            <div className=' bg-zinc-900 h-4 w-full overflow-clip rounded-full'>
                                <div className=' bg-orange-500 h-full' style={{ width: `${skill.level}%` }}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserCard