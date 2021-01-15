import { MoodleNet } from '../../..'
import { ChangeAccountEmailRequestApiHandler } from '../apis/UserAccount.ChangeMainEmail.Request.'

ChangeAccountEmailRequestApiHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.ChangeMainEmail.Request',
    handler,
  })
})
