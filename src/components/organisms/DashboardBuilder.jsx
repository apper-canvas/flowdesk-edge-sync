import React, { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import DashboardGrid from '@/components/molecules/DashboardGrid'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Modal from '@/components/organisms/Modal'
import ApperIcon from '@/components/ApperIcon'
import { dashboardService } from '@/services/api/dashboardService'
import { toast } from 'react-toastify'

const DashboardBuilder = ({ 
  dashboard, 
  onSave, 
  onCancel,
  className = '' 
}) => {
  const [currentDashboard, setCurrentDashboard] = useState(dashboard)
  const [availableWidgets, setAvailableWidgets] = useState([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [dashboardName, setDashboardName] = useState(dashboard?.name || '')
  const [dashboardDescription, setDashboardDescription] = useState(dashboard?.description || '')
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  useEffect(() => {
    loadAvailableWidgets()
  }, [])

  const loadAvailableWidgets = async () => {
    try {
      const widgets = await dashboardService.getWidgets()
      setAvailableWidgets(widgets)
    } catch (error) {
      console.error('Error loading widgets:', error)
      toast.error('Failed to load available widgets')
    }
  }

  const handleAddWidget = (widgetId) => {
    const widget = availableWidgets.find(w => w.id === widgetId)
    if (!widget || currentDashboard.widgets.includes(widgetId)) {
      return
    }

    const newLayout = [...currentDashboard.layout]
    const maxY = Math.max(...newLayout.map(item => item.y + item.h), 0)
    
    newLayout.push({
      i: widgetId,
      x: 0,
      y: maxY,
      w: 6,
      h: 4
    })

    setCurrentDashboard({
      ...currentDashboard,
      widgets: [...currentDashboard.widgets, widgetId],
      layout: newLayout
    })

    toast.success(`${widget.title} widget added`)
  }

  const handleRemoveWidget = (widgetId) => {
    setCurrentDashboard({
      ...currentDashboard,
      widgets: currentDashboard.widgets.filter(id => id !== widgetId),
      layout: currentDashboard.layout.filter(item => item.i !== widgetId)
    })

    const widget = availableWidgets.find(w => w.id === widgetId)
    toast.success(`${widget?.title || 'Widget'} removed`)
  }

  const handleLayoutChange = (layout) => {
    setCurrentDashboard({
      ...currentDashboard,
      layout
    })
  }

  const handleSave = async () => {
    if (!dashboardName.trim()) {
      toast.error('Dashboard name is required')
      return
    }

    try {
      setLoading(true)
      const dashboardData = {
        ...currentDashboard,
        name: dashboardName,
        description: dashboardDescription
      }

      let savedDashboard
      if (dashboard?.Id) {
        savedDashboard = await dashboardService.update(dashboard.Id, dashboardData)
        toast.success('Dashboard updated successfully')
      } else {
        savedDashboard = await dashboardService.create(dashboardData)
        toast.success('Dashboard created successfully')
      }

      if (onSave) {
        onSave(savedDashboard)
      }
      setShowSaveModal(false)
    } catch (error) {
      console.error('Error saving dashboard:', error)
      toast.error('Failed to save dashboard')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setCurrentDashboard(dashboard)
    toast.info('Dashboard reset to original state')
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const sourceIndex = result.source.index
    const destIndex = result.destination.index

    if (result.source.droppableId === 'available' && result.destination.droppableId === 'dashboard') {
      const widgetId = availableWidgets[sourceIndex].id
      handleAddWidget(widgetId)
    }
  }

  const currentWidgets = availableWidgets.filter(w => 
    currentDashboard.widgets.includes(w.id)
  )

  const unusedWidgets = availableWidgets.filter(w => 
    !currentDashboard.widgets.includes(w.id)
  )

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold gradient-text">
            {dashboard?.Id ? 'Edit Dashboard' : 'Create Dashboard'}
          </h1>
          <p className="text-gray-600 mt-1">
            Customize your dashboard by adding, removing, and arranging widgets
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="secondary"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-2"
          >
            <ApperIcon name={previewMode ? "Edit" : "Eye"} size={16} />
            <span>{previewMode ? 'Edit' : 'Preview'}</span>
          </Button>
          <Button
            variant="secondary"
            onClick={handleReset}
            disabled={loading}
          >
            Reset
          </Button>
          <Button
            onClick={() => setShowSaveModal(true)}
            disabled={loading}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Save" size={16} />
            <span>Save Dashboard</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Widget Library */}
        {!previewMode && (
          <div className="lg:col-span-1">
            <div className="card-premium p-4 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="Package" className="w-5 h-5 mr-2" />
                Available Widgets
              </h3>
              
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="available">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {unusedWidgets.map((widget, index) => (
                        <Draggable key={widget.id} draggableId={widget.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border border-gray-200 rounded-lg cursor-grab hover:border-primary-300 transition-colors ${
                                snapshot.isDragging ? 'shadow-lg border-primary-500' : ''
                              }`}
                              onClick={() => handleAddWidget(widget.id)}
                            >
                              <div className="flex items-center space-x-3">
                                <ApperIcon 
                                  name={widget.config.icon} 
                                  className="w-5 h-5 text-gray-600" 
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm font-medium text-gray-900 truncate">
                                    {widget.title}
                                  </div>
                                  <div className="text-xs text-gray-500 capitalize">
                                    {widget.type}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              {unusedWidgets.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <ApperIcon name="CheckCircle" className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">All widgets added</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dashboard Canvas */}
        <div className={previewMode ? 'lg:col-span-4' : 'lg:col-span-3'}>
          <div className="card-premium p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">
                {currentDashboard.name || 'Dashboard Preview'}
              </h3>
              {!previewMode && (
                <div className="text-sm text-gray-500">
                  Drag widgets to rearrange • Click widget corner to resize
                </div>
              )}
            </div>

            {currentDashboard.widgets.length > 0 ? (
              <DashboardGrid
                dashboard={currentDashboard}
                widgets={availableWidgets}
                onLayoutChange={handleLayoutChange}
                isDraggable={!previewMode}
                isResizable={!previewMode}
              />
            ) : (
              <div className="text-center py-16 text-gray-500">
                <ApperIcon name="LayoutDashboard" className="w-12 h-12 mx-auto mb-4" />
                <div className="text-lg font-medium mb-2">Start Building Your Dashboard</div>
                <div className="text-sm">
                  Add widgets from the library to create your custom dashboard
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Widgets */}
      {!previewMode && currentWidgets.length > 0 && (
        <div className="card-premium p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Active Widgets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentWidgets.map(widget => (
              <div key={widget.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <ApperIcon name={widget.config.icon} className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">{widget.title}</div>
                    <div className="text-sm text-gray-500 capitalize">{widget.type}</div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleRemoveWidget(widget.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <ApperIcon name="X" size={14} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        title={dashboard?.Id ? 'Update Dashboard' : 'Save Dashboard'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dashboard Name *
            </label>
            <Input
              value={dashboardName}
              onChange={(e) => setDashboardName(e.target.value)}
              placeholder="Enter dashboard name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <Input
              value={dashboardDescription}
              onChange={(e) => setDashboardDescription(e.target.value)}
              placeholder="Enter dashboard description"
            />
          </div>
          <div className="flex items-center space-x-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Saving...' : dashboard?.Id ? 'Update' : 'Save'}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowSaveModal(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default DashboardBuilder