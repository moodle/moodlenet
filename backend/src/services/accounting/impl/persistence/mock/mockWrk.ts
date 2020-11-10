import { AccountingPersistenceImpl } from '../../../types'

const mockImpl: AccountingPersistenceImpl = {
  async confirmVerifyEmail(_data) {
    return Math.random() > 0.5
  },
  async deleteAccountRegistrationRequest(_data) {
    return Math.random() > 0.5
  },
  async saveAccountRegistrationRequestJob(data) {
    return `WRK: storeSentEmail for ${data.jobId}`
  },
  async saveVerifyEmailJob(data) {
    return `WRK: storeSentEmail for ${data.jobId}`
  },
  async activateAccount(_data) {
    return Math.random() > 0.5
  },
}

module.exports = mockImpl
export default mockImpl
