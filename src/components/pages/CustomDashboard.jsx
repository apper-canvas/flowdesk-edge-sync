import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import DashboardBuilder from '@/components/organisms/DashboardBuilder'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { dashboardService } from '@/services/api/dashboardService'
import { toast } from 'react-toastify'

const CustomDashboard = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const dashboardId = searchParams.get('id')
  
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (dashboardId) {
      loadDashboard()
    } else {
      // Create new dashboard
      setDashboard({
        name: '',
        description: '',
        widgets: [],
        layout: [],
        filters: {
          dateRange: '30d',
          stage: 'all',
          assignee: 'all'
        }
      })
      setLoading(false)
    }
  }, [dashboardId])

  const loadDashboard = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await dashboardService.getById(dashboardId)
      setDashboard(data)
    } catch (err) {
      setError('Failed to load dashboard')
      console.error('Dashboard loading error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = (savedDashboard) => {
    toast.success(`Dashboard "${savedDashboard.name}" saved successfully`)
    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  if (loading) {
    return <Loading type="page" />
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={dashboardId ? loadDashboard : null}
        showRetry={!!dashboardId}
      />
    )
  }

  return (
    <div className="space-y-8">
      <DashboardBuilder
        dashboard={dashboard}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default CustomDashboard