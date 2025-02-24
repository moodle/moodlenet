import { CONTENT_CATEGORIES_DATA_SETUP } from '../../../../../model/content.model/setup/data'
import { EDU_CATEGORIES_DATA_SETUP } from '../../../../../model/education.model/setup/configs'

export async function insertInitialData({ handle }: { handle: moo.model.handle }) {
  await handle.over(handle.model.content.categories.languages).bulkCreate.sync({ spaces: CONTENT_CATEGORIES_DATA_SETUP.languages })
  await handle.over(handle.model.content.categories.licenses).bulkCreate.sync({ spaces: CONTENT_CATEGORIES_DATA_SETUP.licenses })
  await handle.over(handle.model.education.categories.bloomCognitives).bulkCreate.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.bloomCognitives })
  await handle.over(handle.model.education.categories.iscedFields).bulkCreate.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.iscedFields })
  await handle.over(handle.model.education.categories.iscedLevels).bulkCreate.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.iscedLevels })
  await handle.over(handle.model.education.categories.resourceTypes).bulkCreate.sync({ spaces: EDU_CATEGORIES_DATA_SETUP.resourceTypes })
}
