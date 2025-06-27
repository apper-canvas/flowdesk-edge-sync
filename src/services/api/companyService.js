import { mockData } from '@/services/mockData/companies'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const companyService = {
  async getAll() {
    await delay(300)
    return [...mockData]
  },

  async getById(id) {
    await delay(200)
    const company = mockData.find(item => item.Id === parseInt(id))
    if (!company) {
      throw new Error('Company not found')
    }
    return { ...company }
  },

  async create(companyData) {
    await delay(400)
    const maxId = Math.max(...mockData.map(item => item.Id), 0)
    const newCompany = {
      Id: maxId + 1,
      ...companyData,
      createdAt: new Date().toISOString()
    }
    mockData.push(newCompany)
    return { ...newCompany }
  },

  async update(id, companyData) {
    await delay(350)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Company not found')
    }
    mockData[index] = { ...mockData[index], ...companyData }
    return { ...mockData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Company not found')
    }
    const deletedCompany = mockData.splice(index, 1)[0]
    return { ...deletedCompany }
  }
}