import { useEffect, useState } from 'react'
import '@styles/index.css';
import { Routes, Route } from 'react-router-dom'
import SpaceXLaunchHistory from './pages/SpaceXLaunchHistory/index.jsx'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate initial app loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  return !loading ? (
    <div className='h-screen flex flex-wrap content-between bg-gray-400 overflow-hidden'>
      <div className='w-full block h-full'>
        <main className='h-full overflow-auto'>
          <Routes>
            <Route path="/" element={<SpaceXLaunchHistory />} />
            <Route path="/spacex-launch-history" element={<SpaceXLaunchHistory />} />
          </Routes>
        </main>
      </div>
    </div>
  ) : (
    <div className="flex justify-center items-center h-screen bg-gray-400">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
    </div>
  )
}

export default App