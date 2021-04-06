import { t, Trans } from '@lingui/macro'
import { FC } from 'react'
import { Dropdown, Icon, Image, Menu, Modal } from 'semantic-ui-react'
import { Link } from '../elements/link'
import { AddCollectionForm, AddCollectionFormProps } from '../forms/collection/AddCollectionForm'
import { AddResourceForm, AddResourceFormProps } from '../forms/resource/AddResourceForm'
import logo from '../static/img/logo.jpg'

export type PageHeaderProps = {
  homeLink: string
  loginLink: string
  me: null | {
    logout(): unknown
    username: string

    toggleShowAddCollection(): unknown
    showAddCollection: boolean
    addCollectionFormProps: AddCollectionFormProps

    toggleShowAddResource(): unknown
    showAddResource: boolean
    addResourceFormProps: AddResourceFormProps
  }

  search(text: string): unknown
  searchValue: string
}

export const PageHeader: FC<PageHeaderProps> = ({ searchValue, search, homeLink, loginLink, me }) => {
  return (
    <>
      <Menu fixed="top">
        <Link href={homeLink}>
          <Menu.Item header>
            <Image size="mini" src={logo} style={{ marginRight: '1.5em' }} />
            MoodleNet
          </Menu.Item>
        </Link>
        <Menu.Item header>
          <div className="ui search">
            <div className="ui icon search input">
              <input
                autoFocus={!!searchValue}
                className="prompt"
                type="text"
                defaultValue={searchValue}
                placeholder="Search..."
                onInput={e => {
                  //if (e.key === 'Enter') {
                  search(e.currentTarget.value)
                  //}
                }}
              />
              <i aria-hidden="true" className="search circular link icon"></i>
            </div>
          </div>
        </Menu.Item>
        <Menu.Item header position="right">
          {me ? (
            <>
              <Dropdown
                item
                text={me.username}
                simple
                icon={<Icon fitted name="user circle" size="big" color="orange" />}
              >
                <Dropdown.Menu>
                  <Dropdown.Item onClick={me.logout}>
                    <Trans>Logout</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={me.toggleShowAddResource}>
                    <Trans>Create Resource</Trans>
                  </Dropdown.Item>
                  <Dropdown.Item onClick={me.toggleShowAddCollection}>
                    <Trans>Create Collection</Trans>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <Link href={loginLink}>
              <Trans>Sign in</Trans>
              <Icon fitted name="user circle outline" size="big" color="orange" />
            </Link>
          )}
        </Menu.Item>
      </Menu>
      {!me ? null : (
        <>
          <Modal
            closeOnEscape
            closeOnDimmerClick
            open={me.showAddCollection}
            header={t`Add Collection`}
            content={<AddCollectionForm {...me.addCollectionFormProps} />}
            actions={[{ key: 'cancel', content: t`Cancel` }]}
            onClose={me.toggleShowAddCollection}
            onActionClick={me.toggleShowAddCollection}
          />
          <Modal
            closeOnEscape
            closeOnDimmerClick
            open={me.showAddResource}
            header={t`Add Resource`}
            content={<AddResourceForm {...me.addResourceFormProps} />}
            actions={[{ key: 'cancel', content: t`Cancel` }]}
            onClose={me.toggleShowAddResource}
            onActionClick={me.toggleShowAddResource}
          />
        </>
      )}
    </>
  )
}
