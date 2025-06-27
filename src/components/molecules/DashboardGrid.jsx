import React, { useState, useEffect } from 'react'
import { Responsive, WidthProvider } from 'react-grid-layout'
import KpiWidget from '@/components/molecules/KpiWidget'
import { contactService } from '@/services/api/contactService'
import { dealService } from '@/services/api/dealService'
import { activityService } from '@/services/api/activityService'
import { companyService } from '@/services/api/companyService'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'

const ResponsiveGridLayout = WidthProvider(Responsive)

const DashboardGrid = ({ 
  dashboard, 
  widgets, 
  onLayoutChange, 
  isDraggable = true,
  isResizable = true 
}) => {
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWidgetData()
  }, [dashboard, widgets])

  const loadWidgetData = async () => {
    try {
      setLoading(true)
      const [contacts, deals, activities, companies] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        activityService.getAll(),
        companyService.getAll()
      ])

      const widgetData = {}
      
      widgets.forEach(widget => {
        switch (widget.config.source) {
          case 'contacts':
            widgetData[widget.id] = {
              value: contacts.length,
              change: '+12%',
              changeType: 'positive'
            }
            break
          case 'deals':
            if (widget.type === 'pipeline') {
              const stages = ['prospecting', 'qualification', 'proposal', 'negotiation']
              const totalDeals = deals.length
              widgetData[widget.id] = {
                stages: stages.map(stage => {
                  const stageDeals = deals.filter(deal => deal.stage === stage)
                  return {
                    name: stage,
                    count: stageDeals.length,
                    percentage: totalDeals > 0 ? (stageDeals.length / totalDeals) * 100 : 0
                  }
                })
              }
            } else {
              widgetData[widget.id] = {
                value: widget.config.metric === 'sum' 
                  ? deals.reduce((sum, deal) => sum + deal.value, 0)
                  : deals.length,
                change: '+8%',
                changeType: 'positive'
              }
            }
            break
          case 'activities':
            widgetData[widget.id] = {
              items: activities.slice(0, widget.config.limit || 10)
            }
            break
          case 'companies':
            widgetData[widget.id] = {
              value: companies.length,
              change: '+5%',
              changeType: 'positive'
            }
            break
        }
      })

      setData(widgetData)
    } catch (error) {
      console.error('Error loading widget data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLayoutChange = (layout) => {
    if (onLayoutChange) {
      onLayoutChange(layout)
    }
  }

  const breakpoints = {
    lg: 1200,
    md: 996,
    sm: 768,
    xs: 480,
    xxs: 0
  }

  const cols = {
    lg: 12,
    md: 10,
    sm: 6,
    xs: 4,
    xxs: 2
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="card-premium p-6 animate-pulse">
            <div className="flex items-center justify-center h-32">
              <div className="w-12 h-12 bg-gray-200 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full">
      <ResponsiveGridLayout
        className="layout"
        layouts={{ lg: dashboard.layout }}
        breakpoints={breakpoints}
        cols={cols}
        rowHeight={60}
        onLayoutChange={handleLayoutChange}
        isDraggable={isDraggable}
        isResizable={isResizable}
        margin={[16, 16]}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        draggableHandle=".drag-handle"
      >
        {dashboard.widgets.map(widgetId => {
          const widget = widgets.find(w => w.id === widgetId)
          if (!widget) return null
          
          return (
            <div key={widgetId} className="relative">
              {isDraggable && (
                <div className="drag-handle absolute top-2 right-2 p-1 rounded cursor-move opacity-0 hover:opacity-100 transition-opacity bg-gray-100 hover:bg-gray-200">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
                  </svg>
                </div>
              )}
              <KpiWidget 
                widget={widget} 
                data={data[widgetId]} 
                className="h-full"
              />
            </div>
          )
        })}
      </ResponsiveGridLayout>
    </div>
  )
}

export default DashboardGrid