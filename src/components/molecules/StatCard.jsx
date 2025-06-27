import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = 'neutral',
  icon,
  trend = [],
  className = '' 
}) => {
  const changeColors = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  return (
    <div className={`card-premium p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-100 to-secondary-200 rounded-lg flex items-center justify-center">
              <ApperIcon name={icon} className="w-5 h-5 text-primary-600" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-display font-bold gradient-text">{value}</p>
          </div>
        </div>
      </div>
      
      {change && (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${changeColors[changeType]}`}>
          <ApperIcon 
            name={changeType === 'positive' ? 'TrendingUp' : changeType === 'negative' ? 'TrendingDown' : 'Minus'} 
            className="w-3 h-3 mr-1" 
          />
          {change}
        </div>
      )}
    </div>
  )
}

export default StatCard