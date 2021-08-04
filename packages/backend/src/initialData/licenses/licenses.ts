import { License } from '@moodlenet/common/lib/content-graph/types/node'
import { contentSlug } from '@moodlenet/common/lib/utils/content-graph/slug-id'
import licensesData from './licenses-DATA'

export const getLicenses = () =>
  licensesData.map(licenseData => {
    const license: License = {
      _type: 'License',
      _permId: licenseData.code,
      _slug: contentSlug({ name: licenseData.desc, slugCode: licenseData.code }),
      name: licenseData.desc,
      code: licenseData.code,
      description: licenseData.desc,
    }

    return license
  })
