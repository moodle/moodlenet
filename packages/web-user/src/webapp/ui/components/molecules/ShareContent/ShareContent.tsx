import type { Href } from '@moodlenet/component-library'
import { Modal, PrimaryButton } from '@moodlenet/component-library'
import type { ComponentType, FC } from 'react'
import { useState } from 'react'
import './ShareContent.scss'
import {
  CreateCollectionShareContentItem,
  CreateResourceShareContentItem,
  LoginShareContentItem,
  SignUpShareContentItem,
} from './ShareContentItems.js'

export type ShareContentItem = {
  Component: ComponentType
  key: string
  className?: string
}

export type shareContentHrefs = {
  loginHref: Href
  signUpHref: Href
  createResource(): void
  createCollection(): void
}

export type ShareContentProps = {
  shareContentHrefs: shareContentHrefs
  isAuthenticated: boolean
}

export const ShareContent: FC<ShareContentProps> = ({ shareContentHrefs, isAuthenticated }) => {
  const { loginHref, signUpHref, createResource, createCollection } = shareContentHrefs
  const [isShowingContentModal, setIsShowingContentModal] = useState<boolean>(false)

  const modals = [
    !isAuthenticated && isShowingContentModal && (
      <Modal
        className="create-content-modal"
        title={`Log in or create an account to start sharing content`}
        closeButton={false}
        onClose={() => {
          setIsShowingContentModal(false)
        }}
        style={{ maxWidth: '500px', width: '100%', gap: '22px' }}
      >
        <LoginShareContentItem loginHref={loginHref} />
        <SignUpShareContentItem signUpHref={signUpHref} />
      </Modal>
    ),
    isAuthenticated && isShowingContentModal && (
      <Modal
        className="create-content-modal"
        title={`What would you like to create?`}
        closeButton={false}
        onClose={() => {
          setIsShowingContentModal(false)
        }}
        style={{ maxWidth: '500px', width: '100%', gap: '22px' }}
      >
        <CreateResourceShareContentItem createResource={createResource} />
        <CreateCollectionShareContentItem createCollection={createCollection} />
      </Modal>
    ),
  ]

  return (
    <>
      {modals}
      <PrimaryButton
        className="share-content"
        color="blue"
        onClick={() => setIsShowingContentModal(true)}
      >
        Share content
      </PrimaryButton>
    </>
  )
}
