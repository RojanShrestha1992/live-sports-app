import React from 'react'
import Category from './Category'
import PopularNow from './PopularNow'

const Home = () => {
  return (
    <div className="w-full">
      <Category />
      <PopularNow />
    </div>
  )
}

export default Home