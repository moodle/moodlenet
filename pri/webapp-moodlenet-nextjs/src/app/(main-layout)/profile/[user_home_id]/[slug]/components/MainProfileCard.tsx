'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Edit from '@mui/icons-material/Edit'
import Flag from '@mui/icons-material/Flag'
import Save from '@mui/icons-material/Save'
import Share from '@mui/icons-material/Share'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { getProfileInfoPrimarySchemas, user_home_access_object } from 'domain/src/user-hone'
import { useReducer, useRef } from 'react'
import { never } from 'zod'
import { ApprovalButton } from '../../../../../../ui/atoms/ApproveButton/ApproveButton'
import { FloatingMenu } from '../../../../../../ui/atoms/FloatingMenu/FloatingMenu'
import { FollowButton } from '../../../../../../ui/atoms/FollowButton/FollowButton'
import InputTextField from '../../../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { RoundButton } from '../../../../../../ui/atoms/RoundButton/RoundButton'
import { SecondaryButton } from '../../../../../../ui/atoms/SecondaryButton/SecondaryButton'
import defaultAvatar from '../../../../../../ui/lib/assets/img/default-avatar.png'
import defaultBackground from '../../../../../../ui/lib/assets/img/default-landing-background.png'
import { updateProfileInfo } from '../profile.server'
import './MainProfileCard.scss'

export interface MainProfileCardDeps {
  userHomeAccessObject: user_home_access_object
}

export function MainProfileCard({
  userHomeAccessObject: { permissions, profileInfo, user, flags, id },
}: MainProfileCardDeps) {
  const { updateProfileInfoSchema } = permissions.editProfile
    ? getProfileInfoPrimarySchemas(permissions.validationConfigs)
    : { updateProfileInfoSchema: never() }
  const [isEditing, toggleIsEditing] = useReducer(
    isEditing => permissions.editProfile && !isEditing,
    false,
  )
  const {
    form: { formState, register, reset },
    handleSubmitWithAction,
  } = useHookFormAction(updateProfileInfo, zodResolver(updateProfileInfoSchema), {
    formProps: { defaultValues: { ...profileInfo, user_home_id: id } },
    actionProps: {
      onSuccess({ input }) {
        toggleIsEditing()
        reset(input)
      },
    },
  })

  const submitBtnRef = useRef<HTMLButtonElement | null>(null)
  return (
    <div className="main-profile-card" key="profile-card">
      <div className="main-column">
        <div className={`background-container`} key="background-container">
          {!permissions.editProfile
            ? null
            : isEditing && [
                <input
                  // ref={uploadBackgroundRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  // onChange={uploadBackground}
                  key="edit-background-input"
                  hidden
                />,
                <RoundButton
                  className="change-background-button"
                  type="edit"
                  abbrTitle={`Edit background`}
                  key="edit-background-btn"
                />,
              ]}
          <div
            className={`background`}
            key="background"
            style={{
              backgroundImage: 'url("' + defaultBackground.src + '")',
            }}
          />
        </div>
        <div className={`avatar-container`} key="avatar-container">
          {!permissions.editProfile
            ? null
            : isEditing && [
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.gif"
                  // onChange={uploadAvatar}
                  key="edit-avatar-input"
                  hidden
                />,
                <RoundButton
                  className="change-avatar-button"
                  type="edit"
                  abbrTitle={`Edit profile picture`}
                  // onClick={selectAvatar}
                  key="edit-avatar-btn"
                />,
              ]}
          <div
            className={`avatar`}
            style={{
              backgroundImage: 'url("' + defaultAvatar.src + '")',
              // pointerEvents: avatarForm.isSubmitting || !avatarForm.values.image ? 'auto' : 'inherit',
              // cursor: avatarForm.isSubmitting || !avatarForm.values.image ? 'auto' : 'pointer',
            }}
          ></div>
        </div>
        <div className="top-items" key="top-items">
          <div className="edit-save" key="edit-save">
            {!permissions.editProfile ? null : isEditing ? (
              <PrimaryButton
                color="green"
                onClick={() => {
                  if (formState.isDirty) {
                    submitBtnRef.current?.click()
                  } else {
                    toggleIsEditing()
                  }
                  //handleSubmitWithAction(e)
                }}
                key="save-button"
              >
                <Save />
              </PrimaryButton>
            ) : (
              <SecondaryButton onClick={toggleIsEditing} color="orange" key="edit-button">
                <Edit />
              </SecondaryButton>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmitWithAction} className="profile-card-header" key="card-header">
          <button
            disabled={!formState.isDirty}
            ref={submitBtnRef}
            type="submit"
            style={{ display: 'none' }}
          />
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
        <div className="main-profile-card-footer">
          <FollowButton
            followed={flags.followed}
            toggleFollow={
              permissions.follow
                ? () => {
                    alert('FollowButton')
                  }
                : undefined
            }
            key="follow-button"
          />
          {permissions.editRoles && user && (
            <ApprovalButton
              isApproved={user.roles.includes('publisher')}
              toggleIsApproved={() => {
                alert('ApprovalButton')
              }}
              key={'approval-button'}
            />
          )}
          <SecondaryButton
            color="grey"
            className={`message`}
            disabled={!permissions.sendMessage}
            onClick={() => alert('open message modal')}
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
              ...(permissions.report
                ? [
                    {
                      Element: (
                        <abbr
                          className={`report-button ${permissions.report ? '' : 'disabled'}`}
                          key="report"
                          tabIndex={0}
                          title={!permissions.report ? 'Login or signup to report' : undefined}
                          onClick={() => permissions.report && alert('open-report-modal')}
                        >
                          <Flag />
                          Report
                        </abbr>
                      ),
                    },
                  ]
                : []),
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
      </div>
    </div>
  )
}
