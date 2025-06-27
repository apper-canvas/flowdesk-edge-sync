import mockDashboards, { mockWidgets } from '@/services/mockData/dashboards'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const dashboardService = {
  async getAll() {
    await delay(300)
    return [...mockDashboards]
  },

  async getById(id) {
    await delay(200)
    const dashboard = mockDashboards.find(item => item.Id === parseInt(id))
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }
    return { ...dashboard }
  },

  async create(dashboardData) {
    await delay(400)
    const maxId = Math.max(...mockDashboards.map(item => item.Id), 0)
    const newDashboard = {
      Id: maxId + 1,
      ...dashboardData,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockDashboards.push(newDashboard)
    return { ...newDashboard }
  },

  async update(id, dashboardData) {
    await delay(350)
    const index = mockDashboards.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Dashboard not found')
    }
    mockDashboards[index] = { 
      ...mockDashboards[index], 
      ...dashboardData,
      updatedAt: new Date().toISOString()
    }
    return { ...mockDashboards[index] }
  },

  async delete(id) {
    await delay(250)
    const index = mockDashboards.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Dashboard not found')
    }
    const deletedDashboard = mockDashboards.splice(index, 1)[0]
    return { ...deletedDashboard }
  },

  async getWidgets() {
    await delay(200)
    return [...mockWidgets]
  },

  async getDefaultDashboard() {
    await delay(250)
    const defaultDashboard = mockDashboards.find(d => d.isDefault)
    return defaultDashboard ? { ...defaultDashboard } : null
  },

  async saveDashboardLayout(id, layout) {
    await delay(300)
    const index = mockDashboards.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Dashboard not found')
    }
    mockDashboards[index] = {
      ...mockDashboards[index],
      layout,
      updatedAt: new Date().toISOString()
    }
    return { ...mockDashboards[index] }
  },

  async duplicateDashboard(id) {
    await delay(350)
    const dashboard = mockDashboards.find(item => item.Id === parseInt(id))
    if (!dashboard) {
      throw new Error('Dashboard not found')
    }
    const maxId = Math.max(...mockDashboards.map(item => item.Id), 0)
    const duplicatedDashboard = {
      ...dashboard,
      Id: maxId + 1,
      name: `Copy of ${dashboard.name}`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockDashboards.push(duplicatedDashboard)
    return { ...duplicatedDashboard }
  }
}