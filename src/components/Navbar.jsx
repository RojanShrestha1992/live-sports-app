import React from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
  return ( 
    <div
    onClick={()=> navigate('/')}
    className='flex cursor-pointer hover:text-blue-500 transition duration-400 justify-center text-5xl font-semibold py-6 border-b-2 border-gray-700'>
        LIVE-SPORTS

    </div>
  )
}

export default Navbar