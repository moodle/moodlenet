import { MoodleNet } from '../../..'
import { ChangeAccountEmailDeleteRequestApiHandler } from '../apis/UserAccount.ChangeMainEmail.DeleteRequest'

ChangeAccountEmailDeleteRequestApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.ChangeMainEmail.DeleteRequest',
    handler,
  })
})
