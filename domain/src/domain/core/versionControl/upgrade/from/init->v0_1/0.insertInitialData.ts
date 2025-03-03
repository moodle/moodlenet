import { CONTENT_CATEGORIES_DATA_SETUP } from '../../../../../model/content.model/setup/data'
import { EDU_CATEGORIES_DATA_SETUP } from '../../../../../model/education.model/setup/configs'

export async function insertInitialData({ handle }: { handle: moo.model.handle }) {
  await handle.over(handle.model.content.categories.languages).createMany.sync({ spaces: CONTENT_CATEGORIES_DATA_SETUP.languages })
  await handle.over(handle.model.content.categories.licenses).createMany.sync({ spaces: CONTENT_CATEGORIES_DATA_SETUP.licenses })
  await handle.over(handle.model.education.categories.bloomCognitives).createMany.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.bloomCognitives })
  await handle.over(handle.model.education.categories.iscedFields).createMany.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.iscedFields })
  await handle.over(handle.model.education.categories.iscedLevels).createMany.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.iscedLevels })
  await handle.over(handle.model.education.categories.resourceTypes).createMany.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.resourceTypes })
}
