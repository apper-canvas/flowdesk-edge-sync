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
    <div className={`card p-4 cursor-pointer hover:shadow-strong transition-all duration-200 ${draggable ? 'draggable' : ''}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm">{deal.title}</h4>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            icon="MoreHorizontal"
            onClick={() => onEdit(deal)}
            className="p-1"
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-display font-semibold gradient-text">
            {formatCurrency(deal.value)}
          </span>
          <Badge variant={getProbabilityColor(deal.probability)} size="xs">
            {deal.probability}% chance
          </Badge>
        </div>
        
        {deal.contactName && (
          <div className="flex items-center text-xs text-gray-600">
            <ApperIcon name="User" className="w-3 h-3 mr-1" />
            {deal.contactName}
          </div>
        )}
        
        {deal.expectedClose && (
          <div className="flex items-center text-xs text-gray-600">
            <ApperIcon name="Calendar" className="w-3 h-3 mr-1" />
            {format(new Date(deal.expectedClose), 'MMM dd, yyyy')}
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