import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'

const Header = ({ onMenuClick, onSearch }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="Menu" className="w-5 h-5" />
          </button>
          
          <div className="hidden md:block">
            <SearchBar
              onSearch={onSearch}
              placeholder="Search contacts, companies, deals..."
              className="w-96"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            icon="Bell"
            className="relative"
          >
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent-500 rounded-full"></span>
          </Button>
          
          <Button
            variant="ghost"
            icon="Settings"
          />
          
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-semibold">JD</span>
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