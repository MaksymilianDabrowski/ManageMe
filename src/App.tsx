import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddProject from './pages/AddProject'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='projects' element={<AddProject/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
