import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ContactCard = ({ contact, onEdit, onDelete, onCall, onEmail }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

return (
    <div className="card-premium p-4 sm:p-6 group">
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
            {getInitials(contact.firstName, contact.lastName)}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display font-semibold text-gray-900 group-hover:text-primary-600 transition-colors text-sm sm:text-base truncate">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 truncate">{contact.email}</p>
          </div>
        </div>
        <div className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
          <Button
            variant="ghost"
            size="sm"
            icon="MoreHorizontal"
            onClick={() => onEdit(contact)}
            className="touch-target"
          />
        </div>
      </div>

      <div className="space-y-2 mb-3 sm:mb-4">
        {contact.phone && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{contact.phone}</span>
          </div>
        )}
        {contact.companyName && (
          <div className="flex items-center text-xs sm:text-sm text-gray-600">
            <ApperIcon name="Building" className="w-3 h-3 sm:w-4 sm:h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{contact.companyName}</span>
          </div>
        )}
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3 sm:mb-4">
          {contact.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="primary" size="xs">
              {tag}
            </Badge>
          ))}
          {contact.tags.length > 3 && (
            <Badge variant="secondary" size="xs">
              +{contact.tags.length - 3}
            </Badge>
          )}
        </div>
      )}

      <div className="flex items-center justify-between sm:justify-start sm:space-x-2 pt-3 sm:pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          icon="Phone"
          onClick={() => onCall(contact)}
          className="touch-target flex-1 sm:flex-none"
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Mail"
          onClick={() => onEmail(contact)}
          className="touch-target flex-1 sm:flex-none"
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(contact)}
          className="touch-target flex-1 sm:flex-none"
        />
      </div>
    </div>
  )
}

export default ContactCard