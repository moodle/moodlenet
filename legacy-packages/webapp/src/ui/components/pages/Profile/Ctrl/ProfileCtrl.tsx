import { t } from '@lingui/macro'
import {
  isEdgeNodeOfType,
  narrowNodeType,
} from '@moodlenet/common/dist/graphql/helpers'
import { ID } from '@moodlenet/common/dist/graphql/scalars.graphql'
import { AssetRefInput } from '@moodlenet/common/dist/graphql/types.graphql.gen'
import { fileExceedsMaxUploadSize } from '@moodlenet/common/dist/staticAsset/lib'
import { useFormik } from 'formik'
import { createElement, useCallback, useEffect, useMemo } from 'react'
import { mixed, object, SchemaOf, string } from 'yup'
import {
  MIN_RESOURCES_FOR_USER_APPROVAL_REQUESTS,
  MNEnv,
} from '../../../../../constants'
import { useLocalInstance } from '../../../../../context/Global/LocalInstance'
import { useSeoContentId } from '../../../../../context/Global/Seo'
import { useSession } from '../../../../../context/Global/Session'
import {
  fullLocalEntityUrlByGqlId,
  getMaybeAssetRefUrl,
  useUploadTempFile,
} from '../../../../../helpers/data'
import { mainPath } from '../../../../../hooks/glob/nav'
import { href } from '../../../../elements/link'
import { ctrlHook, CtrlHook } from '../../../../lib/ctrl'
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

// TODO ETTO: LOOK ETTORE FOR FORM

const validationSchema: SchemaOf<ProfileFormValues> = object({
  avatarImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
          })
        : true
    )
    .optional(),
  backgroundImage: mixed()
    .test((v, { createError }) =>
      v instanceof Blob && fileExceedsMaxUploadSize(v.size, MNEnv.maxUploadSize)
        ? createError({
            message: t`The image is too big, reduce the size or use another image`,
          })
        : true
    )
    .optional(),
  displayName: string()
    .required(t`Please provide a display name`)
    .min(3)
    .max(30),
  location: string().optional(),
  organizationName: string().min(3).max(160).optional(),
  siteUrl: string().url().optional(),
  description: string().default('').max(4096),
})
const newCollectionHref = href(mainPath.createNewCollection)
const newResourceHref = href(mainPath.createNewResource)

export type ProfileCtrlProps = { id: ID }
export const useProfileCtrl: CtrlHook<ProfileProps, ProfileCtrlProps> = ({
  id,
}) => {
  useSeoContentId(id)
  const {
    isAuthenticated,
    session,
    isAdmin,
    reportEntity,
    isWaitingApproval,
    userRequestedApproval,
    hasJustBeenApproved,
    hasJustBeenApprovedReset,
    firstLogin,
    firstLoginReset,
  } = useSession()

  const { org: localOrg } = useLocalInstance()
  const isMe = session?.profile && session.profile.id === id
  useEffect(() => {
    isMe && firstLogin && setTimeout(firstLoginReset, 10000)
  }, [firstLogin, firstLoginReset, isMe])

  useEffect(() => {
    isMe && hasJustBeenApproved && setTimeout(hasJustBeenApprovedReset, 10000)
  }, [hasJustBeenApproved, hasJustBeenApprovedReset, isMe])

  const { data, refetch, loading } = useProfilePageUserDataQuery({
    variables: {
      profileId: id,
      myProfileId: session?.profile && !isMe ? [session.profile.id] : [],
    },
    fetchPolicy: 'cache-and-network',
  })

  // todo: move this service and abstraction to SessionCtx
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
  const toggleFollowForm = useFormik({
    initialValues: {},
    onSubmit: () => {
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
    },
  })

  const profileUrl = fullLocalEntityUrlByGqlId(id)

  const reportForm = useFormik({
    initialValues: { comment: '' },
    validationSchema: object({ comment: string().required() }),
    validateOnMount: true,
    onSubmit: async ({ comment }) => {
      await reportEntity({
        comment,
        entityUrl: profileUrl,
      })
    },
  })

  // todo: move this service to SessionCtx
  const requestApprovalForm = useFormik({
    initialValues: {},
    onSubmit: async () => {
      const { data } = await sendEmailMut({
        variables: {
          text: 'please consider approving my profile !',
          toProfileId: localOrg.id,
        },
      })
      if (!data || !data.sendEmailToProfile) {
        return
      }
      userRequestedApproval()
    },
  })

  const form = useFormik<ProfileFormValues>({
    validationSchema,
    initialValues: { description: '', displayName: '' },
    onSubmit: async (vals) => {
      if (!form.dirty || editProfile.loading) {
        return
      }

      const imageAssetRef: AssetRefInput =
        !vals.backgroundImage ||
        vals.backgroundImage === form.initialValues.backgroundImage
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
        !vals.avatarImage || vals.avatarImage === form.initialValues.avatarImage
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
      // refetch()
    },
  })

  const _resetform = form.resetForm
  useEffect(() => {
    if (profile) {
      const { name, description, location, siteUrl, avatar, image } = profile
      _resetform({
        touched: {},
        values: {
          displayName: name,
          organizationName: localOrg.name,
          location: location ?? undefined,
          siteUrl: siteUrl ?? undefined,
          description,
          avatarImage: getMaybeAssetRefUrl(avatar),
          backgroundImage: getMaybeAssetRefUrl(image),
        },
      })
    }
  }, [_resetform, id, profile, localOrg.name /* avatarUrl, backgroundUrl */])
  const approveUserForm = useFormik({
    initialValues: {},
    onSubmit: () => editPublished(true),
  })

  const unapproveUserForm = useFormik({
    initialValues: {},
    onSubmit: () => editPublished(false),
  })

  const editPublished = useCallback(
    async (_published: boolean) => {
      if (!(isAdmin && profile)) {
        return
      }
      // todo: move this service to SessionCtx
      const editResp = await edit({
        variables: {
          id: profile.id,
          profileInput: {
            _published,
          },
        },
      })
      if (
        _published &&
        editResp.data?.editNode.__typename === 'EditNodeMutationSuccess'
      ) {
        await sendEmailMut({
          variables: {
            text: 'Congratulations! Your account has been approved!',
            toProfileId: profile.id,
          },
        })
      }
    },
    [edit, isAdmin, profile, sendEmailMut]
  )
  const sendEmailForm = useFormik<{ text: string }>({
    initialValues: { text: '' },
    validationSchema: object({
      text: string()
        .required(t`Please provide a text to send`)
        .min(3)
        .max(4096),
    }),
    onSubmit: ({ text }) => {
      if (sendEmailMutRes.loading) {
        return
      }
      return sendEmailMut({ variables: { text, toProfileId: id } })
    },
  })
  const profileProps = useMemo<ProfileProps | null>(() => {
    if (!profile) {
      return null
    }
    const userId = `${profile.id.split('/')![1]}@${localOrg.domain}`

    const props: ProfileProps = {
      headerPageTemplateProps: ctrlHook(
        useHeaderPageTemplateCtrl,
        {},
        'header-page-template'
      ),
      isOwner: isMe,
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
        followersHref: href(mainPath.followers({ nodeId: profile.id })),
      },
      newCollectionHref,
      newResourceHref,
      showAccountCreationSuccessAlert: firstLogin,
      profileCardProps: {
        userId,
        approveUserForm,
        isAuthenticated,
        toggleFollowForm,
        isFollowing: !!myFollowEdgeId,
        isOwner: isMe,
        isAdmin,
        isApproved: profile._published,
        requestApprovalForm,
        isElegibleForApproval:
          profile.resourcesCount >=
          (MIN_RESOURCES_FOR_USER_APPROVAL_REQUESTS ?? 0),
        isWaitingApproval,
        showAccountApprovedSuccessAlert: hasJustBeenApproved,
        unapproveUserForm,
        profileUrl,
      },
      reportForm,
      showAccountApprovedSuccessAlert: hasJustBeenApproved,
      sendEmailForm,
      form: form,
      displayName: profile.name,
    }
    return props
  }, [
    profile,
    localOrg.domain,
    resources,
    collections,
    kudos,
    firstLogin,
    approveUserForm,
    isAuthenticated,
    toggleFollowForm,
    myFollowEdgeId,
    isMe,
    isAdmin,
    requestApprovalForm,
    isWaitingApproval,
    hasJustBeenApproved,
    unapproveUserForm,
    profileUrl,
    reportForm,
    sendEmailForm,
    form,
  ])
  if (!loading && !data?.node) {
    return createElement(Fallback, fallbackProps({ key: 'profile-not-found' }))
  }
  return profileProps && [profileProps]
}
