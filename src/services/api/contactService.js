import { mockData } from '@/services/mockData/contacts'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const contactService = {
  async getAll() {
    await delay(300)
    return [...mockData]
  },

  async getById(id) {
    await delay(200)
    const contact = mockData.find(item => item.Id === parseInt(id))
    if (!contact) {
      throw new Error('Contact not found')
    }
    return { ...contact }
  },

  async create(contactData) {
    await delay(400)
    const maxId = Math.max(...mockData.map(item => item.Id), 0)
    const newContact = {
      Id: maxId + 1,
      ...contactData,
      createdAt: new Date().toISOString()
    }
    mockData.push(newContact)
    return { ...newContact }
  },

  async update(id, contactData) {
    await delay(350)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    mockData[index] = { ...mockData[index], ...contactData }
    return { ...mockData[index] }
  },

  async delete(id) {
    await delay(250)
    const index = mockData.findIndex(item => item.Id === parseInt(id))
    if (index === -1) {
      throw new Error('Contact not found')
    }
    const deletedContact = mockData.splice(index, 1)[0]
    return { ...deletedContact }
  }
}