import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  return ( 
    <div className=' sticky top-0 z-50 border-b border-slate-800 bg-slate-950/95 backdrop-blur'>
      <div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
        <button
          onClick={() => navigate('/')}
          className='flex items-center gap-3 group hover:opacity-80 transition-opacity'
        >
          <div className='w-10 h-10 rounded-lg bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg'>
            LS
          </div>
          <div className='cursor-pointer'>
            <h1 className='text-2xl font-bold text-white'>Live Sports</h1>
            <p className='text-xs text-gray-400'>Watch for free</p>
          </div>
        </button>
        
        <div className='text-xs font-semibold text-blue-400 uppercase tracking-widest'>
          🔴 Live
        </div>
      </div>
    </div>
  )
}

export default Navbar