import { mockData } from '@/services/mockData/activities'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const activityService = {
  async getAll() {
    await delay(300)
    return [...mockData]
  },

  async getById(id) {
    await delay(200)
    const activity = mockData.find(item => item.Id === parseInt(id))
    if (!activity) {
      throw new Error('Activity not found')
    }
    return { ...activity }
  },

  async create(activityData) {
    await delay(400)
    const maxId = Math.max(...mockData.map(item => item.Id), 0)
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    }
    mockData.push(newActivity)
    return { ...newActivity }
  },

  async update(id, activityData) {
    await delay(350)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Activity not found')
    }
    mockData[index] = { ...mockData[index], ...activityData }
    return { ...mockData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Activity not found')
    }
    const deletedActivity = mockData.splice(index, 1)[0]
    return { ...deletedActivity }
  }
}