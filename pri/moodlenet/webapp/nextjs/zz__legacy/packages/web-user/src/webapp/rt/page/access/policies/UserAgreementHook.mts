import { useFooterProps, useMinimalisticHeaderProps } from '@moodlenet/react-app/webapp'
import type { UserAgreementProps } from '../../../../ui/components/pages/Policies/UserAgreement/UserAgreement'

export function useUserAgreementProps(): UserAgreementProps {
  const headerProps = useMinimalisticHeaderProps()
  const footerProps = useFooterProps()
  return {
    footerProps,
    headerProps,
  }
}
