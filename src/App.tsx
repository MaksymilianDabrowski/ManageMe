import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AddProject from './pages/AddProject'
import HomePage from './pages/HomePage'
import AddStory from './pages/AddStory'
import AddTask from './pages/AddTask'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Registerpage from './pages/Registerpage'
import { ThemeProvider } from './components/ThemeProvider'


function App() {

  return (
    <>
      <ThemeProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/projects' element={<AddProject />} />
            <Route path='/projects/:projectId/story' element={<AddStory />} />
            <Route path='/story/:storyId/task' element={<AddTask />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/login' element={<Registerpage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>

    </>
  )
}

export default App