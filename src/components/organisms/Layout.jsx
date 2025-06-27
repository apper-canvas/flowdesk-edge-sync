import React, { useState, useContext } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '@/components/organisms/Sidebar'
import Header from '@/components/organisms/Header'
import { AuthContext } from '../../App'
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const authContext = useContext(AuthContext)

  const handleSearch = (query) => {
    console.log('Search query:', query)
    // Implement global search functionality
  }
return (
    <div className="min-h-screen bg-surface">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="lg:ml-64">
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={handleSearch}
        />
        
        <main className="p-safe sm:p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout