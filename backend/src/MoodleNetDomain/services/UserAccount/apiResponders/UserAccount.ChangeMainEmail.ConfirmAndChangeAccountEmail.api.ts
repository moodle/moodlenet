import { MoodleNet } from '../../..'
import { ConfirmAndChangeAccountEmailHandler } from '../apis/UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail'

ConfirmAndChangeAccountEmailHandler().then((handler) => {
  MoodleNet.respondApi({
    api: 'UserAccount.ChangeMainEmail.ConfirmAndChangeAccountEmail',
    handler,
  })
})
