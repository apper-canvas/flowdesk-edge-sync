import { mockData } from '@/services/mockData/deals'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const dealService = {
  async getAll() {
    await delay(300)
    return [...mockData]
  },

  async getById(id) {
    await delay(200)
    const deal = mockData.find(item => item.Id === parseInt(id))
    if (!deal) {
      throw new Error('Deal not found')
    }
    return { ...deal }
  },

  async create(dealData) {
    await delay(400)
    const maxId = Math.max(...mockData.map(item => item.Id), 0)
    const newDeal = {
      Id: maxId + 1,
      ...dealData,
      createdAt: new Date().toISOString()
    }
    mockData.push(newDeal)
    return { ...newDeal }
  },

  async update(id, dealData) {
    await delay(350)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Deal not found')
    }
    mockData[index] = { ...mockData[index], ...dealData }
    return { ...mockData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Deal not found')
    }
    const deletedDeal = mockData.splice(index, 1)[0]
    return { ...deletedDeal }
  }
}