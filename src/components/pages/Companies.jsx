import React, { useState, useEffect } from 'react'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import SearchBar from '@/components/molecules/SearchBar'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { companyService } from '@/services/api/companyService'
import { contactService } from '@/services/api/contactService'

const Companies = () => {
  const [companies, setCompanies] = useState([])
  const [filteredCompanies, setFilteredCompanies] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

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
          icon="Building"
        />
      )}
    </div>
  )
}

export default Companies