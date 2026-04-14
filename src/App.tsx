import React from 'react'
import AuthPage from './Pages/Login/Login'
import {Route,Routes} from "react-router-dom"
import ProjectsPage from './Pages/Projects/ProjectPage'
import TaskPage from './Pages/TaksPage/TaskPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AuthPage/>} />
        <Route path="/login" element={<AuthPage/>} />
        <Route path='/projects' element={<ProjectsPage/>}/>
        <Route path='/projects/:id' element={<TaskPage/>}/>
      </Routes>
    </div>
  )
}

export default App
