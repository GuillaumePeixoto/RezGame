import './App.css'
import NavBar from './components/NavBar'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import 'keen-slider/keen-slider.min.css'
import KeenSlider from 'keen-slider'

function App() {


  return (
    <>
      <NavBar />
      <div className="flex flex-col w-2/3 mx-auto mt-4">
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
        </Routes>
      </div>
    </>
  )
}

export default App
