import { Link } from 'react-router-dom'
import path from 'src/constants/path'

export default function NotFound() {
  return (
    <div
      className='
    flex
    items-center
    justify-center
    w-screen
    h-screen
    bg-white
  '
    >
      <div className='px-40 py-20 bg-orange rounded-md shadow-xl'>
        <div className='flex flex-col items-center'>
          <h1 className='font-bold text-white text-9xl'>404</h1>

          <h6 className='mb-2 text-2xl font-bold text-center text-white md:text-3xl'>
            <span className='text-white'>Oops!</span> Page not found
          </h6>

          <p className='mb-8 text-center text-white md:text-lg'>The page you’re looking for doesn’t exist.</p>

          <Link
            to={path.home}
            className=' w-52 h-10 rounded-sm text-center   uppercase bg-white text-orange text-sm hover:shadow-sm flex items-center justify-center'
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  )
}
