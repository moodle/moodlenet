import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Edit, Save } from '@material-ui/icons';
import { 
// AddonItem,
// FloatingMenu,
InputTextField, Modal, PrimaryButton, RoundButton, SecondaryButton, useImageUrl, } from '@moodlenet/component-library';
import { useLayoutEffect, useRef, useState } from 'react';
import defaultAvatar from '../../../assets/img/default-avatar.svg';
import defaultBackground from '../../../assets/img/default-background.svg';
import './ResourceCard.scss';
export const ResourceCard = ({ form, isEditing, canEdit, toggleIsEditing, }) => {
    const [isShowingAvatar, setIsShowingAvatar] = useState(false);
    const [isShowingBackground, setIsShowingBackground] = useState(false);
    const shouldShowErrors = !!form.submitCount;
    const [, /* _isShowingSmallCard */ setIsShowingSmallCard] = useState(false);
    const setIsShowingSmallCardHelper = () => {
        setIsShowingSmallCard(window.innerWidth < 550 ? true : false);
    };
    useLayoutEffect(() => {
        window.addEventListener('resize', setIsShowingSmallCardHelper);
        return () => {
            window.removeEventListener('resize', setIsShowingSmallCardHelper);
        };
    }, []);
    const uploadBackgroundRef = useRef(null);
    const selectBackground = (e) => {
        e.stopPropagation();
        uploadBackgroundRef.current?.click();
    };
    const uploadAvatarRef = useRef(null);
    const selectAvatar = (e) => {
        e.stopPropagation();
        uploadAvatarRef.current?.click();
    };
    const uploadBackground = (e) => form.setFieldValue('backgroundImage', e.currentTarget.files?.item(0));
    const uploadAvatar = (e) => form.setFieldValue('avatarImage', e.currentTarget.files?.item(0));
    const [backgroundUrl] = useImageUrl(/* form.values.backgroundImage */ null, defaultBackground);
    const background = {
        backgroundImage: 'url("' + backgroundUrl + '")',
        backgroundSize: 'cover',
    };
    const [avatarUrl] = useImageUrl(/* form.values.avatarImage */ null, defaultAvatar);
    const avatar = {
        backgroundImage: 'url("' + avatarUrl + '")',
        backgroundSize: 'cover',
    };
    const editButton = (_jsx("div", { className: "edit-save", children: isEditing ? (_jsx(PrimaryButton, { color: "green", onClick: () => {
                form.submitForm();
                form.isValid && toggleIsEditing();
            }, children: _jsx(Save, {}) }, "save-button")) : (_jsx(SecondaryButton, { onClick: toggleIsEditing, color: "orange", children: _jsx(Edit, {}) }, "edit-button")) }));
    const title = isEditing ? (_jsx(InputTextField, { className: "display-name underline", placeholder: /* t */ `Display name`, value: form.values.displayName, onChange: form.handleChange, name: "displayName", displayMode: true, edit: isEditing, disabled: form.isSubmitting, error: isEditing && shouldShowErrors && form.errors.displayName }, "display-name")) : (_jsx("div", { className: "display-name", children: form.values.displayName }, "display-name"));
    const description = isEditing ? (_jsx(InputTextField, { textAreaAutoSize: true, value: form.values.description, onChange: form.handleChange, textarea: true, displayMode: true, placeholder: /* t */ `What should others know about you?`, className: "description", name: "description", edit: isEditing, disabled: form.isSubmitting, error: isEditing && shouldShowErrors && form.errors.description }, "description")) : (_jsx("div", { className: "description", children: form.values.description }, "description"));
    const updatedTopItems = canEdit && _jsx("div", { className: "top-items", children: editButton });
    const updatedTitleItems = [title];
    const baseSubtitleItems = isEditing
        ? [
            _jsx("span", { children: _jsx(InputTextField, { className: "underline", placeholder: "Location", value: form.values.location, onChange: form.handleChange, displayMode: true, name: "location", edit: isEditing, disabled: form.isSubmitting, error: isEditing && shouldShowErrors && form.errors.location }) }, "edit-location"),
            _jsx("span", { children: _jsx(InputTextField, { className: "underline", value: form.values.siteUrl, onChange: form.handleChange, displayMode: true, placeholder: "Website", name: "siteUrl", edit: isEditing, disabled: form.isSubmitting, error: isEditing && shouldShowErrors && form.errors.siteUrl }) }, "edit-site-url"),
        ]
        : [
            _jsx("span", { children: form.values.location }, "location"),
            _jsx("a", { href: form.values.siteUrl, target: "_blank", rel: "noreferrer", children: form.values.siteUrl }, "site-url"),
        ];
    const updatedSubtitleItems = [...baseSubtitleItems];
    const cardHeader = (_jsxs("div", { className: "resource-card-header", children: [_jsx("div", { className: "title", children: updatedTitleItems }), _jsx("div", { className: `subtitle ${isEditing ? 'edit' : ''}`, children: updatedSubtitleItems })] }, "card-header"));
    const editAvatarButton = isEditing && [
        _jsx("input", { ref: uploadAvatarRef, type: "file", accept: ".jpg,.jpeg,.png,.gif", onChange: uploadAvatar, hidden: true }, "edit-avatar-input"),
        _jsx(RoundButton, { className: "change-avatar-button", type: "edit", abbrTitle: /* t */ `Edit resource picture`, onClick: selectAvatar }, "edit-avatar-btn"),
    ];
    const editBackgroundButton = isEditing && [
        _jsx("input", { ref: uploadBackgroundRef, type: "file", accept: ".jpg,.jpeg,.png,.gif", onChange: uploadBackground, hidden: true }, "edit-background-input"),
        _jsx(RoundButton, { className: "change-background-button", type: "edit", abbrTitle: /* t */ `Edit background`, onClick: selectBackground }, "edit-background-btn"),
    ];
    const updatedBottomItems = _jsx("div", { className: "buttons" });
    const updatedContentItems = [updatedTopItems, cardHeader, description, updatedBottomItems];
    return (_jsxs("div", { className: "resource-card", children: [isShowingBackground && backgroundUrl && (_jsx(Modal, { className: "image-modal", closeButton: false, onClose: () => setIsShowingBackground(false), style: { maxWidth: '90%', maxHeight: '90%' }, children: _jsx("img", { src: backgroundUrl, alt: "Background" }) }, "image-modal")), isShowingAvatar && avatarUrl && (_jsx(Modal, { className: "image-modal", closeButton: false, onClose: () => setIsShowingAvatar(false), style: { maxWidth: '90%', maxHeight: '90%' }, children: _jsx("img", { src: avatarUrl, alt: "Avatar" }) }, "image-modal")), _jsxs("div", { className: `background-container`, children: [editBackgroundButton, _jsx("div", { className: `background`, style: {
                            ...background,
                            pointerEvents: !isEditing || defaultBackground === backgroundUrl ? 'none' : 'inherit',
                        }, onClick: () => setIsShowingBackground(true) })] }), _jsxs("div", { className: `avatar-container`, children: [editAvatarButton, _jsx("div", { className: `avatar`, style: {
                            ...avatar,
                            pointerEvents: !isEditing || defaultAvatar === avatarUrl ? 'none' : 'inherit',
                        }, onClick: () => setIsShowingAvatar(true) })] }), _jsxs("div", { className: "content", children: [...updatedContentItems] })] }, "resource-card"));
};
//# sourceMappingURL=ResourceCard.js.map