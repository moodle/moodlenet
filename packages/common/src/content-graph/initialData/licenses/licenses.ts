import { contentSlug } from '../../../utils/content-graph/slug-id'
import { License } from '../../types/node'
import licensesData from './licenses-DATA'
const now = Number(new Date())

export const getLicenses = () =>
  licensesData.map(licenseData => {
    const license: License = {
      _type: 'License',
      _permId: licenseData.code,
      _slug: contentSlug({ name: licenseData.desc, slugCode: licenseData.code }),
      _published: true,
      name: licenseData.desc,
      code: licenseData.code,
      description: licenseData.desc,
      _created: now,
      _edited: now,
      _authKey: null,
    }

    return license
  })
