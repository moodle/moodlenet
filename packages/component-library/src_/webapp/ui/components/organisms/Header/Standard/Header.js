import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { LibraryAdd as LibraryAddIcon, NoteAdd as NoteAddIcon } from '@material-ui/icons';
import { Link } from 'react-router-dom';
// import { AuthCtx } from '../../../../../web-lib/auth.js'
// import { RegistryEntry } from '../../../../../main-lib/registry'
// import { MainContext } from '../../../../../MainContext.js'
import { ReactComponent as AddIcon } from '../../../../assets/icons/add-round.svg';
import defaultAvatar from '../../../../assets/img/default-avatar.svg';
import FloatingMenu from '../../../atoms/FloatingMenu/FloatingMenu.js';
import PrimaryButton from '../../../atoms/PrimaryButton/PrimaryButton.js';
import TertiaryButton from '../../../atoms/TertiaryButton/TertiaryButton.js';
import HeaderTitle from '../HeaderTitle/HeaderTitle.js';
import './Header.scss';
const Header = ({ user, organization }) => {
    // const { registry: avatarMenuItems } = header.avatarMenuItems.useRegistry()
    // const { registry: rightComponents } = header.rightComponents.useRegistry()
    // const { clientSessionData, logout } = useContext(AuthCtx)
    const avatarImageUrl = user?.avatarUrl ?? defaultAvatar;
    const avatar = {
        backgroundImage: `url(${avatarImageUrl})`,
        // backgroundImage: 'url(' + defaultAvatar + ')',
        // 'url(' + (me && me.avatar ? me.avatar : defaultAvatar) + ')',
        backgroundSize: 'cover',
    };
    // const reoderedAvatarMenuItems = useMemo(() => {
    //   const baseItems: RegistryEntry<HeaderAvatarMenuItemRegItem>[] = [
    //     { pkg: shell.pkg, item: { Text: 'Settings', Icon: () => <SettingsIcon />, Path: '/settings' } },
    //     { pkg: shell.pkg, item: { Text: 'Log out', Icon: () => <ExitToAppIcon />, OnClick: logout } },
    //   ]
    //   return baseItems.concat(
    //     avatarMenuItems.entries.sort((a, b) => (a.item.Position ?? Infinity) - (b.item.Position ?? Infinity) || 0),
    //   )
    // }, [avatarMenuItems.entries])
    // console.log('logo ', logo)
    // console.log('smallLogo ', smallLogo)
    return (_jsx("div", { className: "header", children: _jsxs("div", { className: "content", children: [_jsx("div", { className: "left", children: _jsx(HeaderTitle, { logo: organization.logo, smallLogo: organization.smallLogo, url: organization.url }) }), _jsxs("div", { className: "right", children: [user && (_jsx(FloatingMenu, { className: "add-menu", menuContent: [
                                _jsxs(Link /* href={newResourceHref} */, { to: "", tabIndex: 0, children: [_jsx(NoteAddIcon, {}), "New resource"] }),
                                _jsxs(Link /* href={newCollectionHref} */, { to: "", tabIndex: 0, children: [_jsx(LibraryAddIcon, {}), "New collection"] }),
                            ], hoverElement: _jsx(AddIcon, { className: "add-icon", tabIndex: 0 }) })), user ? (_jsx(FloatingMenu, { className: "avatar-menu", menuContent: [] /* reoderedAvatarMenuItems.map((avatarMenuItem, i) => {
                            return avatarMenuItem.item.Path ? (
                              <Link
                                key={i}
                                className={`avatar-menu-item ${avatarMenuItem.item.ClassName}`}
                                to={avatarMenuItem.item.Path}
                                onClick={avatarMenuItem.item.OnClick}
                              >
                                <>
                                  <avatarMenuItem.item.Icon /> {avatarMenuItem.item.Text}
                                </>
                              </Link>
                            ) : (
                              <div
                                key={i}
                                tabIndex={0}
                                className={`avatar-menu-item ${avatarMenuItem.item.ClassName}`}
                                onClick={avatarMenuItem.item.OnClick}
                              >
                                <>
                                  <avatarMenuItem.item.Icon /> {avatarMenuItem.item.Text}
                                </>
                              </div>
                            )
                          }) */, hoverElement: _jsx("div", { style: avatar, className: "avatar" }) })) : (
                        // <span>
                        //   hello <strong>{clientSession.user.displayName}</strong>
                        //   <span style={{ cursor: 'pointer', marginLeft: '10px' }} onClick={logout}>
                        //     logout
                        //   </span>
                        // </span>
                        _jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", children: _jsx(PrimaryButton, { children: "Login" }) }), _jsx(Link, { to: "/signup", children: _jsx(TertiaryButton, { children: "Join now" }) })] }))] })] }) }));
};
export default Header;
//# sourceMappingURL=Header.js.map