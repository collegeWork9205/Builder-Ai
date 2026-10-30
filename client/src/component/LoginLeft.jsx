
const LoginLeft = () => {
  return (
    <div className="hidden lg:flex lg:w-2/5 bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat flex-col justify-between p-12 shrink-0 select-none">
      <div className="flex flex-row gap-2">
        <img src="logo.svg" alt="Logo" className='size-9.5' />
        <span className='text-4xl font-medium text-white font-mono'>Kyro AI</span>
      </div>
      <div>
        <h2 className='text-3xl text-white font-medium leading-snug mb-3 tracking-tight'>Build Your Presence on Web</h2>
        <p className='text-zinc-300 text-md'>Describe What You Need,Preview Instantly,and Customize Your Site
          In A Real-Time,React With Clean Jsx,Verified Layouts,And Instant Code Exports
        </p>
        <p className='text-zinc-300 text-sm mt-12'>Copyright {new Date().getFullYear()} KyroAI</p>
      </div>
    </div>
  )
}

export default LoginLeft