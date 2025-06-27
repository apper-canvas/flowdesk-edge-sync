import React, { useContext } from 'react'
import { useSelector } from 'react-redux'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import { AuthContext } from '../../App'
const Header = ({ onMenuClick, onSearch }) => {
  const { logout } = useContext(AuthContext)
  const { user } = useSelector((state) => state.user)
  
  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
    }
    if (user?.emailAddress) {
      return user.emailAddress.charAt(0).toUpperCase()
    }
    return 'U'
  }

  return (
    <header className="bg-white border-b border-gray-200 px-safe sm:px-4 lg:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden touch-target rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          
          <div className="hidden md:block">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search contacts, companies, deals..."
              className="w-64 lg:w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-1 sm:space-x-3">
          <Button
            variant="ghost"
            icon="Bell"
            className="relative touch-target"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            icon="Settings"
            className="touch-target"
          />
          
          <Button
            variant="ghost"
            icon="LogOut"
            className="touch-target"
            onClick={handleLogout}
            title="Logout"
          />
          
          <div className="w-10 h-10 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">{getUserInitials()}</span>
          </div>
        </div>
      </div>
      
      <div className="md:hidden mt-4">
        <SearchBar
          onSearch={onSearch}
          placeholder="Search..."
          className="w-full"
        />
      </div>
    </header>
  )
}

export default Header