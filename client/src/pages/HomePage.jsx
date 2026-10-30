import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import PromtInput from '../component/PromtInput'
import { homeTags } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ArrowRightIcon, ClockIcon, Trash2Icon } from 'lucide-react'
import moment from 'moment'
const HomePage = () => {

  const { user, projects, loadingProjects, loadProjects, handleGenerate, generatingProjects, handleDelete, logout } = useAppContext()
  const navigate = useNavigate();

  useEffect(() => {
    loadProjects()
  }, [loadProjects])
  return (
    <div className="h-screen overflow-y-scroll text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat">
      {/* navbar */}
      <nav className='sticky top-0 z-10 flex items-center justify-between px-6 py-4'>

        <div className='flex items-center gap-2'>
          <img src="/logo.svg" alt="logo" className='size-6' />
          <span className='text-xl font-semibold tracking-tight font-mono'>Kyro-AI</span>
        </div>

        <div className='flex items-center gap-4 text-sm font-medium text-zinc-300'>
          <span>{user?.name}</span>
          <button onClick={logout} className='py-1.5 px-3 border border-white/20 text-white hover:bg-white/10 text-xs rounded-md cursor-pointer bg-transparent'>Sign Out</button>
        </div>
      </nav>

      {/* hero */}
      <div className='flex flex-col justify-center items-center px-6 pb-20 mt-8 xl:mt-28'>
        <div className='w-full max-w-2xl flex flex-col items-center'>
          {/* promo badge */}
          <div className='flex items-center gap-2 p-1.5 pr-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[13px] text-white/90'>
            <span className='px-3 py-1 text-[11px] bg-red-700 rounded-full font-medium tracking-wider'>PROMO</span>
            <span>Create Your First project Free</span>
          </div>

          {/* title */}
          <h1 className='text-center text-4xl md:text-6xl font-medium mt-4 max-w-2xl text-white'>Lets Build Your App Together</h1>
          <p className='text-center mt-5 text-sm md:text-base max-w-xl text-white/65 leading leading-relaxed'>Describe your idea and watch AI design, structure and launch your website instantly, no coding required</p>
        </div>
        {/* prompt input  with glassmorphic varient */}
        <div className='mt-6 w-full max-w-2xl'>
          <PromtInput onSubmit={handleGenerate} loading={generatingProjects} varient='glass' autofocus />
        </div>


        {/* scrolling marquee tags */}
        <div className='masked-marquee w-full mt-4 max-w-2xl overflow-hidden py-1'>
          <div className='animate-marquee gap-3'>
            {homeTags.map((tag, id) => (
              <button className='px-4 py-1.5 border  rounded-full text-sm text-white bg-white/10
              border-white/25 hover:bg-white/20 transition cursor-pointer shrink-0 font-medium' key={id} onClick={() => handleGenerate(tag)} disabled={generatingProjects}>
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Showing list of Project */}
        {!loadingProjects && projects.length > 0 && (
          <div className='w-full mt-12 max-w-2xl'>
            <div className='flex items-center justify-between pb-3 mb-3 border-b border-white/10'>
              <p className='text-xs font-medium  uppercase text-zinc-200 tracking-widest'>All Projects</p>
              <span className='text-xs font-normal text-zinc-200'>{projects.length} {projects.length === 1 ? "Project" : "Projects"}</span>
            </div>

            <div className='space-y-2 max-h-[80vh] overflow-y-auto pr-1'>
              {projects.map((p) => (
                <div key={p._id} className='bg-white/5 border border-white/10 rounded-lg px-4
                py-3 flex items-center justify-between group hover:border-white/20 hover:bg-white/10cursor-pointer backdrop-blur-md transition-all'
                  onClick={() => navigate(`/builder/${p._id}`)}>
                  {/* display name and time & version*/}
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-white truncate'>{p.name}</p>
                    <div className='flex flex-row items-center mt-0.5 gap-3'>
                      <span className=' text-xs flex items-center text-zinc-300 gap-1'><ClockIcon size={10} />{moment(p.updateAt || p.createdAt).fromNow()}</span>
                      <span className='text-xs text-white/60 font-medium'>v{p.version}</span>
                    </div>
                  </div>
                  {/* Creating Action Buttons */}
                  <div className='flex items-center gap-2'>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(p._id) }}
                      className='p-1.5 max-md:opacity-60 opacity-0 group-hover:opacity-60 rounded-md text-zinc-200 hover:text-red-600
                      hover:bg-white/10 transition-opacity'><Trash2Icon size={14} /></button>
                    <ArrowRightIcon size={14} className='text-zinc-200 group-hover:text-white transition-all hover:scale-125 ' />
                  </div>
                </div>
              ))}
            </div>
          </div>


        )}

      </div>
    </div>
  )
}

export default HomePage