import React, { useState, useEffect } from 'react'
import DealCard from '@/components/molecules/DealCard'
import DealForm from '@/components/organisms/DealForm'
import Modal from '@/components/organisms/Modal'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { dealService } from '@/services/api/dealService'
import { contactService } from '@/services/api/contactService'
import { toast } from 'react-toastify'

const Deals = () => {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)

  const stages = [
    { id: 'prospecting', name: 'Prospecting', color: 'bg-gray-100' },
    { id: 'qualification', name: 'Qualification', color: 'bg-blue-100' },
    { id: 'proposal', name: 'Proposal', color: 'bg-yellow-100' },
    { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-100' },
    { id: 'closed-won', name: 'Closed Won', color: 'bg-green-100' },
    { id: 'closed-lost', name: 'Closed Lost', color: 'bg-red-100' }
  ]

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [dealsData, contactsData] = await Promise.all([
        dealService.getAll(),
        contactService.getAll()
      ])
      
      // Enrich deals with contact information
      const enrichedDeals = dealsData.map(deal => {
        const contact = contactsData.find(c => c.Id === deal.contactId)
        return {
          ...deal,
          contactName: contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'
        }
      })
      
      setDeals(enrichedDeals)
      setContacts(contactsData)
    } catch (err) {
      setError('Failed to load deals')
      console.error('Deals error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleAddDeal = () => {
    setSelectedDeal(null)
    setShowModal(true)
  }

  const handleEditDeal = (deal) => {
    setSelectedDeal(deal)
    setShowModal(true)
  }

  const handleSaveDeal = async (dealData) => {
    try {
      if (selectedDeal) {
        await dealService.update(selectedDeal.Id, dealData)
        const contact = contacts.find(c => c.Id === dealData.contactId)
        const updatedDeal = {
          ...selectedDeal,
          ...dealData,
          contactName: contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'
        }
        setDeals(prev => prev.map(d => 
          d.Id === selectedDeal.Id ? updatedDeal : d
        ))
      } else {
        const newDeal = await dealService.create(dealData)
        const contact = contacts.find(c => c.Id === dealData.contactId)
        const enrichedDeal = {
          ...newDeal,
          contactName: contact ? `${contact.firstName} ${contact.lastName}` : 'Unknown Contact'
        }
        setDeals(prev => [...prev, enrichedDeal])
      }
      setShowModal(false)
      setSelectedDeal(null)
    } catch (error) {
      throw error
    }
  }

  const getDealsByStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId)
  }

  const calculateStageValue = (stageId) => {
    const stageDeals = getDealsByStage(stageId)
    return stageDeals.reduce((sum, deal) => sum + deal.value, 0)
  }

  if (loading) {
    return <Loading type="kanban" />
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />
  }

return (
    <div className="space-y-4 sm:space-y-6">
      <div className="mobile-header">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">Deals</h1>
          <p className="text-gray-600 mt-1 text-sm sm:text-base">Track your sales pipeline</p>
        </div>
        <Button
          onClick={handleAddDeal}
          icon="Plus"
          className="w-full sm:w-auto"
        >
          Add Deal
        </Button>
      </div>

      {deals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage.id)
            const stageValue = calculateStageValue(stage.id)
            
            return (
              <div key={stage.id} className="min-w-72 sm:min-w-80 flex-shrink-0">
                <div className={`rounded-lg p-3 sm:p-4 mb-3 sm:mb-4 ${stage.color}`}>
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-semibold text-gray-900 text-sm sm:text-base">
                      {stage.name}
                    </h3>
                    <span className="text-xs sm:text-sm text-gray-600">
                      {stageDeals.length}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1">
                    ${stageValue.toLocaleString()}
                  </p>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  {stageDeals.map((deal) => (
                    <DealCard
                      key={deal.Id}
                      deal={deal}
                      onEdit={handleEditDeal}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <Empty
          title="No deals yet"
          description="Start tracking your sales opportunities by adding your first deal."
          actionLabel="Add Deal"
          onAction={handleAddDeal}
          icon="TrendingUp"
        />
      )}

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={selectedDeal ? 'Edit Deal' : 'Add New Deal'}
        size="lg"
      >
        <DealForm
          deal={selectedDeal}
          contacts={contacts}
          onSave={handleSaveDeal}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </div>
  )
}

export default Deals