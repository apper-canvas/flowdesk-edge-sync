import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import { format } from 'date-fns'

const ActivityItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      call: 'Phone',
      email: 'Mail',
      meeting: 'Calendar',
      note: 'FileText',
      task: 'CheckSquare'
    }
    return icons[type] || 'Activity'
  }

  const getActivityColor = (type) => {
    const colors = {
      call: 'success',
      email: 'info',
      meeting: 'warning',
      note: 'default',
      task: 'primary'
    }
    return colors[type] || 'default'
  }

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${getActivityColor(activity.type)}-100`}>
        <ApperIcon 
          name={getActivityIcon(activity.type)} 
          className={`w-4 h-4 text-${getActivityColor(activity.type)}-600`} 
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2">
            <Badge variant={getActivityColor(activity.type)} size="xs">
              {activity.type}
            </Badge>
            {activity.contactName && (
              <span className="text-sm font-medium text-gray-900">
                {activity.contactName}
              </span>
            )}
          </div>
          <span className="text-xs text-gray-500">
            {format(new Date(activity.timestamp), 'MMM dd, hh:mm a')}
          </span>
        </div>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {activity.description}
        </p>
        
        {activity.dealTitle && (
          <div className="flex items-center mt-2 text-xs text-gray-500">
            <ApperIcon name="TrendingUp" className="w-3 h-3 mr-1" />
            Related to: {activity.dealTitle}
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityItem