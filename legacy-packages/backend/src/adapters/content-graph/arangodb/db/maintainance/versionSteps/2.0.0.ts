import { setSetupLocalOrganizationData } from '@moodlenet/common/dist/content-graph_2.0.0/initialData/content'
import { validateDomainString } from '@moodlenet/common/dist/utils/general'
import { VersionUpdater } from '../../../../../../lib/helpers/arango/migrate/types'
import { createDBCollections } from './2.0.0/createDBCollections'
import { createLocalOrg } from './2.0.0/createLocalOrg'
import { populateDBNodes } from './2.0.0/populateDBNodes'
import { setupSearchView } from './2.0.0/setupSearchView'

const init_2_0_0: VersionUpdater = {
  async initialSetUp({ db }) {
    const org = setSetupLocalOrganizationData({
      domain: process.env.SETUP_ORGANIZATION_DOMAIN ?? '',
      description: process.env.SETUP_ORGANIZATION_DESCRIPTION ?? '',
      name: process.env.SETUP_ORGANIZATION_NAME ?? '',
      subtitle: process.env.SETUP_ORGANIZATION_SUBTITLE ?? '',
      logo: { ext: true, location: process.env.SETUP_ORGANIZATION_LOGO ?? '', mimetype: 'image/*' },
      smallLogo: { ext: true, location: process.env.SETUP_ORGANIZATION_SMALL_LOGO ?? '', mimetype: 'image/*' },
    })
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
    await createLocalOrg({ db, org })
    await populateDBNodes({ db })
    await setupSearchView({ db })
  },
}

module.exports = init_2_0_0
