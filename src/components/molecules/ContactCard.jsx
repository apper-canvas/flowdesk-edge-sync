import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import Badge from '@/components/atoms/Badge'
import Button from '@/components/atoms/Button'

const ContactCard = ({ contact, onEdit, onDelete, onCall, onEmail }) => {
  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
  }

  return (
    <div className="card-premium p-6 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold">
            {getInitials(contact.firstName, contact.lastName)}
          </div>
          <div>
            <h3 className="font-display font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {contact.firstName} {contact.lastName}
            </h3>
            <p className="text-sm text-gray-600">{contact.email}</p>
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            icon="MoreHorizontal"
            onClick={() => onEdit(contact)}
          />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {contact.phone && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" className="w-4 h-4 mr-2" />
            {contact.phone}
          </div>
        )}
        {contact.companyName && (
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Building" className="w-4 h-4 mr-2" />
            {contact.companyName}
          </div>
        )}
      </div>

      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {contact.tags.map((tag, index) => (
            <Badge key={index} variant="primary" size="xs">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center space-x-2 pt-4 border-t border-gray-100">
        <Button
          variant="ghost"
          size="sm"
          icon="Phone"
          onClick={() => onCall(contact)}
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Mail"
          onClick={() => onEmail(contact)}
        />
        <Button
          variant="ghost"
          size="sm"
          icon="Edit"
          onClick={() => onEdit(contact)}
        />
      </div>
    </div>
  )
}

export default ContactCard