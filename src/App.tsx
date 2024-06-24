import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddProject from './pages/AddProject'
import HomePage from './pages/HomePage'
import AddStory from './pages/AddStory'
import AddTask from './pages/AddTask'
import Navbar from './components/Navbar'


function App() {

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/projects' element={<AddProject />} />
          <Route path='/projects/:projectId/story' element={<AddStory />} />
          <Route path='/story/:storyId/task' element={<AddTask />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App