import { useMemo } from 'react'
import { FileMaxSize } from '../../../../common/types.mjs'
import { useResourceBaseProps } from '../../../ResourceHooks.js'
import { MainResourceCardProps } from './MainResourceCard.js'
import { useResourceForm } from './resourceForm.js'

export const useResourceCardProps = ({
  resourceKey,
}: {
  resourceKey: string
}): MainResourceCardProps | null => {
  const { props: baseProps, actions } = useResourceBaseProps({ resourceKey })
  const resourceForm = useResourceForm(resourceKey)

  const props = useMemo<MainResourceCardProps | null>((): MainResourceCardProps | null => {
    if (!baseProps) return null
    return {
      slots:{
        mainColumnItems: [],
      headerColumnItems: [],
      topLeftHeaderItems: [],
      topRightHeaderItems: [],
      moreButtonItems: [],
      footerRowItems: []
    },
    shouldShowErrors:false,
    fileMaxSize: FileMaxSize,


  }

  }, [actions.toggleBookmark, actions.toggleLike, baseProps, resourceForm])

  return props
}


<<<<<<< HEAD
/* 
=======
/*
>>>>>>> master
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

<<<<<<< HEAD
/* 
=======
/*
>>>>>>> master
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