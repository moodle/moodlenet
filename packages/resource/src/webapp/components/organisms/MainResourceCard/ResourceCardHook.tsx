import { useMemo } from 'react'
import { ResourceFormValues } from '../../../../common/types.mjs'
import { useResourcePageProps } from '../../pages/Resource/ResourcePageHooks.js'
import { MainResourceCardProps } from './MainResourceCard.js'
import { useResourceForm } from './resourceForm.js'

export const useResourceCardProps = ({
  resourceKey,
}: {
  resourceKey: string
  overrides?: Partial<ResourceFormValues>
}): MainResourceCardProps | null => {
  const pageProps = useResourcePageProps({ resourceKey })
  const form = useResourceForm(resourceKey)

  const props = useMemo<MainResourceCardProps | null>((): MainResourceCardProps | null => {
    if (!pageProps || !form) return null
    const { access, actions, data, state, fileMaxSize, mainResourceCardSlots } = pageProps
    return {
      slots: mainResourceCardSlots,
      form,
      data,
      state,
      actions,
      access,
      fileMaxSize,
      shouldShowErrors: true,
      publish: actions.setIsPublished as any,
    }
  }, [form, pageProps])

  return props
}
