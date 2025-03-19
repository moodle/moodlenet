import type { searchUsers as searchUsersType } from '.'
import { byText } from './byText.core'
export const searchUsers: moo.core.usecase<searchUsersType> = {
  byText,
}
