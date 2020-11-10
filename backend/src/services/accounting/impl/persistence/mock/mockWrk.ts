import { AccountingPersistenceImpl } from '../../../types'

const mockImpl: AccountingPersistenceImpl = {
  async confirmVerifyEmail(_data) {
    console.log(`\nconfirmVerifyEmail `, _data, '\n')
    return { id: 'jobId-confirmVerifyEmail', msgId: 'msgId', name: 'jobname-confirmVerifyEmail' }
  },
  async deleteAccountRegistrationRequest(_data) {
    console.log(`\ndeleteAccountRegistrationRequest `, _data, '\n')
    return {
      id: 'jobId-deleteAccountRegistrationRequest',
      msgId: 'msgId',
      name: 'jobname-deleteAccountRegistrationRequest',
    }
  },
  async saveAccountRegistrationRequestJob(_data) {
    console.log(`\nsaveAccountRegistrationRequestJob `, _data, '\n')
    return {
      id: 'jobId-saveAccountRegistrationRequestJob',
      msgId: 'msgId',
      name: 'jobname-saveAccountRegistrationRequestJob',
    }
  },
  async saveVerifyEmailJob(_data) {
    console.log(`\nsaveVerifyEmailJob `, _data, '\n')
    return { id: 'jobId-saveVerifyEmailJob', msgId: 'msgId', name: 'jobname-saveVerifyEmailJob' }
  },
  async activateAccount(_data) {
    console.log(`\nactivateAccount `, _data, '\n')
    return { id: 'jobId-activateAccount', msgId: 'msgId', name: 'jobname-activateAccount' }
  },
  async updateVerifyEmailProgress(_data) {
    console.log(`\nupdateVerifyEmailProgress `, _data, '\n')
    return {
      id: 'jobId-updateVerifyEmailProgress',
      msgId: 'msgId',
      name: 'jobname-updateVerifyEmailProgress',
    }
  },
}

module.exports = mockImpl
export default mockImpl
