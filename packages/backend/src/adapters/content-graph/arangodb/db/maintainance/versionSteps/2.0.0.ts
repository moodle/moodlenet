import { LocalOrgInitialData } from '@moodlenet/common/dist/content-graph/initialData/content'
import { validateDomainString } from '@moodlenet/common/dist/utils/general'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { createDBCollections } from './2.0.0/createDBCollections'
import { createFileFormats } from './2.0.0/createFileFormats'
import { createIscedFields } from './2.0.0/createIscedFields'
import { createIscedGrades } from './2.0.0/createIscedGrades'
import { createLanguges } from './2.0.0/createLanguages'
import { createLicenses } from './2.0.0/createLicenses'
import { createLocalOrg } from './2.0.0/createLocalOrg'
import { createResourceTypes } from './2.0.0/createResourceTypes'
// import { createRootUserProfile } from './0.0.1/createRootUserProfile'
import { setupSearchView } from './2.0.0/setupSearchView'

const init_2_0_0: VersionUpdater = {
  async initialSetUp({ db }) {
    const org: LocalOrgInitialData = {
      domain: process.env.SETUP_ORGANIZATION_DOMAIN!,
      description: process.env.SETUP_ORGANIZATION_DESCRIPTION!,
      name: process.env.SETUP_ORGANIZATION_NAME!,
      subtitle: process.env.SETUP_ORGANIZATION_SUBTITLE!,
      logo: { ext: true, location: process.env.SETUP_ORGANIZATION_LOGO!, mimetype: 'image/*' },
      smallLogo: { ext: true, location: process.env.SETUP_ORGANIZATION_SMALL_LOGO!, mimetype: 'image/*' },
    }
    if (!Object.values(org).every(_ => !!_)) {
      const varnames = [
        'SETUP_ORGANIZATION_DOMAIN',
        'SETUP_ORGANIZATION_DESCRIPTION',
        'SETUP_ORGANIZATION_NAME',
        'SETUP_ORGANIZATION_SUBTITLE',
        'SETUP_ORGANIZATION_LOGO',
        'SETUP_ORGANIZATION_SMALL_LOGO',
      ]
      throw new Error(`ContentGraph setup: need env vars : ${varnames.join(',')} to be a non empty strings`)
    }

    if (!validateDomainString(org.domain)) {
      throw new Error(`ContentGraph setup: need a env SETUP_ORGANIZATION_DOMAIN to be a valid domain`)
    }

    await createDBCollections({ db })
    // await createRootUserProfile({ db })
    await createLocalOrg({ db, org })
    await createIscedFields({ db })
    await createIscedGrades({ db })
    await createFileFormats({ db })
    await createResourceTypes({ db })
    await createLicenses({ db })
    await createLanguges({ db })

    await setupSearchView({ db })
  },
}

module.exports = init_2_0_0
