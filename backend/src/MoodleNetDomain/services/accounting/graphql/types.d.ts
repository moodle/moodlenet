import { Maybe } from '../../../../lib/helpers/types'

type AccountContext = {
  currentAccount: Maybe<{ username: string }>
}
