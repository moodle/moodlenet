import type { Href } from '@moodlenet/component-library'
import { PrimaryButton } from '@moodlenet/component-library'
import { Link } from '@moodlenet/react-app/ui'
import { ArrowForward, LibraryAdd, NoteAdd, StreamOutlined } from '@mui/icons-material'
import type { FC } from 'react'

export type CreateResourcePublishContentItemProps = { createResource(): void }
export const CreateResourcePublishContentItem: FC<CreateResourcePublishContentItemProps> = ({
  createResource,
}) => (
  <div onClick={createResource}>
    <PrimaryButton className="" color="card">
      <NoteAdd />
      <div className="content">
        <div className="title">Publish a new resource</div>
        <div className="subtitle">A resource is a single item of content</div>
      </div>
    </PrimaryButton>
  </div>
)

export type CreateCollectionPublishContentItemProps = { createCollection(): void }
export const CreateCollectionPublishContentItem: FC<CreateCollectionPublishContentItemProps> = ({
  createCollection,
}) => (
  <div onClick={createCollection}>
    <PrimaryButton className="" color="card">
      <LibraryAdd />
      <div className="content">
        <div className="title">Publish a new collection</div>
        <div className="subtitle">Collections are groups of resources</div>
      </div>
    </PrimaryButton>
  </div>
)

export type LoginPublishContentItemProps = { loginHref: Href }
export const LoginPublishContentItem: FC<LoginPublishContentItemProps> = ({ loginHref }) => (
  <Link href={loginHref}>
    <PrimaryButton className="" color="card">
      <ArrowForward />
      <div className="content">
        <div className="title">Log in</div>
        <div className="subtitle">Enter to your account</div>
      </div>
    </PrimaryButton>
  </Link>
)

export type SignUpPublishContentItemProps = { signUpHref: Href }
export const SignUpPublishContentItem: FC<SignUpPublishContentItemProps> = ({ signUpHref }) => (
  <Link href={signUpHref}>
    <PrimaryButton className="" color="card">
      <StreamOutlined />
      <div className="content">
        <div className="title">Join now</div>
        <div className="subtitle">Create a new account</div>
      </div>
    </PrimaryButton>
  </Link>
)
