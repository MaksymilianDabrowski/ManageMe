import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <>
      <div className='text-4xl text-center pb-8'>
        ManagMe
      </div>
      <Link
        to="/projects"
        className="text-white bg-[#2c2c2c] border-0 py-2 px-8 focus:outline-none hover:scale-110 ease-in duration-300 rounded-2xl text-lg mb-16"
      > Dodaj nowy projekt
      </Link>
    </>
  )
}
