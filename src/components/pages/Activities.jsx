import React, { useState, useEffect } from 'react'
import ActivityItem from '@/components/molecules/ActivityItem'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import { activityService } from '@/services/api/activityService'

const Activities = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const activityTypes = [
    { value: 'all', label: 'All Activities' },
    { value: 'call', label: 'Calls' },
    { value: 'email', label: 'Emails' },
    { value: 'meeting', label: 'Meetings' },
    { value: 'note', label: 'Notes' },
    { value: 'task', label: 'Tasks' }
  ]

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError('')
      
      const data = await activityService.getAll()
      setActivities(data)
      setFilteredActivities(data)
    } catch (err) {
      setError('Failed to load activities')
      console.error('Activities error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [])

  useEffect(() => {
    let filtered = activities

    // Filter by search query
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter(activity =>
        activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (activity.contactName && activity.contactName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (activity.dealTitle && activity.dealTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(activity => activity.type === filterType)
    }

    setFilteredActivities(filtered)
  }, [searchQuery, filterType, activities])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Error message={error} onRetry={loadActivities} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Activities</h1>
          <p className="text-gray-600 mt-1">Track all customer interactions</p>
        </div>
        <Button
          icon="Plus"
        >
          Log Activity
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <SearchBar
          onSearch={setSearchQuery}
          placeholder="Search activities..."
          className="flex-1 max-w-md"
        />
        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          options={activityTypes}
          className="w-48"
        />
      </div>

      {filteredActivities.length > 0 ? (
        <div className="card-premium divide-y divide-gray-100">
          {filteredActivities.map((activity) => (
            <ActivityItem key={activity.Id} activity={activity} />
          ))}
        </div>
      ) : (
        <Empty
          title="No activities found"
          description={searchQuery || filterType !== 'all' 
            ? "Try adjusting your search or filter criteria."
            : "Start logging your customer interactions to build a comprehensive activity history."
          }
          actionLabel="Log Activity"
          icon="Activity"
        />
      )}
    </div>
  )
}

export default Activities