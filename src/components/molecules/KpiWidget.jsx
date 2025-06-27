import React from 'react'
import ApperIcon from '@/components/ApperIcon'

const KpiWidget = ({ widget, data, className = '' }) => {
  const { title, config } = widget
  const { icon, color } = config

  const colorClasses = {
    blue: {
      icon: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    green: {
      icon: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200'
    },
    purple: {
      icon: 'text-purple-600',
      bg: 'bg-purple-50',
      border: 'border-purple-200'
    },
    orange: {
      icon: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    indigo: {
      icon: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    },
    teal: {
      icon: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200'
    }
  }

  const currentColor = colorClasses[color] || colorClasses.blue

  const renderContent = () => {
    switch (config.type || widget.type) {
      case 'kpi':
        return (
          <div className="text-center">
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${currentColor.bg} ${currentColor.border} border mb-4`}>
              <ApperIcon name={icon} className={`w-6 h-6 ${currentColor.icon}`} />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {data?.value?.toLocaleString() || '0'}
            </div>
            <div className="text-sm text-gray-600 mb-2">{title}</div>
            {data?.change && (
              <div className={`text-xs font-medium ${
                data.changeType === 'positive' ? 'text-green-600' : 
                data.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {data.change}
              </div>
            )}
          </div>
        )

      case 'chart':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <ApperIcon name={icon} className={`w-5 h-5 ${currentColor.icon}`} />
            </div>
            <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center text-gray-500">
                <ApperIcon name="TrendingUp" className="w-8 h-8 mx-auto mb-2" />
                <div className="text-sm">Chart visualization</div>
                <div className="text-2xl font-bold mt-2">
                  {data?.value ? `$${data.value.toLocaleString()}` : '$0'}
                </div>
              </div>
            </div>
          </div>
        )

      case 'pipeline':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <ApperIcon name={icon} className={`w-5 h-5 ${currentColor.icon}`} />
            </div>
            <div className="space-y-3">
              {data?.stages?.map((stage, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium capitalize">{stage.name}</span>
                    <span className="text-gray-600">{stage.count} deals</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r from-${color}-400 to-${color}-600 h-2 rounded-full transition-all duration-300`}
                      style={{ width: `${stage.percentage}%` }}
                    />
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  <ApperIcon name="BarChart3" className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">Pipeline data loading...</div>
                </div>
              )}
            </div>
          </div>
        )

      case 'list':
        return (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <ApperIcon name={icon} className={`w-5 h-5 ${currentColor.icon}`} />
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {data?.items?.slice(0, config.limit || 5).map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${currentColor.bg}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.title || item.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'Recently'}
                    </div>
                  </div>
                </div>
              )) || (
                <div className="text-center text-gray-500 py-4">
                  <ApperIcon name="Activity" className="w-8 h-8 mx-auto mb-2" />
                  <div className="text-sm">No recent activities</div>
                </div>
              )}
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <ApperIcon name="AlertCircle" className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <div className="text-sm text-gray-500">Widget type not supported</div>
          </div>
        )
    }
  }

  return (
    <div className={`card-premium p-6 h-full ${className}`}>
      {renderContent()}
    </div>
  )
}

export default KpiWidget