import React from 'react'
import { NavLink } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'

const Sidebar = ({ isOpen, onClose }) => {
  const navigation = [
    { name: 'Dashboard', href: '/', icon: 'LayoutDashboard' },
    { name: 'Contacts', href: '/contacts', icon: 'Users' },
    { name: 'Companies', href: '/companies', icon: 'Building' },
    { name: 'Deals', href: '/deals', icon: 'TrendingUp' },
    { name: 'Activities', href: '/activities', icon: 'Activity' },
  ]

  return (
    <>
      {/* Mobile backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className={`fixed left-0 top-0 z-50 h-full w-64 bg-white shadow-strong transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-lg flex items-center justify-center">
              <ApperIcon name="Users" className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-display font-bold gradient-text">FlowDesk</h1>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ApperIcon name="X" className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <ApperIcon name={item.icon} className="w-5 h-5 mr-3 transition-colors" />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar