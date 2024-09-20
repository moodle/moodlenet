export * from '../types'
import { named_email_address } from '@moodle/lib-types'
import { OrgAddresses, OrgInfo } from '../types'

export function getOrgNamedEmailAddress({
  orgAddr: { emailAddress },
  orgInfo: { name },
}: {
  orgAddr: Pick<OrgAddresses, 'emailAddress'>
  orgInfo: Pick<OrgInfo, 'name'>
}): named_email_address {
  return {
    address: emailAddress,
    name,
  }
}
