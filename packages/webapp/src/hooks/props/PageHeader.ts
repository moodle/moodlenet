import { contentNodeLink, webappPath } from '@moodlenet/common/lib/webapp/sitemap'
import { Home, Login } from '@moodlenet/common/lib/webapp/sitemap/routes'
import { useMemo, useReducer } from 'react'
import { useHistory } from 'react-router'
import { useContentNodeContext } from '../../contexts/ContentNodeContext'
import { useGlobalSearch } from '../../contexts/Global/GlobalSearch'
import { useSession } from '../../contexts/Global/Session'
import { useFormikWithBag } from '../../helpers/forms'
import { PageHeaderProps } from '../../ui/components/PageHeader'
import { AddCollectionFormData, AddCollectionFormProps } from '../../ui/forms/collection/AddCollectionForm'
import { AddResourceFormData, AddResourceFormProps } from '../../ui/forms/resource/AddResourceForm'
import { useMutateEdge } from '../content/mutateEdge'
import { useMutateNode } from '../content/mutateNode'

const homeLink = webappPath<Home>('/', {})
const loginLink = webappPath<Login>('/login', {})

export const usePageHeaderProps = (): PageHeaderProps => {
  const { logout, session } = useSession()
  const hist = useHistory()

  const mutateNode = useMutateNode()
  const mutateEdge = useMutateEdge()
  const { searchText, setSearchText } = useGlobalSearch()
  //add collection
  const [showAddCollection, toggleShowAddCollection] = useReducer(_ => !_, false)
  const [, /* _addCollectionFormik */ addCollectionFormBag] = useFormikWithBag<AddCollectionFormData>({
    initialValues: { name: '', summary: '' },
    onSubmit: async ({ name, summary }, { resetForm }) => {
      const res = await mutateNode.createNode({ nodeType: 'Collection', data: { name, summary } })

      if (!res.data || res.data.createNode.__typename === 'CreateNodeMutationError') {
        return //FIXME: Manage Error
      }
      const newCollectionNode = res.data.createNode.node

      if (
        nodeContext?.type === 'Resource' &&
        newCollectionNode.__typename === 'Collection' &&
        window.confirm(`add resource ${nodeContext.name} to new collection?`)
      ) {
        const addToCollectionRes = await mutateEdge.createEdge({
          data: {},
          edgeType: 'Contains',
          to: nodeContext.id,
          from: newCollectionNode.id,
        })

        if (addToCollectionRes.data?.createEdge.__typename === 'CreateEdgeMutationError') {
          alert(`couldn't add this resource`)
        }
      }
      resetForm()
      toggleShowAddCollection()
      hist.push(contentNodeLink(newCollectionNode))
    },
  })

  const nodeContext = useContentNodeContext()
  const addCollectionFormProps = useMemo<AddCollectionFormProps>(
    () => ({
      form: addCollectionFormBag,
      cancel: toggleShowAddCollection,
    }),
    [addCollectionFormBag],
  )
  //add resource
  const [showAddResource, toggleShowAddResource] = useReducer(_ => !_, false)
  const [, /* _addResourceFormik */ addResourceFormBag] = useFormikWithBag<AddResourceFormData>({
    initialValues: { name: '', summary: '' },
    onSubmit: async ({ name, summary }, { resetForm }) => {
      if (!session?.profile) {
        return
      }
      const res = await mutateNode.createNode({ nodeType: 'Resource', data: { name, summary } })

      if (!res.data || res.data.createNode.__typename === 'CreateNodeMutationError') {
        return //FIXME: Manage Error
      }
      const newResourceNode = res.data.createNode.node

      if (
        nodeContext &&
        nodeContext.type === 'Collection' &&
        nodeContext.creatorId === session.profile.id &&
        newResourceNode.__typename === 'Resource' &&
        window.confirm(`add to ${nodeContext.name} collection?`)
      ) {
        const addToCollectionRes = await mutateEdge.createEdge({
          data: {},
          edgeType: 'Contains',
          from: nodeContext.id,
          to: newResourceNode.id,
        })

        if (addToCollectionRes.data?.createEdge.__typename === 'CreateEdgeMutationError') {
          alert(`couldn't add to this collection`)
        }
      }
      resetForm()
      toggleShowAddResource()
      hist.push(contentNodeLink(newResourceNode))
    },
  })

  const addResourceFormProps = useMemo<AddResourceFormProps>(
    () => ({
      form: addResourceFormBag,
      cancel: toggleShowAddResource,
    }),
    [addResourceFormBag],
  )
  return useMemo(
    () => ({
      homeLink,
      loginLink,
      search: setSearchText,
      searchValue: searchText,
      me: session
        ? {
            logout,
            username: session.username,
            toggleShowAddCollection,
            showAddCollection,
            addCollectionFormProps,
            toggleShowAddResource,
            showAddResource,
            addResourceFormProps,
          }
        : null,
    }),
    [
      addCollectionFormProps,
      addResourceFormProps,
      logout,
      searchText,
      session,
      setSearchText,
      showAddCollection,
      showAddResource,
    ],
  )
}
