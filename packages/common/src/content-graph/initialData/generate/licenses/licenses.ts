import { contentSlug } from '../../../../utils/content-graph/slug-id'
import { time0 } from '../../../types/common'
import { GraphNodeIdentifierAuth, License } from '../../../types/node'
import licensesData from './licenses-DATA'

export const getLicenses = ({ _creator }: { _creator: GraphNodeIdentifierAuth }) =>
  licensesData.map(licenseData => {
    const license: License = {
      _type: 'License',
      _permId: licenseData.code,
      _slug: contentSlug({ name: licenseData.desc, slugCode: licenseData.code }),
      _published: licenseData.pub,
      name: licenseData.desc,
      code: licenseData.code,
      description: licenseData.desc,
      _created: time0,
      _edited: time0,
      _authKey: null,
      _creator,
      _local: true,
    }

    return license
  })
