import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No data found", 
  description = "Get started by adding your first item.",
  actionLabel = "Add Item",
  onAction,
  icon = "Inbox"
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-secondary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name={icon} className="w-10 h-10 text-primary-600" />
          </div>
          <h3 className="text-2xl font-display font-semibold gradient-text mb-2">
            {title}
          </h3>
          <p className="text-gray-600 mb-8">{description}</p>
        </div>
        
        {onAction && (
          <button
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default Empty