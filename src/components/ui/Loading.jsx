import React from 'react'

const Loading = ({ type = 'default' }) => {
  if (type === 'dashboard') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="card p-6">
              <div className="shimmer h-4 bg-gray-200 rounded w-20 mb-4"></div>
              <div className="shimmer h-8 bg-gray-200 rounded w-16 mb-2"></div>
              <div className="shimmer h-3 bg-gray-200 rounded w-24"></div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="card p-6">
            <div className="shimmer h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="shimmer h-64 bg-gray-200 rounded"></div>
          </div>
          <div className="card p-6">
            <div className="shimmer h-6 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="shimmer h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="shimmer h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                    <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (type === 'contacts') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="shimmer h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="shimmer h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="shimmer h-3 bg-gray-200 rounded w-full"></div>
                <div className="shimmer h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === 'kanban') {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, columnIndex) => (
            <div key={columnIndex} className="space-y-4">
              <div className="shimmer h-8 bg-gray-200 rounded w-24 mb-4"></div>
              {Array.from({ length: 3 }).map((_, cardIndex) => (
                <div key={cardIndex} className="card p-4">
                  <div className="shimmer h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="shimmer h-3 bg-gray-200 rounded w-2/3 mb-3"></div>
                  <div className="shimmer h-6 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="shimmer h-10 w-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="shimmer h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="shimmer h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Loading