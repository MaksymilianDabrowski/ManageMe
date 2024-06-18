import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddProject from './pages/AddProject'
import HomePage from './pages/HomePage'
// import Navbar from './components/Navbar'


function App() {

  return (
    <>
      <BrowserRouter>
      {/* <Navbar /> // do rozważenia */}
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='projects' element={<AddProject/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
