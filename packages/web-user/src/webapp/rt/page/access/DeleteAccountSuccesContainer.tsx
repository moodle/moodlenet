import { DeleteAccountSuccess } from '../../../ui/components/pages/Access/DeleteAccountSuccess/DeleteAccountSuccess.js'
import { useDeleteAccountSuccessProps } from './DeleteAccountSuccessHook.mjs'

export function DeleteAccountSuccessContainer() {
  const props = useDeleteAccountSuccessProps()
  return <DeleteAccountSuccess {...props} />
}
