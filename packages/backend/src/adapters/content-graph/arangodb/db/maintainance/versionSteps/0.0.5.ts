import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { MNStaticEnv } from '../../../../../../lib/types'
import { remapIscedGrades } from './0.0.5/remapIscedGrades'
import { rePopulateIscedFields } from './0.0.5/rePopulateIscedFields'
import { rePopulateIscedGrades } from './0.0.5/rePopulateIscedGrades'
import { setCreatorAuthIdAndCreatedToUserEntities } from './0.0.5/setCreatorAuthIdAndCreatedToUserEntities'
import { setProperPublishedToAllEntities } from './0.0.5/setProperPublishedToAllEntities'

const v_0_0_5: VersionUpdater<MNStaticEnv> = {
  async pullUp({ db /* , ctx: { domain } */ }) {
    await rePopulateIscedFields({ db })
    await rePopulateIscedGrades({ db })
    await remapIscedGrades({ db })
    await setCreatorAuthIdAndCreatedToUserEntities({ db })
    await setProperPublishedToAllEntities({ db })
  },
  async pushDown() {
    throw new Error(`v_0_0_5 pushDown not implemented`)
  },
}

module.exports = v_0_0_5
