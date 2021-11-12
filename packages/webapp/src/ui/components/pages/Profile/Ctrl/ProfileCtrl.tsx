import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { createElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import {
  getMaybeAssetRefUrl,
  useUploadTempFile,
} from '../../../../../helpers/data'
import { mainPath } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
import { useFormikBag } from '../../../../lib/formik'
import { useCollectionCardCtrl } from '../../../molecules/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../molecules/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { useHeaderPageTemplateCtrl } from '../../../templates/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { fallbackProps } from '../../Extra/Fallback/Ctrl/FallbackCtrl'
import { Fallback } from '../../Extra/Fallback/Fallback'
import { ProfileProps } from '../Profile'
import { ProfileFormValues } from '../types'
import {
  useAddProfileRelationMutation,
  useDelProfileRelationMutation,
  useEditProfileMutation,
  useProfilePageUserDataQuery,
  useSendEmailToProfileMutation,
} from './ProfileCtrl.gen'
const newCollectionHref = href(mainPath.createNewCollection)
const newResourceHref = href(mainPath.createNewResource)

export type ProfileCtrlProps = { id: ID }
export const useProfileCtrl: CtrlHook<ProfileProps, ProfileCtrlProps> = ({
  id,
}) => {
  useSeoContentId(id)
  const { isAuthenticated, session, firstLogin } = useSession()
  const { org: localOrg } = useLocalInstance()
  const isMe = session?.profile && session.profile.id === id
  const { data, refetch, loading } = useProfilePageUserDataQuery({
    variables: {
      profileId: id,
      myProfileId: session?.profile && !isMe ? [session.profile.id] : [],
    },
  })
  const [sendEmailMut, sendEmailMutRes] = useSendEmailToProfileMutation()
  const profile = narrowNodeType(['Profile'])(data?.node)
  const collections = useMemo(
    () =>
      (profile?.collections.edges || [])
        .filter(isEdgeNodeOfType(['Collection']))
        .map(({ node }) => node),
    [profile?.collections.edges]
  )
  const [edit, editProfile] = useEditProfileMutation()
  const [addRelation, addRelationRes] = useAddProfileRelationMutation()
  const [delRelation, delRelationRes] = useDelProfileRelationMutation()
  const uploadTempFile = useUploadTempFile()

  const resources = useMemo(
    () =>
      (profile?.resources.edges || [])
        .filter(isEdgeNodeOfType(['Resource']))
        .map(({ node }) => node),
    [profile?.resources.edges]
  )

  const kudos = useMemo(
    () =>
      [...resources, ...collections].reduce(
        (allLikes, { likesCount }) => allLikes + likesCount,
        0
      ),
    [collections, resources]
  )
  const myFollowEdgeId = profile?.myFollow.edges[0]?.edge.id
  const toggleFollow = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delRelation({
        variables: { edge: { id: myFollowEdgeId } },
      }).then(() => refetch())
    } else {
      return addRelation({
        variables: {
          edge: {
            edgeType: 'Follows',
            from: session.profile.id,
            to: id,
            Follows: {},
          },
        },
      }).then(() => refetch())
    }
  }, [
    addRelation,
    addRelationRes.loading,
    delRelation,
    delRelationRes.loading,
    id,
    myFollowEdgeId,
    refetch,
    session,
  ])

  const [formik, formBag] = useFormikBag<ProfileFormValues>({
    initialValues: {} as any,
    onSubmit: async (vals) => {
      if (!formik.dirty || !vals.username || editProfile.loading) {
        return
      }

      const imageAssetRef: AssetRefInput =
        !vals.backgroundImage ||
        vals.backgroundImage === formik.initialValues.backgroundImage
          ? { location: '', type: 'NoChange' }
          : typeof vals.backgroundImage === 'string'
          ? {
              location: vals.backgroundImage,
              type: 'ExternalUrl',
            }
          : {
              location: await uploadTempFile('image', vals.backgroundImage),
              type: 'TmpUpload',
            }

      const avatarAssetRef: AssetRefInput =
        !vals.avatarImage ||
        vals.avatarImage === formik.initialValues.avatarImage
          ? { location: '', type: 'NoChange' }
          : typeof vals.avatarImage === 'string'
          ? {
              location: vals.avatarImage,
              type: 'ExternalUrl',
            }
          : {
              location: await uploadTempFile('icon', vals.avatarImage),
              type: 'TmpUpload',
            }

      await edit({
        variables: {
          id,
          profileInput: {
            name: vals.displayName,
            description: vals.description,
            location: vals.location,
            siteUrl: vals.siteUrl,
            image: imageAssetRef,
            avatar: avatarAssetRef,
          },
        },
      })
      refetch()
    },
  })
  const { resetForm: fresetForm } = formik

  const [backgroundUrl, setBackgroundUrl] = useState('')
  useEffect(() => {
    if (!(formik.values.backgroundImage instanceof File)) {
      return
    }
    const backgroundObjectUrl = URL.createObjectURL(
      formik.values.backgroundImage
    )
    setBackgroundUrl(backgroundObjectUrl)
    return () => {
      // console.log(`revoking   ${backgroundObjectUrl}`)
      URL.revokeObjectURL(backgroundObjectUrl)
    }
  }, [formik.values.backgroundImage])

  const [avatarUrl, setAvatarUrl] = useState('')
  useEffect(() => {
    if (!(formik.values.avatarImage instanceof File)) {
      return
    }
    const avatarObjectUrl = URL.createObjectURL(formik.values.avatarImage)
    setAvatarUrl(avatarObjectUrl)
    return () => {
      // console.log(`revoking   ${avatarObjectUrl}`)
      URL.revokeObjectURL(avatarObjectUrl)
    }
  }, [formik.values.avatarImage])

  const { image, avatar } = profile || {}
  useEffect(() => {
    setAvatarUrl(getMaybeAssetRefUrl(avatar) ?? '')
  }, [id, avatar])
  useEffect(() => {
    setBackgroundUrl(getMaybeAssetRefUrl(image) ?? '')
  }, [id, image])

  useEffect(() => {
    if (profile) {
      const { name, description, location, siteUrl } = profile
      fresetForm({
        touched: {},
        values: {
          displayName: name,
          organizationName: localOrg.name,
          location: location ?? '',
          siteUrl: siteUrl ?? '',
          username: name,
          description,
          avatarImage: '',
          backgroundImage: '',
        },
      })
    }
  }, [fresetForm, id, profile, localOrg.name /* avatarUrl, backgroundUrl */])
  const profileProps = useMemo<ProfileProps | null>(() => {
    if (!profile) {
      return null
    }

    const props: ProfileProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      resourceCardPropsList: resources.map(({ id }) =>
        ctrlHook(useResourceCardCtrl, { id, removeAction: false }, id)
      ),
      collectionCardPropsList: collections.map(({ id }) =>
        ctrlHook(useCollectionCardCtrl, { id }, id)
      ),
      overallCardProps: {
        followers: profile.followersCount,
        resources: profile.resourcesCount,
        years: 1,
        kudos,
      },
      newCollectionHref,
      newResourceHref,
      showAccountCreationSuccessAlert: firstLogin,
      profileCardProps: {
        formBag,
        isAuthenticated,
        toggleFollow,
        avatarUrl,
        backgroundUrl,
        isFollowing: !!myFollowEdgeId,
        isOwner: isMe,
      },
      sendEmail: (text) => {
        if (sendEmailMutRes.loading) {
          return
        }
        sendEmailMut({ variables: { text, toProfileId: id } })
      },
      displayName: profile.name,
      save: () => formik.submitForm(),
    }
    return props
  }, [
    avatarUrl,
    backgroundUrl,
    collections,
    firstLogin,
    formBag,
    formik,
    id,
    isAuthenticated,
    isMe,
    kudos,
    myFollowEdgeId,
    profile,
    resources,
    sendEmailMut,
    sendEmailMutRes.loading,
    toggleFollow,
  ])
  if (!loading && !data?.node) {
    return createElement(Fallback, fallbackProps({ key: 'profile-not-found' }))
  }
  return profileProps && [profileProps]
}
