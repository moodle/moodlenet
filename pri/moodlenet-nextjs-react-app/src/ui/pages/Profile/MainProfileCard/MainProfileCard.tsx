'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Edit from '@mui/icons-material/Edit'
import Flag from '@mui/icons-material/Flag'
import Save from '@mui/icons-material/Save'
import Share from '@mui/icons-material/Share'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useCallback, useReducer, useRef } from 'react'
import { adoptMyProfileImage } from '../../../../app/(main-layout)/profile/[moodlenetContributorId]/[slug]/profile.server'
import { useAllPrimarySchemas, useMyLinkedContent } from '../../../../lib/client/globalContexts'
import { useAssetUploader } from '../../../../lib/client/useAssetUploader'
import { FloatingMenu } from '../../../atoms/FloatingMenu/FloatingMenu'
import { FollowButton } from '../../../atoms/FollowButton/FollowButton'
import InputTextField from '../../../atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../atoms/PrimaryButton/PrimaryButton'
import { RoundButton } from '../../../atoms/RoundButton/RoundButton'
import { SecondaryButton } from '../../../atoms/SecondaryButton/SecondaryButton'
import { Snackbar } from '../../../atoms/Snackbar/Snackbar'
import './MainProfileCard.scss'
// import { defaultProfileAvatarAsset, defaultProfileBackgroundAsset } from './defaultImagesAsset'
import { noop_action } from '../../../../lib/client/actions'
import defaultAvatar from '../../../lib/assets/img/default-avatar.svg'
import defaultBackground from '../../../lib/assets/img/default-background.svg'
import { profilePageProps } from '../ProfilePage'

export function MainProfileCard({ contributorId, itsMe, profileInfo, actions }: profilePageProps) {
  const [following] = useMyLinkedContent('follow', 'moodlenetContributors', contributorId)

  const schemas = useAllPrimarySchemas()
  const [isEditing, toggleIsEditing] = useReducer(isEditing => !!actions.updateMyProfileInfo && !isEditing, false)
  const {
    form: { formState, register, reset },
    handleSubmitWithAction: submitForm,
  } = useHookFormAction(
    actions.updateMyProfileInfo ?? noop_action,
    zodResolver(schemas.userProfile.updateProfileInfoMetaSchema),
    {
      formProps: { defaultValues: { ...profileInfo } },
      actionProps: {
        onSuccess({ input }) {
          reset(input)
        },
      },
    },
  )

  const submitFormBtnRef = useRef<HTMLButtonElement | null>(null)

  const [[displayAvatarSrc], chooseImageAvatar, submitAvatar, avatarUploaderState, dropAvatarAttr] = useAssetUploader({
    assets: profileInfo.avatar,
    async action({ tempIds: [tempId] }) {
      const saveResult = await adoptMyProfileImage({ as: 'avatar', tempId })

      return saveResult?.data
        ? { done: true, newAssets: [saveResult.data] }
        : { done: false, error: saveResult?.validationErrors?._errors }
    },
    type: 'webImage',
  })

  const [[displayBackgroundSrc], chooseImageBackground, submitBackground, backgroundUploaderState, dropBackgroundAttrs] =
    useAssetUploader({
      assets: profileInfo.background,
      async action({ tempIds: [tempId] }) {
        const saveResult = await actions.adoptMyProfileImage?.({ as: 'background', tempId })
        if (!saveResult?.data) {
          return { done: false, error: saveResult?.validationErrors?._errors }
        }

        return { done: true, newAsset: saveResult.data }
      },
      type: 'webImage',
    })

  const submitAll = useCallback(() => {
    submitFormBtnRef.current?.click()
    if (!formState.isValid) return
    submitAvatar()
    submitBackground()
    toggleIsEditing()
    //handleSubmitWithAction(e)
  }, [formState.isValid, submitAvatar, submitBackground])

  return (
    <div className="main-profile-card" key="profile-card">
      <div className="main-column">
        <div className={`background-container`} key="background-container">
          {!actions.updateMyProfileInfo
            ? null
            : isEditing && [
                <RoundButton
                  className="change-background-button"
                  type="edit"
                  abbrTitle={`Edit background`}
                  onClick={chooseImageBackground}
                  key="edit-background-btn"
                />,
                backgroundUploaderState.error && (
                  <Snackbar key="edit-background-err">{backgroundUploaderState.error}</Snackbar>
                ),
              ]}
          <div
            {...(isEditing && dropBackgroundAttrs)}
            className={`background`}
            key="background"
            style={{
              backgroundImage: 'url("' + (displayBackgroundSrc ?? defaultBackground) + '")',
            }}
          />
        </div>
        <div className={`avatar-container`} key="avatar-container">
          {!actions.updateMyProfileInfo
            ? null
            : isEditing && [
                <RoundButton
                  className="change-avatar-button"
                  type="edit"
                  abbrTitle={`Edit profile picture`}
                  onClick={chooseImageAvatar}
                  key="edit-avatar-btn"
                />,
                avatarUploaderState.error && <Snackbar key="edit-avatar-err">{avatarUploaderState.error}</Snackbar>,
              ]}
          <div
            {...(isEditing && dropAvatarAttr)}
            className={`avatar`}
            style={{
              backgroundImage: 'url("' + (displayAvatarSrc ?? defaultAvatar) + '")',
              // pointerEvents: avatarForm.isSubmitting || !avatarForm.values.image ? 'auto' : 'inherit',
              // cursor: avatarForm.isSubmitting || !avatarForm.values.image ? 'auto' : 'pointer',
            }}
          ></div>
        </div>
        <div className="top-items" key="top-items">
          <div className="edit-save" key="edit-save">
            {!actions.updateMyProfileInfo ? null : isEditing ? (
              <PrimaryButton color="green" onClick={submitAll} key="save-button">
                <Save />
              </PrimaryButton>
            ) : (
              <SecondaryButton onClick={toggleIsEditing} color="orange" key="edit-button">
                <Edit />
              </SecondaryButton>
            )}
          </div>
        </div>
        <form onSubmit={submitForm} className="profile-card-header" key="card-header">
          <button disabled={!formState.isDirty} ref={submitFormBtnRef} type="submit" hidden />
          <div className="title" key="title-row">
            <InputTextField
              className="display-name underline"
              placeholder={isEditing ? `Display name` : ''}
              key="display-name"
              noBorder={true}
              edit={isEditing}
              {...register('displayName')}
              error={isEditing && formState.errors.displayName?.message}
            />
          </div>

          <div className={`subtitle ${isEditing ? 'edit' : ''}`} key="subtitle-row">
            <span key="edit-location">
              <InputTextField
                className="underline"
                placeholder={isEditing ? `Location` : ''}
                noBorder
                edit={isEditing}
                {...register('location')}
                error={isEditing && formState.errors.location?.message}
              />
            </span>
            <span key="edit-site-url">
              <InputTextField
                className="underline"
                noBorder
                placeholder={isEditing ? `Website` : ''}
                edit={isEditing}
                {...register('siteUrl', {
                  setValueAs(value) {
                    return value || null
                  },
                })}
                error={isEditing && formState.errors.siteUrl?.message}
              />
            </span>
          </div>
          <InputTextField
            className="description"
            key="aboutMe"
            isTextarea
            textAreaAutoSize
            noBorder
            edit={isEditing}
            placeholder={isEditing ? `What should others know about you?` : ''}
            {...register('aboutMe')}
            error={isEditing && formState.errors.aboutMe?.message}
          />
        </form>
        {itsMe ? null : (
          <div className="main-profile-card-footer">
            <FollowButton
              following={following}
              toggleFollow={() => {
                // FIXME

                alert('FollowButton')
              }}
              disabled={!actions.follow}
              key="follow-button"
            />

            <SecondaryButton
              color="grey"
              className={`message`}
              disabled={!actions.sendMessage}
              onClick={() => {
                // FIXME
                alert('open message modal')
              }}
              abbr={!actions.sendMessage ? 'Login or signup to send messages' : 'Send a message'}
            >
              Message
            </SecondaryButton>
            <FloatingMenu
              key="more-button-menu"
              menuContent={[
                {
                  Element: (
                    <div key="share-button" tabIndex={0} onClick={() => alert('share')}>
                      <Share />
                      Share
                    </div>
                  ),
                },
                {
                  Element: (
                    <abbr
                      className={`report-button ${actions.report ? '' : 'disabled'}`}
                      key="report"
                      tabIndex={0}
                      title={!actions.report ? 'Login or signup to report' : undefined}
                      onClick={() => {
                        // FIXME
                        alert('open report modal')
                      }}
                    >
                      <Flag />
                      Report
                    </abbr>
                  ),
                },
              ]}
              hoverElement={
                <>
                  <SecondaryButton color="grey" className={`more small`} abbr="More actions">
                    <div className="three-dots">...</div>
                  </SecondaryButton>

                  <SecondaryButton color="grey" className={`more big`} abbr="More actions">
                    <div className="text">More</div>
                  </SecondaryButton>
                </>
              }
            />
          </div>
        )}
      </div>
    </div>
  )
}
