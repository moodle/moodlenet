import { CONTENT_CATEGORIES_DATA_SETUP } from '../../../../../model/content.model/setup/data'
import { EDU_CATEGORIES_DATA_SETUP } from '../../../../../model/education.model/setup/configs'

export async function insertInitialData({ handle }: { handle: moo.model.handle }) {
  await Promise.all([
    Promise.all(
      CONTENT_CATEGORIES_DATA_SETUP.languages.map(language => handle.over(handle.model.content.categories.languages[language.id]).create.sync({ spaceData: language.data })),
    ),
    Promise.all(CONTENT_CATEGORIES_DATA_SETUP.licenses.map(license => handle.over(handle.model.content.categories.licenses[license.id]).create.sync({ spaceData: license.data }))),
    Promise.all(
      EDU_CATEGORIES_DATA_SETUP.bloomCognitives.map(bloomCognitive =>
        handle.over(handle.model.education.categories.bloomCognitives[bloomCognitive.id]).create.sync({ spaceData: bloomCognitive.data }),
      ),
    ),
    Promise.all(
      EDU_CATEGORIES_DATA_SETUP.iscedFields.map(iscedField =>
        handle.over(handle.model.education.categories.iscedFields[iscedField.id]).create.sync({ spaceData: iscedField.data }),
      ),
    ),
    Promise.all(
      EDU_CATEGORIES_DATA_SETUP.iscedLevels.map(iscedLevel =>
        handle.over(handle.model.education.categories.iscedLevels[iscedLevel.id]).create.sync({ spaceData: iscedLevel.data }),
      ),
    ),
    Promise.all(
      EDU_CATEGORIES_DATA_SETUP.resourceTypes.map(resourceType =>
        handle.over(handle.model.education.categories.resourceTypes[resourceType.id]).create.sync({ spaceData: resourceType.data }),
      ),
    ),
  ])
}
