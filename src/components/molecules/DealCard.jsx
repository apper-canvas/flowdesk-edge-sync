import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import { format } from "date-fns";
const DealCard = ({ deal, onEdit, onDelete, draggable = true }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getProbabilityColor = (probability) => {
    if (probability >= 80) return 'success'
    if (probability >= 50) return 'warning'
    return 'danger'
  }

return (
    <div className={`card p-3 sm:p-4 cursor-pointer hover:shadow-strong transition-all duration-200 ${draggable ? 'draggable' : ''}`}>
      <div className="flex items-start justify-between mb-2 sm:mb-3">
        <h4 className="font-medium text-gray-900 text-xs sm:text-sm pr-2 line-clamp-2 flex-1 min-w-0">{deal.title}</h4>
        <div className="flex items-center space-x-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            icon="MoreHorizontal"
            onClick={() => onEdit(deal)}
            className="touch-target p-1"
          />
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-base sm:text-lg font-display font-semibold gradient-text">
            {formatCurrency(deal.value)}
          </span>
          <Badge variant={getProbabilityColor(deal.probability)} size="xs">
            {deal.probability}%
          </Badge>
        </div>
        
        {deal.contactName && (
          <div className="flex items-center text-xs text-gray-600">
            <ApperIcon name="User" className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{deal.contactName}</span>
          </div>
        )}
        
        {deal.expectedClose && (
          <div className="flex items-center text-xs text-gray-600">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="truncate">{format(new Date(deal.expectedClose), 'MMM dd, yyyy')}</span>
          </div>
        )}
      </div>

      {deal.notes && (
        <p className="text-xs text-gray-500 line-clamp-2">{deal.notes}</p>
      )}
    </div>
  )
}

export default DealCard