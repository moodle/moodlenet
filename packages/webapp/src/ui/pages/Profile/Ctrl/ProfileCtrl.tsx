import { isEdgeNodeOfType, narrowNodeType } from '@moodlenet/common/lib/graphql/helpers'
import { ID } from '@moodlenet/common/lib/graphql/scalars.graphql'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocalInstance } from '../../../../context/Global/LocalInstance'
import { useSeoContentId } from '../../../../context/Global/Seo'
import { useSession } from '../../../../context/Global/Session'
import { getMaybeAssetRefUrlOrDefaultImage } from '../../../../helpers/data'
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
  const { isAuthenticated, session, isAdmin } = useSession()
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
      await edit({
        variables: {
          id,
          profileInput: {
            name: vals.displayName,
            description: vals.description,
            location: vals.location,
            siteUrl: vals.siteUrl,
          },
        },
      })
      refetch()
    },
  })
  const { resetForm: fresetForm } = formik
  useEffect(() => {
    if (profile) {
      const { name: username, description, firstName, lastName, location, siteUrl } = profile
      fresetForm({
        touched: {},
        values: {
          displayName: firstName || lastName ? `${firstName ?? ''} ${lastName ?? ''}` : username,
          organizationName: localOrg.name,
          location: location ?? '',
          siteUrl: siteUrl ?? '',
          username,
          description,
        },
      })
    }
  }, [fresetForm, id, profile, localOrg.name])
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
      profileCardProps: {
        avatarUrl: getMaybeAssetRefUrlOrDefaultImage(profile.avatar, id, 'icon'),
        backgroundUrl: getMaybeAssetRefUrlOrDefaultImage(profile.image, id, 'image'),
        formBag,
        isAuthenticated,
        toggleFollow,
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
    collections,
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
  return profileProps && [profileProps]
}
