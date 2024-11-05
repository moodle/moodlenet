import { UserAgreement } from '../../../../ui/components/pages/Policies/UserAgreement/UserAgreement'
import { useUserAgreementProps } from './UserAgreementHook.mjs'

export function UserAgreementContainer() {
  const userAgreementProps = useUserAgreementProps()
  return <UserAgreement {...userAgreementProps} />
}
