import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/lib/graphql/types.graphql.gen'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { useSeoContentId } from '../../../../context/Global/Seo'
import { useSession } from '../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage, useUploadTempFile } from '../../../../helpers/data'
import { useCollectionCardCtrl } from '../../../components/cards/CollectionCard/Ctrl/CollectionCardCtrl'
import { useResourceCardCtrl } from '../../../components/cards/ResourceCard/Ctrl/ResourceCardCtrl'
import { ctrlHook, CtrlHook } from '../../../lib/ctrl'
import { useFormikBag } from '../../../lib/formik'
import { useHeaderPageTemplateCtrl } from '../../../templates/page/HeaderPageTemplateCtrl/HeaderPageTemplateCtrl'
import { ProfileProps } from '../Profile'
import { ProfileFormValues } from '../types'
import {
  useAddProfileRelationMutation,
  useDelProfileRelationMutation,
  useEditProfileMutation,
  useProfilePageUserDataQuery,
  useSendEmailToProfileMutation,
} from './ProfileCtrl.gen'

export type ProfileCtrlProps = { id: ID }
export const useProfileCtrl: CtrlHook<ProfileProps, ProfileCtrlProps> = ({ id }) => {
  useSeoContentId(id)
  const { isAuthenticated, session, isAdmin, firstLogin } = useSession()
  const { org: localOrg } = useLocalInstance()
  const isMe = session?.profile && session.profile.id === id
  const { data, refetch } = useProfilePageUserDataQuery({
    variables: {
      profileId: id,
      myProfileId: session?.profile && !isMe ? [session.profile.id] : [],
    },
  })
  const [sendEmailMut, sendEmailMutRes] = useSendEmailToProfileMutation()
  const profile = narrowNodeType(['Profile'])(data?.node)
  const collections = useMemo(
    () => (profile?.collections.edges || []).filter(isEdgeNodeOfType(['Collection'])).map(({ node }) => node),
    [profile?.collections.edges],
  )
  const [edit, editProfile] = useEditProfileMutation()
  const [addRelation, addRelationRes] = useAddProfileRelationMutation()
  const [delRelation, delRelationRes] = useDelProfileRelationMutation()
  const uploadTempFile = useUploadTempFile()

  const resources = useMemo(
    () => (profile?.resources.edges || []).filter(isEdgeNodeOfType(['Resource'])).map(({ node }) => node),
    [profile?.resources.edges],
  )

  const kudos = useMemo(
    () => [...resources, ...collections].reduce((allLikes, { likesCount }) => allLikes + likesCount, 0),
    [collections, resources],
  )
  const myFollowEdgeId = profile?.myFollow.edges[0]?.edge.id
  const toggleFollow = useCallback(() => {
    if (!session || addRelationRes.loading || delRelationRes.loading) {
      return
    }
    if (myFollowEdgeId) {
      return delRelation({ variables: { edge: { id: myFollowEdgeId } } }).then(() => refetch())
    } else {
      return addRelation({
        variables: { edge: { edgeType: 'Follows', from: session.profile.id, to: id, Follows: {} } },
      }).then(() => refetch())
    }
  }, [addRelation, addRelationRes.loading, delRelation, delRelationRes.loading, id, myFollowEdgeId, refetch, session])

  const [formik, formBag] = useFormikBag<ProfileFormValues>({
    initialValues: {} as any,
    onSubmit: async vals => {
      if (!formik.dirty || !vals.username || editProfile.loading) {
        return
      }

      const imageAssetRef: AssetRefInput = !vals.backgroundUrl
        ? { location: '', type: 'NoAsset' }
        : typeof vals.backgroundUrl === 'string'
        ? {
            location: vals.backgroundUrl,
            type: 'ExternalUrl',
          }
        : {
            location: await uploadTempFile('image', vals.backgroundUrl),
            type: 'TmpUpload',
          }
      const avatarAssetRef: AssetRefInput = !vals.avatarUrl
        ? { location: '', type: 'NoAsset' }
        : typeof vals.avatarUrl === 'string'
        ? {
            location: vals.avatarUrl,
            type: 'ExternalUrl',
          }
        : {
            location: await uploadTempFile('icon', vals.avatarUrl),
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
    if (!(formik.values.backgroundUrl instanceof File)) {
      return
    }
    const backgroundObjectUrl = URL.createObjectURL(formik.values.backgroundUrl)
    setBackgroundUrl(backgroundObjectUrl)
    return () => {
      // console.log(`revoking   ${backgroundObjectUrl}`)
      URL.revokeObjectURL(backgroundObjectUrl)
    }
  }, [formik.values.backgroundUrl])

  const [avatarUrl, setAvatarUrl] = useState('')
  useEffect(() => {
    if (!(formik.values.avatarUrl instanceof File)) {
      return
    }
    const avatarObjectUrl = URL.createObjectURL(formik.values.avatarUrl)
    setAvatarUrl(avatarObjectUrl)
    return () => {
      // console.log(`revoking   ${avatarObjectUrl}`)
      URL.revokeObjectURL(avatarObjectUrl)
    }
  }, [formik.values.avatarUrl])

  const { image, avatar } = profile || {}
  useEffect(() => {
    setAvatarUrl(getMaybeAssetRefUrlOrDefaultImage(avatar, id, 'icon'))
  }, [id, avatar])
  useEffect(() => {
    setBackgroundUrl(getMaybeAssetRefUrlOrDefaultImage(image, id, 'image'))
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
          avatarUrl: '',
          backgroundUrl: '',
        },
      })
    }
  }, [fresetForm, id, profile, localOrg.name /* avatarUrl, backgroundUrl */])
  const profileProps = useMemo<ProfileProps | null>(() => {
    if (!profile) {
      return null
    }

    const props: ProfileProps = {
      headerPageTemplateProps: ctrlHook(useHeaderPageTemplateCtrl, {}, 'header-page-template'),
      resourceCardPropsList: resources.map(({ id }) => ctrlHook(useResourceCardCtrl, { id, removeAction: false }, id)),
      collectionCardPropsList: collections.map(({ id }) => ctrlHook(useCollectionCardCtrl, { id }, id)),
      overallCardProps: {
        followers: profile.followersCount,
        resources: profile.resourcesCount,
        years: 1,
        kudos,
      },
      showAccountCreationSuccessAlert: firstLogin,
      profileCardProps: {
        formBag,
        isAuthenticated,
        toggleFollow,
        avatarUrl,
        backgroundUrl,
        isFollowing: !!myFollowEdgeId,
        isOwner: isMe || isAdmin,
      },
      sendEmail: text => {
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
    isAdmin,
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
  // console.log(profileProps?.profileCardProps)
  // console.log(formik.values)
  return profileProps && [profileProps]
}
