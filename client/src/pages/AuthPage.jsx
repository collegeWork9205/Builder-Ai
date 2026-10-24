import React, { useEffect, useState } from 'react'
import LoginLeft from '../component/LoginLeft';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Loader2Icon } from 'lucide-react'
import { useAppContext } from '../context/AppContext';

const AuthPage = ({ mode }) => {
  const { login, Register } = useAppContext()
  const [error, setError] = useState("")
  const [loading, setloading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showpassword, setShowPassword] = useState(false)
  const isLogin = mode === 'login';
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setloading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await Register(name, email, password)
      }
      navigate("/")
    } catch (error) {
      setError(error.message || (mode === 'login' ? "Invalid Email or Password" : "Invalid Registration"))
    } finally {
      setloading(false)
    }
  }
  return (
    <div className='min-h-screen bg-white flex text-zinc-900 font-sans'>
      {/* left Panel-Branding */}
      <LoginLeft />

      {/* Right Panel-Form */}
      <div className='flex-1 flex items-center justify-center p-8'>
        <div className='w-full max-w-sm'>
          <div className='mb-10'>
            <h1 className='text-3xl font-medium tracking-tight text-zinc-900 mb-1.5 font-sans'>{isLogin ? "Sign In" : "Create An Account"}</h1>
            <p className='text-sm text-zinc-400'>
              {isLogin ? "Enter yours credentials to access your website builder"
                : "Get started by entering your registration details"}
            </p>
          </div>
          {error && <div className='mb-6 p-3 border border-red-200 bg-red-50 text-red-700 text-xs rounded'>{error}</div>}

          <form className='space-y-6 mb-4' onSubmit={handleSubmit}>
            {!isLogin &&
              <div>
                <label htmlFor="name" className='block text-[11px] font-semibold text-zinc-600 uppercase tracking-widestmb-2'>Full Name</label>
                <input className='w-full border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition:colors pl-2 py-2' placeholder='Ankit Yadav' id='name' type='text' value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
            }
            <div>
              <label htmlFor="email" className='block text-[11px] font-semibold text-zinc-600 uppercase tracking-widest
                 mb-2'>Email</label>
              <input className='w-full border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition:colors pl-2 py-2' placeholder='Examplemail@123' id='email' type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label htmlFor="password" className='block text-[11px] font-semibold text-zinc-600 uppercase tracking-widest
                 mb-2'>Password</label>
              <div className='relative'>
                <input className='w-full border-b border-zinc-200 focus:outline-none focus:border-zinc-950 text-sm text-zinc-900 bg-transparent placeholder-zinc-300 transition:colors pl-2 py-2' placeholder='@#DV1349ahdyd' id='password' type={showpassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type='button' onClick={() => setShowPassword(!showpassword)} className='absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 hover:scale-105 flex items-center justify-center cursor-pointer transition-colors'>
                  {showpassword ? <Eye size={15} /> : <EyeOff size={15} />}
                </button>
              </div>
            </div>
            <button type='submit' disabled={loading} className='w-full py-2.5 bg-linear-to-br from-red-600 to-amber-600 text-white font-semibold hover:scale-102 disabled:opacity-40 flex items-center justify-center cursor-pointer mt-2 rounded-lg  transition-all duration-300'>
              {loading && <Loader2Icon className='animate-spin h-3.5 w-3.5 mr-2 ' />}
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <p className='text-sm  text-zinc-400 mt-4 pt-6 border-t border-zinc-100 font-sans'>
            {isLogin ? (
              <>
                New to BuilderAI?  {" "}
                <Link to='/register' className='text-blue-700 font-medium hover:underline '>
                  Create An Account</Link>
              </>
            ) : (
              <>
                Already Have An Account?  {" "}
                <Link to='/login' className='text-blue-700 font-medium hover:underline'>
                  Sign In Here</Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage