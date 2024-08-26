import { useFooterProps, useMinimalisticHeaderProps } from '@moodlenet/react-app/webapp'
import type { DeleteAccountSuccessProps } from '../../../ui/components/pages/Access/DeleteAccountSuccess/DeleteAccountSuccess.js'

export function useDeleteAccountSuccessProps() {
  const deleteAccountSuccessProps: DeleteAccountSuccessProps = {
    footerProps: useFooterProps(),
    headerProps: useMinimalisticHeaderProps(),
  }
  return deleteAccountSuccessProps
}
