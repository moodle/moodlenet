import { aqlstr } from '../../../../lib/helpers/arango'
import { USER } from '../types'

export const isEmailInUseQ = ({ email }: { email: string }) => `
  FOR user IN ${USER}
  FILTER user.email == ${aqlstr(email)}
    || user.changeEmailRequest.email == ${aqlstr(email)}
  LIMIT 1
  RETURN true
`
