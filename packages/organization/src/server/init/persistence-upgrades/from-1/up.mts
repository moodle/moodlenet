import type { ValueObj } from '@moodlenet/key-value-store/server'
import type { OrganizationData } from '../../../../common/types.mjs'
import { kvStore } from '../../kvStore.mjs'
import { initialOrganizationDataV1, type OrganizationDataV1 } from '../from-NaN/up.mjs'

const { value: initialV1 = initialOrganizationDataV1 }: ValueObj<OrganizationDataV1> =
  await kvStore.get('organizationData', '')
const initialOrganizationDataV2: OrganizationData = {
  ...initialV1,
  locationAddress: 'PO Box 303, West Perth WA 6872, Australia',
  locationUrl:
    'https://www.google.com/maps/place/Moodle/@-31.9489919,115.8403923,15z/data=!4m5!3m4!1s0x0:0x2bff7bedf43b4fc7!8m2!3d-31.9489919!4d115.8403923',
  copyright: 'Copyright © ${new Date().getFullYear()} Moodle Pty Ltd, All rights reserved.',
}

await kvStore.set('organizationData', '', initialOrganizationDataV2)

export default 2
