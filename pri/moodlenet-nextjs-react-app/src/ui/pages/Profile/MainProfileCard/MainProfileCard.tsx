'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Edit from '@mui/icons-material/Edit'
import Flag from '@mui/icons-material/Flag'
import Save from '@mui/icons-material/Save'
import Share from '@mui/icons-material/Share'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useCallback, useReducer, useRef } from 'react'
// import { adoptMyProfileImage } from '../../../../app/(main-layout)/profile/[moodlenetContributorId]/[slug]/profile.server'
import { useAllPrimarySchemas } from '../../../../lib/client/globalContexts'
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

export function MainProfileCard({ profileInfo, actions, myLinks }: profilePageProps) {
  const schemas = useAllPrimarySchemas()
  const [isEditing, toggleIsEditing] = useReducer(isEditing => !!actions.edit && !isEditing, false)
  const {
    form: { formState, register, reset },
    handleSubmitWithAction: submitForm,
  } = useHookFormAction(
    actions.edit?.updateMyProfileInfo ?? noop_action,
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

  const {
    current: { url: displayAvatarSrc },
    openFileDialog: chooseImageAvatar,
    submit: submitAvatar,
    state: avatarUploaderState,
    dropHandlers: dropAvatarAttr,
  } = useAssetUploader(profileInfo.avatar, actions.edit?.useAsMyProfileAvatar, {
    type: 'webImage',
  })

  const {
    current: { url: displayBackgroundSrc },
    openFileDialog: chooseImageBackground,
    submit: submitBackground,
    state: backgroundUploaderState,
    dropHandlers: dropBackgroundAttrs,
  } = useAssetUploader(profileInfo.background, actions.edit?.useAsMyProfileBackground, {
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
          {!actions.edit
            ? null
            : isEditing && (
                <RoundButton
                  className="change-background-button"
                  type="edit"
                  abbrTitle={`Edit background`}
                  onClick={chooseImageBackground}
                  key="edit-background-btn"
                />
              )}
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
          {!actions.edit
            ? null
            : isEditing && (
                <RoundButton
                  className="change-avatar-button"
                  type="edit"
                  abbrTitle={`Edit profile picture`}
                  onClick={chooseImageAvatar}
                  key="edit-avatar-btn"
                />
              )}
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
            {!actions.edit ? null : isEditing ? (
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
        {actions.follow && (
          <div className="main-profile-card-footer">
            <FollowButton
              following={myLinks.followed}
              toggleFollow={() => {
                actions.follow?.()
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
              abbr={'Send a message'}
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
                      title={'Report abuse'}
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
