import { curateMyDrafts } from './curateMyDrafts.scope/curateMyDrafts.scope.core'
import { curateMyProfile } from './curateMyProfile.scope/curateMyProfile.scope.core'
import type { mySpace as mySpace_def } from '.'
export const mySpace: moo.core.context<mySpace_def> = {
  curateMyDrafts,
  curateMyProfile,
}
