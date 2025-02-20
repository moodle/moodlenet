import { curateMyDrafts } from './curateMyDrafts.scope/curateMyDrafts.scope.core'
import { curateMyProfile } from './curateMyProfile.scope/curateMyProfile.scope.core'
import type { mySpace as mySpaceType } from '.'
export const mySpace: moo.core.context<mySpaceType> ={
  curateMyDrafts,
  curateMyProfile
}
