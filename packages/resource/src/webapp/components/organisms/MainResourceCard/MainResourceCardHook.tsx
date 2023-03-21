import { useFormik } from 'formik'
import { useMemo } from 'react'
import { ResourceFormValues } from '../../../../common.mjs'
import { MainResourceCardProps } from './MainResourceCard.js'
// import { useResourceForm } from './resourceForm.js'

export const useMainResourceCardProps = (): //   {
//   resourceKey,
// }: {
//   resourceKey: string
// }
MainResourceCardProps | null => {
  //TODO //@ETTO fix this whole hook, I twisted it to avoid errors
  // const { props: baseProps, actions } = useResourceBaseProps({ resourceKey })
  // const resourceForm = useResourceForm(resourceKey)

  const form = useFormik<ResourceFormValues>({
    initialValues: {
      content: '',
      name: '',
      description: '',
      image: '',
    },
    onSubmit: () => undefined,
  })

  const props = useMemo<MainResourceCardProps | null>((): MainResourceCardProps | null => {
    // if (!baseProps) return null
    return {
      slots: {
        mainColumnItems: [],
        headerColumnItems: [],
        topLeftHeaderItems: [],
        topRightHeaderItems: [],
        moreButtonItems: [],
        footerRowItems: [],
      },
      shouldShowErrors: false,
      fileMaxSize: 50 * 1024 * 1024,
      data: {
        id: '1',
        mnUrl: 'https://moodle.net',
        numLikes: 0,
        contentType: 'link',
        downloadFilename: 'test',
        specificContentType: 'link',
        contentUrl: 'https://moodle.net',
        isPublished: true,
      },
      state: {
        bookmarked: false,
        liked: false,
      },
      actions: {
        setIsPublished: () => undefined,
        toggleBookmark: () => undefined,
        toggleLike: () => undefined,
        deleteResource: () => undefined,
        editResource: async () => undefined,
      },
      publish: () => undefined,
      form: form,
      access: {
        canEdit: false,
        isAuthenticated: false,
        isCreator: false,
        isAdmin: false,
      },
    }
  }, [form])
  // }, [actions.toggleBookmark, actions.toggleLike, baseProps, resourceForm])

  return props
}

/*
      form: resourceForm,
      publish: () => {
        throw new Error('to implement')
      },
      actions: ResourceActions,
      access: ResourceAccess,
      shouldShowErrors: false,
      fileMaxSize: FileMaxSize,
      ...baseProps,
    }
+/

/*
      form: resourceForm,
      publish: () => {
        throw new Error('to implement')
      },
      actions: ResourceActions,
      access: ResourceAccess,
      shouldShowErrors: false,
      fileMaxSize: FileMaxSize,
      ...baseProps,
    }
*/
