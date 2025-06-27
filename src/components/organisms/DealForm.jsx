import React, { useState, useEffect } from 'react'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Button from '@/components/atoms/Button'
import { toast } from 'react-toastify'

const DealForm = ({ deal, contacts = [], onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    value: '',
    stage: 'prospecting',
    probability: 25,
    contactId: '',
    expectedClose: '',
    notes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const stageOptions = [
    { value: 'prospecting', label: 'Prospecting' },
    { value: 'qualification', label: 'Qualification' },
    { value: 'proposal', label: 'Proposal' },
    { value: 'negotiation', label: 'Negotiation' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' }
  ]

  const contactOptions = [
    { value: '', label: 'Select a contact...' },
    ...contacts.map(contact => ({
      value: contact.Id.toString(),
      label: `${contact.firstName} ${contact.lastName}`
    }))
  ]

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        value: deal.value?.toString() || '',
        stage: deal.stage || 'prospecting',
        probability: deal.probability || 25,
        contactId: deal.contactId?.toString() || '',
        expectedClose: deal.expectedClose ? new Date(deal.expectedClose).toISOString().split('T')[0] : '',
        notes: deal.notes || ''
      })
    }
  }, [deal])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required'
    }
    
    if (!formData.value.trim()) {
      newErrors.value = 'Deal value is required'
    } else if (isNaN(parseFloat(formData.value)) || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Please enter a valid positive number'
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Please select a contact'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        contactId: parseInt(formData.contactId),
        expectedClose: formData.expectedClose ? new Date(formData.expectedClose).toISOString() : null
      }
      
      await onSave(dealData)
      toast.success(deal ? 'Deal updated successfully!' : 'Deal created successfully!')
    } catch (error) {
      toast.error('Failed to save deal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Deal Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
        />
        
        <Input
          label="Deal Value"
          name="value"
          type="number"
          step="0.01"
          min="0"
          value={formData.value}
          onChange={handleChange}
          error={errors.value}
          required
        />
        
        <Select
          label="Stage"
          name="stage"
          value={formData.stage}
          onChange={handleChange}
          options={stageOptions}
        />
        
        <Input
          label="Probability (%)"
          name="probability"
          type="number"
          min="0"
          max="100"
          value={formData.probability}
          onChange={handleChange}
        />
        
        <Select
          label="Contact"
          name="contactId"
          value={formData.contactId}
          onChange={handleChange}
          options={contactOptions}
          error={errors.contactId}
          required
        />
        
        <Input
          label="Expected Close Date"
          name="expectedClose"
          type="date"
          value={formData.expectedClose}
          onChange={handleChange}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows="4"
          className="input-field"
          placeholder="Add any additional notes about this deal..."
        />
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {deal ? 'Update Deal' : 'Create Deal'}
        </Button>
      </div>
    </form>
  )
}

export default DealForm