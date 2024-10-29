'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Edit from '@mui/icons-material/Edit'
import Flag from '@mui/icons-material/Flag'
import Save from '@mui/icons-material/Save'
import Share from '@mui/icons-material/Share'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { useCallback, useReducer, useRef } from 'react'
import { useAllPrimarySchemas, useMyLinkedContent, useMySession } from '../../../../../../../lib/client/globalContexts'
import { useAssetUploader } from '../../../../../../../lib/client/useAssetUploader'
import { FloatingMenu } from '../../../../../../../ui/atoms/FloatingMenu/FloatingMenu'
import { FollowButton } from '../../../../../../../ui/atoms/FollowButton/FollowButton'
import InputTextField from '../../../../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { RoundButton } from '../../../../../../../ui/atoms/RoundButton/RoundButton'
import { SecondaryButton } from '../../../../../../../ui/atoms/SecondaryButton/SecondaryButton'
import { Snackbar } from '../../../../../../../ui/atoms/Snackbar/Snackbar'
import { adoptProfileImage, updateProfileInfo } from '../../profile.server'
import './MainProfileCard.scss'
// import { defaultProfileAvatarAsset, defaultProfileBackgroundAsset } from './defaultImagesAsset'
import { moodlenetContributorAccessObject } from '@moodle/module/moodlenet'
import defaultAvatar from '../../../../../../../ui/lib/assets/img/default-avatar.svg'
import defaultBackground from '../../../../../../../ui/lib/assets/img/default-background.svg'

export type mainProfileCardProps = {
  moodlenetContributorAccessObject: moodlenetContributorAccessObject
}

export function MainProfileCard({ moodlenetContributorAccessObject }: mainProfileCardProps) {
  const { permissions, profileInfo, itsMe } = moodlenetContributorAccessObject
  const { session } = useMySession()

  const [following] = useMyLinkedContent('follow', 'moodlenetContributors', moodlenetContributorAccessObject.id)

  const schemas = useAllPrimarySchemas()
  const [isEditing, toggleIsEditing] = useReducer(isEditing => permissions.editProfileInfo && !isEditing, false)
  const {
    form: { formState, register, reset },
    handleSubmitWithAction: submitForm,
  } = useHookFormAction(updateProfileInfo, zodResolver(schemas.userProfile.updateProfileInfoSchema), {
    formProps: { defaultValues: { ...profileInfo } },
    actionProps: {
      onSuccess({ input }) {
        reset(input)
      },
    },
  })

  const submitFormBtnRef = useRef<HTMLButtonElement | null>(null)

  const [
    [displayAvatarSrc],
    chooseImageAvatar,
    submitAvatar,
    avatarChoosenFileError,
    // dirtyAvatar,
  ] = useAssetUploader({
    assets: profileInfo.avatar,
    async action({ tempIds: [tempId] }) {
      const saveResult = await adoptProfileImage({ as: 'avatar', tempId })

      return saveResult?.data
        ? { done: true, newAssets: [saveResult.data] }
        : { done: false, error: saveResult?.validationErrors?._errors }
    },
    type: 'webImage',
  })

  const [
    [displayBackgroundSrc],
    chooseImageBackground,
    submitBackground,
    backgroundChoosenFileError,
    // dirtyBackground,
  ] = useAssetUploader({
    assets: profileInfo.background,
    async action({ tempIds: [tempId] }) {
      const saveResult = await adoptProfileImage({ as: 'background', tempId })
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
          {!permissions.editProfileInfo
            ? null
            : isEditing && [
                <RoundButton
                  className="change-background-button"
                  type="edit"
                  abbrTitle={`Edit background`}
                  onClick={chooseImageBackground}
                  key="edit-background-btn"
                />,
                backgroundChoosenFileError && <Snackbar key="edit-background-err">{backgroundChoosenFileError}</Snackbar>,
              ]}
          <div
            className={`background`}
            key="background"
            style={{
              backgroundImage: 'url("' + (displayBackgroundSrc ?? defaultBackground) + '")',
            }}
          />
        </div>
        <div className={`avatar-container`} key="avatar-container">
          {!permissions.editProfileInfo
            ? null
            : isEditing && [
                <RoundButton
                  className="change-avatar-button"
                  type="edit"
                  abbrTitle={`Edit profile picture`}
                  onClick={chooseImageAvatar}
                  key="edit-avatar-btn"
                />,
                avatarChoosenFileError && <Snackbar key="edit-avatar-err">{avatarChoosenFileError}</Snackbar>,
              ]}
          <div
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
            {!permissions.editProfileInfo ? null : isEditing ? (
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
              disabled={!permissions.follow}
              key="follow-button"
            />

            <SecondaryButton
              color="grey"
              className={`message`}
              disabled={!permissions.sendMessage}
              onClick={() => {
                // FIXME
                alert('open message modal')
              }}
              abbr={!permissions.sendMessage ? 'Login or signup to send messages' : 'Send a message'}
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
                      className={`report-button ${permissions.report ? '' : 'disabled'}`}
                      key="report"
                      tabIndex={0}
                      title={!permissions.report ? 'Login or signup to report' : undefined}
                      onClick={
                        permissions.report
                          ? () => {
                              // FIXME
                              alert('open-report-modal')
                            }
                          : undefined
                      }
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
