import { useMemo } from 'react'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useHeaderCtrl } from '../../../organisms/Header/Ctrl/HeaderCtrl'
import { HeaderPageProps } from '../HeaderPage'

export const useHeaderPageCtrl: CtrlHook<HeaderPageProps, {}> = () => {
  const headerPageProps = useMemo<HeaderPageProps>(() => {
    const headerPageProps: HeaderPageProps = {
      headerProps: ctrlHook(useHeaderCtrl, {}, 'Header'),
    }
    return headerPageProps
  }, [])

  return [headerPageProps]
}
