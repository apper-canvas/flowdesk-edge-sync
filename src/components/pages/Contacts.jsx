import React, { useState, useEffect } from 'react'
import ContactCard from '@/components/molecules/ContactCard'
import ContactForm from '@/components/organisms/ContactForm'
import Modal from '@/components/organisms/Modal'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { contactService } from '@/services/api/contactService'
import { toast } from 'react-toastify'

const Contacts = () => {
  const [contacts, setContacts] = useState([])
  const [filteredContacts, setFilteredContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedContact, setSelectedContact] = useState(null)

  const loadContacts = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await contactService.getAll()
      setContacts(data)
      setFilteredContacts(data)
    } catch (err) {
      setError('Failed to load contacts')
      console.error('Contacts error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadContacts()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts)
    } else {
      const filtered = contacts.filter(contact =>
        contact.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (contact.companyName && contact.companyName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      setFilteredContacts(filtered)
    }
  }, [searchQuery, contacts])

  const handleAddContact = () => {
    setSelectedContact(null)
    setShowModal(true)
  }

  const handleEditContact = (contact) => {
    setSelectedContact(contact)
    setShowModal(true)
  }

  const handleSaveContact = async (contactData) => {
    try {
      if (selectedContact) {
        await contactService.update(selectedContact.Id, contactData)
        setContacts(prev => prev.map(c => 
          c.Id === selectedContact.Id ? { ...c, ...contactData } : c
        ))
      } else {
        const newContact = await contactService.create(contactData)
        setContacts(prev => [...prev, newContact])
      }
      setShowModal(false)
      setSelectedContact(null)
    } catch (error) {
      throw error
    }
  }

  const handleCall = (contact) => {
    toast.info(`Calling ${contact.firstName} ${contact.lastName}...`)
  }

  const handleEmail = (contact) => {
    toast.info(`Opening email to ${contact.email}...`)
  }

  if (loading) {
    return <Loading type="contacts" />
  }

  if (error) {
    return <Error message={error} onRetry={loadContacts} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Contacts</h1>
          <p className="text-gray-600 mt-1">Manage your customer relationships</p>
        </div>
        <Button
          onClick={handleAddContact}
          icon="Plus"
        >
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search contacts..."
          className="flex-1 max-w-md"
        />
      </div>

      {filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard
              key={contact.Id}
              contact={contact}
              onEdit={handleEditContact}
              onCall={handleCall}
              onEmail={handleEmail}
            />
          ))}
        </div>
      ) : (
        <Empty
          title={searchQuery ? "No contacts found" : "No contacts yet"}
          description={searchQuery ? "Try adjusting your search terms." : "Start building your customer database by adding your first contact."}
          actionLabel="Add Contact"
          onAction={handleAddContact}
          icon="Users"
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedContact ? 'Edit Contact' : 'Add New Contact'}
        size="lg"
      >
        <ContactForm
          contact={selectedContact}
          onSave={handleSaveContact}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default Contacts