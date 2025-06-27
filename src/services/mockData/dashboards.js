const mockDashboards = [
  {
    Id: 1,
    name: 'Sales Performance',
    description: 'Track sales metrics and pipeline performance',
    isDefault: true,
    layout: [
      { i: 'contacts', x: 0, y: 0, w: 6, h: 4 },
      { i: 'deals', x: 6, y: 0, w: 6, h: 4 },
      { i: 'revenue', x: 0, y: 4, w: 6, h: 4 },
      { i: 'pipeline', x: 6, y: 4, w: 6, h: 4 }
    ],
    widgets: ['contacts', 'deals', 'revenue', 'pipeline'],
    filters: {
      dateRange: '30d',
      stage: 'all',
      assignee: 'all'
    },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    Id: 2,
    name: 'Executive Overview',
    description: 'High-level metrics for leadership team',
    isDefault: false,
    layout: [
      { i: 'revenue', x: 0, y: 0, w: 8, h: 6 },
      { i: 'deals', x: 8, y: 0, w: 4, h: 6 },
      { i: 'activities', x: 0, y: 6, w: 12, h: 4 }
    ],
    widgets: ['revenue', 'deals', 'activities'],
    filters: {
      dateRange: '90d',
      stage: 'all',
      assignee: 'all'
    },
    createdAt: '2024-01-18T09:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  }
]

const mockWidgets = [
  {
    id: 'contacts',
    title: 'Total Contacts',
    type: 'kpi',
    config: {
      metric: 'count',
      source: 'contacts',
      icon: 'Users',
      color: 'blue'
    }
  },
  {
    id: 'deals',
    title: 'Active Deals',
    type: 'kpi',
    config: {
      metric: 'count',
      source: 'deals',
      icon: 'TrendingUp',
      color: 'green'
    }
  },
  {
    id: 'revenue',
    title: 'Revenue',
    type: 'chart',
    config: {
      metric: 'sum',
      source: 'deals',
      field: 'value',
      chartType: 'line',
      icon: 'DollarSign',
      color: 'purple'
    }
  },
  {
    id: 'pipeline',
    title: 'Pipeline Overview',
    type: 'pipeline',
    config: {
      source: 'deals',
      groupBy: 'stage',
      icon: 'BarChart3',
      color: 'orange'
    }
  },
  {
    id: 'activities',
    title: 'Recent Activities',
    type: 'list',
    config: {
      source: 'activities',
      limit: 10,
      icon: 'Activity',
      color: 'indigo'
    }
  },
  {
    id: 'companies',
    title: 'Companies',
    type: 'kpi',
    config: {
      metric: 'count',
      source: 'companies',
      icon: 'Building',
      color: 'teal'
    }
  }
]

export default mockDashboards
export { mockWidgets }