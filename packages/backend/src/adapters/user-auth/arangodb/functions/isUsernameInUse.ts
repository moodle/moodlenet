import { aqlstr } from '../../../../lib/helpers/arango'
import { USER } from '../types'

export const isUsernameInUseQ = ({ username }: { username: string }) => `
  FOR user IN ${USER}
  FILTER user.username == ${aqlstr(username)}
  LIMIT 1
  RETURN true
`
