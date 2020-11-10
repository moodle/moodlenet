import { EmailPersistenceImpl } from '../../../types'

const mockImpl: EmailPersistenceImpl = {
  async storeSentEmail(data) {
    return `WRK: storeSentEmail for ${data.job.name}:${data.job.id}`
  },
}

module.exports = mockImpl
export default mockImpl
