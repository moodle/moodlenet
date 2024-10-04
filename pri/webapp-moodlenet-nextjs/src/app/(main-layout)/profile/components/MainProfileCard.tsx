'use client'

import { flags } from '@moodle/lib-types'
import Edit from '@mui/icons-material/Edit'
import Flag from '@mui/icons-material/Flag'
import Save from '@mui/icons-material/Save'
import Share from '@mui/icons-material/Share'
import { useReducer } from 'react'
import { ApprovalButton } from '../../../../ui/atoms/ApproveButton/ApproveButton'
import { FloatingMenu } from '../../../../ui/atoms/FloatingMenu/FloatingMenu'
import { FollowButton } from '../../../../ui/atoms/FollowButton/FollowButton'
import InputTextField from '../../../../ui/atoms/InputTextField/InputTextField'
import { PrimaryButton } from '../../../../ui/atoms/PrimaryButton/PrimaryButton'
import { RoundButton } from '../../../../ui/atoms/RoundButton/RoundButton'
import { SecondaryButton } from '../../../../ui/atoms/SecondaryButton/SecondaryButton'
import defaultAvatar from '../../../../ui/lib/assets/img/default-avatar.png'
import defaultBackground from '../../../../ui/lib/assets/img/default-landing-background.png'
import './MainProfileCard.scss'
import {
  getUserHomePrimarySchemas,
  ProfileInfo,
  updateProfileInfoForm,
  UserHomePrimaryMsgSchemaConfigs,
} from 'domain/src/user-hone'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfileInfo } from '../profile.server'
import { z } from 'zod'

export interface MainProfileCardProps {
  can: flags<'un_follow' | 'un_approve' | 'edit' | 'sendMessage' | 'report'>
  is: flags<'following' | 'approved'>
  userHomePrimaryMsgSchemaConfigs: UserHomePrimaryMsgSchemaConfigs
  profileInfoForm: updateProfileInfoForm
}

export function MainProfileCard({
  can,
  is,
  userHomePrimaryMsgSchemaConfigs,
  profileInfoForm,
}: MainProfileCardProps) {
  const { updateProfileInfoSchema: profileInfoSchema } = getUserHomePrimarySchemas(
    userHomePrimaryMsgSchemaConfigs,
  )
  const {
    form: { formState, register },
    handleSubmitWithAction,
  } = useHookFormAction(updateProfileInfo, zodResolver(profileInfoSchema), {
    formProps: { defaultValues: profileInfoForm },
  })
  const [isEditing, toggleIsEditing] = useReducer(isEditing => can.edit && !isEditing, false)
  return (
    <div className="main-profile-card" key="profile-card">
      <div className="main-column">
        <div className={`background-container`} key="background-container">
          {!can.edit
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
          {!can.edit
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
            {!can.edit ? null : isEditing ? (
              <PrimaryButton
                color="green"
                onClick={() => {
                  // form.submitForm()
                  // avatarForm.isValid && avatarForm.submitForm()
                  // backgroundForm.isValid && backgroundForm.submitForm()
                  // form.isValid &&
                  toggleIsEditing()
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
          <div className="title" key="title-row">
            <InputTextField
              className="display-name underline"
              placeholder={`Display name`}
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
                placeholder="Location"
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
                placeholder="Website"
                edit={isEditing}
                {...register('siteUrl')}
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
            placeholder={`What should others know about you?`}
            {...register('aboutMe')}
            error={isEditing && formState.errors.aboutMe?.message}
          />
        </form>
        <div className="main-profile-card-footer">
          <FollowButton
            is={{ followed: is.following }}
            can={{ un_follow: can.un_follow }}
            toggleFollow={alert}
            key="follow-button"
          />
          {can.un_approve && (
            <ApprovalButton
              isApproved={is.approved}
              toggleIsApproved={alert}
              key={'approval-button'}
            />
          )}
          <SecondaryButton
            color="grey"
            className={`message`}
            disabled={!can.sendMessage}
            onClick={() => alert('open message modal')}
            abbr={!can.sendMessage ? 'Login or signup to send messages' : 'Send a message'}
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
                    className={`report-button ${can.report ? '' : 'disabled'}`}
                    key="report"
                    tabIndex={0}
                    title={!can.report ? 'Login or signup to report' : undefined}
                    onClick={() => can.report && alert('open-report-modal')}
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
      </div>
    </div>
  )
}
