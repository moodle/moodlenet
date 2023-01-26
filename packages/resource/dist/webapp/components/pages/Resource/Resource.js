import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Bookmark, BookmarkBorder, DeleteOutline, Edit, Favorite, FavoriteBorder, InsertDriveFile, Link, Save, Share, } from '@material-ui/icons';
import { Card, FloatingMenu, InputTextField, Loading, Modal, PrimaryButton, RoundButton, SearchImage, SecondaryButton, Snackbar, TertiaryButton, } from '@moodlenet/component-library';
import { getBackupImage, getTagList, MainLayout, useImageUrl, } from '@moodlenet/react-app/ui';
import { useFormik } from 'formik';
import { useMemo, useRef, useState } from 'react';
import { getResourceTypeInfo } from '../../../../common/types.mjs';
import { ContributorCard, } from '../../molecules/ContributorCard/ContributorCard.js';
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js';
import './Resource.scss';
export const Resource = ({ mainLayoutProps, mainColumnItems, sideColumnItems, moreButtonItems, resource, editResource, deleteResource, id: resourceId, url: resourceUrl, contentType, type, 
// resourceFormat,
contentUrl, numLikes, tags, isAuthenticated, 
// canEdit,
isAdmin, isOwner, autoImageAdded, canSearchImage, liked, toggleLike, bookmarked, toggleBookmark, }) => {
    const form = useFormik({
        initialValues: resource,
        // validate:yup,
        onSubmit: values => {
            return editResource(values);
        },
    });
    const [isEditing, setIsEditing] = useState(
    // canSearchImage && autoImageAdded
    false);
    const [shouldShowErrors, setShouldShowErrors] = useState(false);
    const [isSearchingImage, setIsSearchingImage] = useState(false);
    //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
    //     useState<boolean>(false)
    //   const [isAddingToCollection, setIsAddingToCollection] =
    //     useState<boolean>(false)
    //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
    //     useState<boolean>(false)
    const [isToDelete, setIsToDelete] = useState(false);
    const [isShowingImage, setIsShowingImage] = useState(false);
    const backupImage = useMemo(() => getBackupImage(resourceId), [resourceId]);
    //   const [isReporting, setIsReporting] = useState<boolean>(false)
    //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
    const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState(false);
    // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)
    const [imageUrl] = useImageUrl(form.values?.image?.location, backupImage?.location);
    const { typeName, typeColor } = getResourceTypeInfo(type);
    const handleOnEditClick = () => {
        setIsEditing(true);
    };
    const handleOnSaveClick = () => {
        if (form.isValid) {
            form.submitForm();
            setShouldShowErrors(false);
            setIsEditing(false);
        }
        else {
            setShouldShowErrors(true);
        }
    };
    const copyUrl = () => {
        navigator.clipboard.writeText(resourceUrl);
        setShowUrlCopiedAlert(false);
        setTimeout(() => {
            setShowUrlCopiedAlert(true);
        }, 100);
    };
    const uploadImageRef = useRef(null);
    const selectImage = () => {
        uploadImageRef.current?.click();
    };
    const uploadImage = (e) => {
        const selectedFile = e.currentTarget.files?.item(0);
        if (selectedFile) {
            form.setFieldValue('image', { location: selectedFile });
        }
    };
    const setImage = (image) => {
        form.setFieldValue('image', image);
    };
    const deleteImage = () => {
        form.setFieldValue('image', null);
    };
    const getImageCredits = (image) => {
        const credits = image ? (image.credits ? image.credits : undefined) : backupImage?.credits;
        return (credits && (_jsxs("div", { className: "image-credits", children: ["Photo by", _jsx("a", { href: credits.owner.url, target: "_blank", rel: "noreferrer", children: credits.owner.name }), "on", _jsx("a", { href: credits.owner.url, target: "_blank", rel: "noreferrer", children: credits.provider?.name })] })));
    };
    const imageDiv = (_jsx("img", { className: "image", src: imageUrl, alt: "Background", ...(contentType === 'file' && {
            onClick: () => setIsShowingImage(true),
        }), style: { maxHeight: form.values.image ? 'fit-content' : '150px' } }));
    const searchImageComponent = isSearchingImage && (_jsx(SearchImage, { onClose: () => setIsSearchingImage(false), setImage: setImage }));
    const mainResourceCard = {
        Item: () => (_jsxs(Card, { className: "main-resource-card", hideBorderWhenSmall: true, children: [_jsxs("div", { className: "resource-header", children: [_jsxs("div", { className: "type-and-actions", children: [_jsxs("span", { className: "resource-type", children: [_jsx("div", { className: "resource-label", children: "Resource" }), _jsx("div", { className: "type", style: {
                                                background: typeColor,
                                            }, children: typeName })] }), _jsxs("div", { className: "actions", children: [!isEditing && (_jsxs("div", { className: `like ${isAuthenticated && !isOwner ? '' : 'disabled'} ${liked && 'liked'}`, onClick: isAuthenticated && !isOwner && toggleLike ? toggleLike : () => undefined, children: [liked ? _jsx(Favorite, {}) : _jsx(FavoriteBorder, {}), _jsx("span", { children: numLikes })] })), isAuthenticated && !isEditing && (_jsx("div", { className: `bookmark ${bookmarked && 'bookmarked'}`, onClick: toggleBookmark, children: bookmarked ? _jsx(Bookmark, {}) : _jsx(BookmarkBorder, {}) })), isAuthenticated && !isOwner && (_jsx(FloatingMenu, { className: "more-button", menuContent: updatedMoreButtonItems.map(i => (_jsx(i.Item, {}, i.key))), hoverElement: _jsx(TertiaryButton, { className: `more`, children: "..." }) })), (isAdmin || isOwner) && (_jsx("div", { className: "edit-save", children: isEditing ? (_jsxs(PrimaryButton, { className: `${form.isSubmitting ? 'loading' : ''}`, color: "green", onClick: handleOnSaveClick, children: [_jsx("div", { className: "loading", style: {
                                                            visibility: form.isSubmitting ? 'visible' : 'hidden',
                                                        }, children: _jsx(Loading, { color: "white" }) }), _jsx("div", { className: "label", style: {
                                                            visibility: form.isSubmitting ? 'hidden' : 'visible',
                                                        }, children: _jsx(Save, {}) })] })) : (_jsx(SecondaryButton, { onClick: handleOnEditClick, color: "orange", children: _jsx(Edit, {}) })) }))] })] }), isOwner ? (_jsx(InputTextField, { name: "name", textarea: true, textAreaAutoSize: true, displayMode: true, className: "title underline", value: form.values.name, edit: isEditing, onChange: form.handleChange, style: {
                                pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
                            }, error: isEditing && shouldShowErrors && form.errors.name })) : (_jsx("div", { className: "title", children: form.values.name })), tags.length > 0 && _jsx("div", { className: "tags scroll", children: getTagList(tags, 'medium') })] }), (form.values.image || isEditing) && (_jsxs("div", { className: "image-container", children: [contentType === 'link' ? (_jsx("a", { href: contentUrl, target: "_blank", rel: "noreferrer", children: imageDiv })) : (_jsx(_Fragment, { children: imageDiv })), getImageCredits(form.values.image), isEditing && !form.isSubmitting && (_jsxs("div", { className: "image-actions", children: [_jsx("input", { ref: uploadImageRef, type: "file", accept: ".jpg,.jpeg,.png,.gif", onChange: uploadImage, hidden: true }), canSearchImage && (_jsx(RoundButton, { className: `search-image-button ${form.isSubmitting ? 'disabled' : ''} ${autoImageAdded ? 'highlight' : ''}`, type: "search", abbrTitle: `Search for an image`, onClick: () => setIsSearchingImage(true) })), _jsx(RoundButton, { className: `change-image-button ${form.isSubmitting ? 'disabled' : ''}`, type: "upload", abbrTitle: `Upload an image`, onClick: selectImage }), _jsx(RoundButton, { className: `delete-image ${form.isSubmitting ? 'disabled' : ''}`, type: "cross", abbrTitle: `Delete image`, onClick: deleteImage })] }))] })), isOwner ? (_jsx(InputTextField, { className: "description underline", name: "description", textarea: true, textAreaAutoSize: true, displayMode: true, edit: isEditing, value: form.values.description, onChange: form.handleChange, style: {
                        pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
                    }, error: isEditing && form.errors.description })) : (_jsxs("div", { className: "description", children: [" ", form.values.description, " "] })), isEditing && (_jsx("div", { className: "bottom", children: _jsx(SecondaryButton, { color: "red", onHoverColor: "fill-red", onClick: () => setIsToDelete(true), children: _jsx(DeleteOutline, {}) }) }))] })),
        key: 'main-resource-card',
    };
    const contributorCard = {
        Item: () => _jsx(ContributorCard, { ...ContributorCardStoryProps }),
        key: 'contributor-card',
    };
    const actions = {
        Item: () => (_jsxs(Card, { className: "resource-action-card", hideBorderWhenSmall: true, children: [_jsx(PrimaryButton
                // onClick={() => setIsAddingToMoodleLms(true)}
                , { children: "Send to Moodle" }), _jsx(SecondaryButton
                // onClick={() => setIsAddingToCollection(true)}
                , { children: "Add to Collection" }), _jsx("a", { 
                    // href={contentUrl}
                    target: "_blank", rel: "noreferrer", children: _jsx(SecondaryButton, { children: contentType === 'file' ? (_jsxs(_Fragment, { children: [_jsx(InsertDriveFile, {}), "Download file"] })) : (_jsxs(_Fragment, { children: [_jsx(Link, {}), "Open link"] })) }) })] })),
        key: 'actions',
    };
    const shareButton = {
        Item: () => (_jsxs("div", { tabIndex: 0, onClick: copyUrl, children: [_jsx(Share, {}), "Share"] }, "share-btn")),
        key: 'share-button',
    };
    const updatedSideColumnItems = [contributorCard, actions, ...(sideColumnItems ?? [])].filter((item) => !!item);
    const updatedMainColumnItems = [mainResourceCard, ...(mainColumnItems ?? [])].filter((item) => !!item);
    const updatedMoreButtonItems = [shareButton, ...(moreButtonItems ?? [])].filter((item) => !!item);
    const snackbars = (_jsx(_Fragment, { children: showUrlCopiedAlert && (_jsx(Snackbar, { type: "success", position: "bottom", autoHideDuration: 6000, showCloseButton: false, children: "Copied to clipoard" })) }));
    const modals = (_jsxs(_Fragment, { children: [isShowingImage && imageUrl && (_jsxs(Modal, { className: "image-modal", closeButton: false, onClose: () => setIsShowingImage(false), style: {
                    maxWidth: '90%',
                    maxHeight: form.values.type !== '' ? 'calc(90% + 20px)' : '90%',
                }, children: [_jsx("img", { src: imageUrl, alt: "Resource" }), getImageCredits(form.values.image)] })), isToDelete && deleteResource && (_jsx(Modal, { title: `Alert`, actions: _jsx(PrimaryButton, { onClick: () => {
                        deleteResource();
                        setIsToDelete(false);
                    }, color: "red", children: "Delete" }), onClose: () => setIsToDelete(false), style: { maxWidth: '400px' }, className: "delete-message", children: "The resource will be deleted" }))] }));
    return (_jsxs(MainLayout, { ...mainLayoutProps, children: [modals, snackbars, searchImageComponent, _jsx("div", { className: "resource", children: _jsxs("div", { className: "content", children: [_jsx("div", { className: "main-column", children: updatedMainColumnItems.map(i => (_jsx(i.Item, {}, i.key))) }), _jsx("div", { className: "side-column", children: updatedSideColumnItems?.map(i => (_jsx(i.Item, {}, i.key))) })] }) })] }));
};
Resource.displayName = 'ResourcePage';
export default Resource;
//# sourceMappingURL=Resource.js.map