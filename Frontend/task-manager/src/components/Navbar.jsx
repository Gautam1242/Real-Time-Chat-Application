import React from 'react'
import {Link} from 'react-router-dom'
const Navbar = () => {
  return (
    <div>
      <div className='navbar-section'>
        <ul className='d-flex w-100 justify-content-center gap-4 mt-4 '>
          <Link to={"/"} className='text-decoration-none'><li>Home</li></Link>
          <Link className='text-decoration-none' to={"/projects"}><li>Projects</li></Link>
          <Link className='text-decoration-none' to={"/tasks"}><li>Tasks</li></Link>
        </ul>
      </div>
    </div>
  )
}

export default Navbar