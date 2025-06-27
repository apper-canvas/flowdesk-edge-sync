import React, { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Modal from '@/components/organisms/Modal'
import { companyService } from '@/services/api/companyService'
import { contactService } from '@/services/api/contactService'
import { toast } from 'react-toastify'
const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [companiesData, contactsData] = await Promise.all([
        companyService.getAll(),
        contactService.getAll()
      ])
      
      setCompanies(companiesData)
      setFilteredCompanies(companiesData)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load companies')
      console.error('Companies error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCompanies(companies)
    } else {
      const filtered = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCompanies(filtered)
    }
  }, [searchQuery, companies])

const getCompanyContacts = (companyId) => {
    return contacts.filter(contact => contact.companyId === companyId)
  }

  const handleAddCompany = async (formData) => {
    try {
      setIsSubmitting(true)
      
      // Validate required fields
      if (!formData.name.trim()) {
        toast.error('Company name is required')
        return
      }
      
      if (!formData.industry.trim()) {
        toast.error('Industry is required')
        return
      }
      
      // Create company
      const newCompany = await companyService.create({
        name: formData.name.trim(),
        industry: formData.industry.trim(),
        size: formData.size || 'Small',
        website: formData.website.trim() || null
      })
      
      // Update local state
      setCompanies(prev => [...prev, newCompany])
      setFilteredCompanies(prev => [...prev, newCompany])
      
      // Close modal and show success
      setIsModalOpen(false)
      toast.success('Company added successfully!')
      
    } catch (err) {
      console.error('Error creating company:', err)
      toast.error('Failed to create company. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Companies</h1>
          <p className="text-gray-600 mt-1">Manage your business relationships</p>
        </div>
<Button
          icon="Plus"
          onClick={() => setIsModalOpen(true)}
        >
          Add Company
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search companies..."
          className="flex-1 max-w-md"
        />
      </div>

      {filteredCompanies.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredCompanies.map((company) => {
            const companyContacts = getCompanyContacts(company.Id)
            
            return (
              <div key={company.Id} className="card-premium p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-500 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Building" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-gray-900 text-lg">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" size="sm">
                    {company.size}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  {company.website && (
                    <div className="flex items-center text-sm text-gray-600">
                      <ApperIcon name="Globe" className="w-4 h-4 mr-2" />
                      <a 
                        href={company.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:underline"
                      >
                        {company.website}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <ApperIcon name="Users" className="w-4 h-4 mr-2" />
                    {companyContacts.length} contact{companyContacts.length !== 1 ? 's' : ''}
                  </div>
                </div>

                {companyContacts.length > 0 && (
                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Key Contacts</h4>
                    <div className="space-y-2">
                      {companyContacts.slice(0, 3).map((contact) => (
                        <div key={contact.Id} className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gradient-to-br from-primary-300 to-secondary-400 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                            {contact.firstName.charAt(0)}{contact.lastName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {contact.firstName} {contact.lastName}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {contact.email}
                            </p>
                          </div>
                        </div>
                      ))}
                      {companyContacts.length > 3 && (
                        <p className="text-xs text-gray-500">
                          +{companyContacts.length - 3} more contacts
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
<Empty
          title={searchQuery ? "No companies found" : "No companies yet"}
          description={searchQuery ? "Try adjusting your search terms." : "Start tracking your business relationships by adding companies."}
          actionLabel="Add Company"
          onAction={() => setIsModalOpen(true)}
          icon="Building"
        />
      )}

      <AddCompanyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddCompany}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

const AddCompanyModal = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    size: 'Small',
    website: ''
  })
  const [errors, setErrors] = useState({})

  const sizeOptions = [
    { value: 'Small', label: 'Small (1-50 employees)' },
    { value: 'Medium', label: 'Medium (51-500 employees)' },
    { value: 'Large', label: 'Large (500+ employees)' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Company name is required'
    }
    
    if (!formData.industry.trim()) {
      newErrors.industry = 'Industry is required'
    }
    
    if (formData.website && !formData.website.match(/^https?:\/\/.*\..*/)) {
      newErrors.website = 'Please enter a valid website URL'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    await onSubmit(formData)
  }

  const handleClose = () => {
    setFormData({
      name: '',
      industry: '',
      size: 'Small',
      website: ''
    })
    setErrors({})
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add New Company"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter company name"
            error={errors.name}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Industry *
          </label>
          <Input
            type="text"
            value={formData.industry}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            placeholder="e.g., Technology, Healthcare, Finance"
            error={errors.industry}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Size
          </label>
          <Select
            value={formData.size}
            onChange={(value) => handleInputChange('size', value)}
            options={sizeOptions}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Website
          </label>
          <Input
            type="url"
            value={formData.website}
            onChange={(e) => handleInputChange('website', e.target.value)}
            placeholder="https://example.com"
            error={errors.website}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={isSubmitting}
            icon="Plus"
          >
            Add Company
          </Button>
        </div>
      </form>
    </Modal>
  )
}

export default Companies