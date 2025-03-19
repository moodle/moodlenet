import { logger } from '../../../../../../types'
import { CONTENT_CATEGORIES_DATA_SETUP } from '../../../../../model/content.model/setup/data'
import { EDU_CATEGORIES_DATA_SETUP } from '../../../../../model/education.model/setup/configs'

export async function insertInitialData({ model, log }: { model: moo.def.model.handle; log: logger }) {
  log.info('inserting initial data')
  await Promise.all([
    Promise.all(CONTENT_CATEGORIES_DATA_SETUP.languages.map(language => model.content.categories.languages.create.sync({ record: language }))),
    Promise.all(CONTENT_CATEGORIES_DATA_SETUP.licenses.map(license => model.content.categories.licenses.create.sync({ record: license }))),
    Promise.all(EDU_CATEGORIES_DATA_SETUP.bloomCognitives.map(bloomCognitive => model.education.categories.bloomCognitives.create.sync({ record: bloomCognitive }))),
    Promise.all(EDU_CATEGORIES_DATA_SETUP.iscedFields.map(iscedField => model.education.categories.iscedFields.create.sync({ record: iscedField }))),
    Promise.all(EDU_CATEGORIES_DATA_SETUP.iscedLevels.map(iscedLevel => model.education.categories.iscedLevels.create.sync({ record: iscedLevel }))),
    Promise.all(EDU_CATEGORIES_DATA_SETUP.resourceTypes.map(resourceType => model.education.categories.resourceTypes.create.sync({ record: resourceType }))),
  ])
}
