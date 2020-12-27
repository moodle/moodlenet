import { Maybe } from '../../../../lib/helpers/types'

type ContentGraphContext = {
  currentUser: Maybe<{ _id: string }>
}
