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
    const orgDomain = process.env.SETUP_ORGANIZATION_DOMAIN ?? ''
    if (!validateDomainString(orgDomain)) {
      throw new Error(`ContentGraph setup: need a env SETUP_ORGANIZATION_DOMAIN to be a valid domain`)
    }
    const orgName = process.env.SETUP_ORGANIZATION_NAME ?? ''
    if (!orgName) {
      throw new Error(`ContentGraph setup: need a env SETUP_ORGANIZATION_NAME to be a valid name`)
    }

    await createDBCollections({ db })
    // await createRootUserProfile({ db })
    await createLocalOrg({ db, domain: orgDomain, name: orgName })
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
