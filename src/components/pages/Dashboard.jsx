import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '@/components/molecules/StatCard'
import ActivityItem from '@/components/molecules/ActivityItem'
import DashboardGrid from '@/components/molecules/DashboardGrid'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import Select from '@/components/atoms/Select'
import ApperIcon from '@/components/ApperIcon'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { activityService } from '@/services/api/activityService'
import { dashboardService } from '@/services/api/dashboardService'
import { toast } from 'react-toastify'
const Dashboard = () => {
  const navigate = useNavigate()
  const [contacts, setContacts] = useState([])
  const [deals, setDeals] = useState([])
  const [activities, setActivities] = useState([])
  const [savedDashboards, setSavedDashboards] = useState([])
  const [currentDashboard, setCurrentDashboard] = useState(null)
  const [availableWidgets, setAvailableWidgets] = useState([])
  const [viewMode, setViewMode] = useState('default') // 'default' or 'custom'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [contactsData, dealsData, activitiesData, dashboardsData, widgetsData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        dashboardService.getAll(),
        dashboardService.getWidgets()
      ])
      
      setContacts(contactsData)
      setDeals(dealsData)
      setActivities(activitiesData.slice(0, 10))
      setSavedDashboards(dashboardsData)
      setAvailableWidgets(widgetsData)
      
      // Set default dashboard
      const defaultDash = dashboardsData.find(d => d.isDefault)
      if (defaultDash) {
        setCurrentDashboard(defaultDash)
      }
    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard error:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  const handleDashboardChange = async (dashboardId) => {
    if (dashboardId === 'default') {
      setViewMode('default')
      setCurrentDashboard(null)
      return
    }

    try {
      const dashboard = await dashboardService.getById(dashboardId)
      setCurrentDashboard(dashboard)
      setViewMode('custom')
      toast.success(`Switched to "${dashboard.name}" dashboard`)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Failed to load dashboard')
    }
  }

  const handleCreateDashboard = () => {
    navigate('/dashboard/builder')
  }

  const handleEditDashboard = (dashboardId) => {
    navigate(`/dashboard/builder?id=${dashboardId}`)
  }

  const calculateStats = () => {
    const totalContacts = contacts.length
    const totalDeals = deals.length
    const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0)
    const wonDeals = deals.filter(deal => deal.stage === 'closed-won')
    const totalWonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0)
    
    return {
      totalContacts,
      totalDeals,
      totalDealValue,
      totalWonValue
    }
  }

  if (loading) {
    return <Loading type="dashboard" />
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />
  }

  const stats = calculateStats()

return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your sales.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select
            value={currentDashboard?.Id || 'default'}
            onChange={(e) => handleDashboardChange(e.target.value)}
            className="min-w-48"
          >
            <option value="default">Default Dashboard</option>
            {savedDashboards.map(dashboard => (
              <option key={dashboard.Id} value={dashboard.Id}>
                {dashboard.name}
              </option>
            ))}
          </Select>
          {currentDashboard && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleEditDashboard(currentDashboard.Id)}
              className="flex items-center space-x-2"
            >
              <ApperIcon name="Edit" size={14} />
              <span>Edit</span>
            </Button>
          )}
          <Button
            size="sm"
            onClick={handleCreateDashboard}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Plus" size={14} />
            <span>Create Dashboard</span>
          </Button>
        </div>
      </div>
{/* Dashboard Content */}
      {viewMode === 'custom' && currentDashboard ? (
        <DashboardGrid
          dashboard={currentDashboard}
          widgets={availableWidgets}
          isDraggable={false}
          isResizable={false}
        />
      ) : (
        <>
          {/* Default Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Contacts"
              value={stats.totalContacts.toLocaleString()}
              icon="Users"
              change="+12%"
              changeType="positive"
            />
            <StatCard
              title="Active Deals"
              value={stats.totalDeals.toLocaleString()}
              icon="TrendingUp"
              change="+8%"
              changeType="positive"
            />
            <StatCard
              title="Pipeline Value"
              value={`$${stats.totalDealValue.toLocaleString()}`}
              icon="DollarSign"
              change="+23%"
              changeType="positive"
            />
            <StatCard
              title="Won Deals"
              value={`$${stats.totalWonValue.toLocaleString()}`}
              icon="Target"
              change="+15%"
              changeType="positive"
            />
          </div>

          {/* Default Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Pipeline Overview */}
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">Pipeline Overview</h2>
                <ApperIcon name="TrendingUp" className="w-5 h-5 text-primary-600" />
              </div>
              
              <div className="space-y-4">
                {['prospecting', 'qualification', 'proposal', 'negotiation'].map((stage) => {
                  const stageDeals = deals.filter(deal => deal.stage === stage)
                  const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0)
                  const percentage = stats.totalDealValue > 0 ? (stageValue / stats.totalDealValue) * 100 : 0
                  
                  return (
                    <div key={stage} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700 capitalize">
                          {stage} ({stageDeals.length})
                        </span>
                        <span className="text-sm text-gray-600">
                          ${stageValue.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Recent Activities */}
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-semibold text-gray-900">Recent Activities</h2>
                <ApperIcon name="Activity" className="w-5 h-5 text-primary-600" />
              </div>
              
              <div className="space-y-2">
                {activities.length > 0 ? (
                  activities.map((activity) => (
                    <ActivityItem key={activity.Id} activity={activity} />
                  ))
                ) : (
                  <Empty
                    title="No activities yet"
                    description="Start by adding contacts and deals to see activities here."
                    icon="Activity"
                  />
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard