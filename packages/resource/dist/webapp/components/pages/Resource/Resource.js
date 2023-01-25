import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Bookmark, BookmarkBorder, DeleteOutline, Edit, Favorite, FavoriteBorder, InsertDriveFile, Link, Save, Share, } from '@material-ui/icons';
import { Card, FloatingMenu, InputTextField, Loading, PrimaryButton, SecondaryButton, Snackbar, TertiaryButton, } from '@moodlenet/component-library';
import { getTagList, MainLayout, } from '@moodlenet/react-app/ui';
import { useFormik } from 'formik';
import { useState } from 'react';
import { getResourceTypeInfo } from '../../../../common/types.mjs';
import { ContributorCard, } from '../../molecules/ContributorCard/ContributorCard.js';
import { ContributorCardStoryProps } from '../../molecules/ContributorCard/ContributorCard.stories.js';
import './Resource.scss';
export const Resource = ({ mainLayoutProps, mainColumnItems, sideColumnItems, resource, editResource, 
// id: resourceId,
url: resourceUrl, contentType, type, 
// resourceFormat,
// contentUrl,
numLikes, tags, isAuthenticated, 
// canEdit,
isAdmin, isOwner, liked, bookmarked, }) => {
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
    //   const [isSearchingImage, setIsSearchingImage] = useState<boolean>(false)
    //   const [shouldShowSendToMoodleLmsError, setShouldShowSendToMoodleLmsError] =
    //     useState<boolean>(false)
    //   const [isAddingToCollection, setIsAddingToCollection] =
    //     useState<boolean>(false)
    //   const [isAddingToMoodleLms, setIsAddingToMoodleLms] =
    //     useState<boolean>(false)
    //   const [isToDelete, setIsToDelete] = useState<boolean>(false)
    //   const [isShowingImage, setIsShowingImage] = useState<boolean>(false)
    //   const backupImage: AssetInfo | null | undefined = useMemo(
    //     () => getBackupImage(resourceId),
    //     [resourceId]
    //   )
    //   const [isReporting, setIsReporting] = useState<boolean>(false)
    //   const [showReportedAlert, setShowReportedAlert] = useState<boolean>(false)
    const [showUrlCopiedAlert, setShowUrlCopiedAlert] = useState(false);
    // const [isEditing, toggleIsEditing] = useReducer(_ => !_, false)
    // const resourCard: AddonItem = {
    //   Item: () => (
    //     <ResourceCard
    //       {...resourceCardProps}
    //       isEditing={isEditing}
    //       toggleIsEditing={toggleIsEditing}
    //     />
    //   ),
    //   key: 'resource-card',
    // }
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
    const mainResourceCard = {
        Item: () => (_jsxs(Card, { className: "main-resource-card", hideBorderWhenSmall: true, children: [_jsxs("div", { className: "resource-header", children: [_jsxs("div", { className: "type-and-actions", children: [_jsxs("span", { className: "resource-type", children: [_jsx("div", { className: "resource-label", children: "Resource" }), _jsx("div", { className: "type", style: {
                                                background: typeColor,
                                            }, children: typeName })] }), _jsxs("div", { className: "actions", children: [!isEditing && (_jsxs("div", { className: `like ${isAuthenticated && !isOwner ? '' : 'disabled'} ${liked && 'liked'}`, children: [liked ? _jsx(Favorite, {}) : _jsx(FavoriteBorder, {}), _jsx("span", { children: numLikes })] })), isAuthenticated && !isEditing && (_jsx("div", { className: `bookmark ${bookmarked && 'bookmarked'}`, children: bookmarked ? _jsx(Bookmark, {}) : _jsx(BookmarkBorder, {}) })), isAuthenticated && !isOwner && (_jsx(FloatingMenu, { className: "more-button", menuContent: [
                                                _jsxs("div", { tabIndex: 0, onClick: copyUrl, children: [_jsx(Share, {}), "Share"] }, "share-btn"),
                                                // <div tabIndex={0} onClick={() => setIsReporting(true)}>
                                                //   <Flag />
                                                //   <Trans>Report</Trans>
                                                // </div>,
                                            ], hoverElement: _jsx(TertiaryButton, { className: `more`, children: "..." }) })), (isAdmin || isOwner) && (_jsx("div", { className: "edit-save", children: isEditing ? (_jsxs(PrimaryButton, { className: `${form.isSubmitting ? 'loading' : ''}`, color: "green", onClick: handleOnSaveClick, children: [_jsx("div", { className: "loading", style: {
                                                            visibility: form.isSubmitting ? 'visible' : 'hidden',
                                                        }, children: _jsx(Loading, { color: "white" }) }), _jsx("div", { className: "label", style: {
                                                            visibility: form.isSubmitting ? 'hidden' : 'visible',
                                                        }, children: _jsx(Save, {}) })] })) : (_jsx(SecondaryButton, { onClick: handleOnEditClick, color: "orange", children: _jsx(Edit, {}) })) }))] })] }), isOwner ? (_jsx(InputTextField, { name: "name", textarea: true, textAreaAutoSize: true, displayMode: true, className: "title underline", value: form.values.name, edit: isEditing, onChange: form.handleChange, style: {
                                pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
                            }, error: isEditing && shouldShowErrors && form.errors.name })) : (_jsx("div", { className: "title" })), tags.length > 0 && _jsx("div", { className: "tags scroll", children: getTagList(tags, 'medium') })] }), isOwner ? (_jsx(InputTextField, { className: "description underline", name: "description", textarea: true, textAreaAutoSize: true, displayMode: true, edit: isEditing, 
                    // value={form.values.description}
                    // onChange={form.handleChange}
                    style: {
                    // pointerEvents: `${form.isSubmitting ? 'none' : 'inherit'}`,
                    } })) : (_jsx("div", { className: "description" })), isEditing && (_jsx("div", { className: "bottom", children: _jsx(SecondaryButton, { color: "red", onHoverColor: "fill-red", children: _jsx(DeleteOutline, {}) }) }))] })),
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
    const updatedSideColumnItems = [contributorCard, actions, ...(sideColumnItems ?? [])].filter((item) => !!item);
    const updatedMainColumnItems = [mainResourceCard, ...(mainColumnItems ?? [])].filter((item) => !!item);
    const snackbars = (_jsx(_Fragment, { children: showUrlCopiedAlert && (_jsx(Snackbar, { type: "success", position: "bottom", autoHideDuration: 6000, showCloseButton: false, children: "Copied to clipoard" })) }));
    return (_jsxs(MainLayout, { ...mainLayoutProps, children: [snackbars, _jsx("div", { className: "resource", children: _jsxs("div", { className: "content", children: [_jsx("div", { className: "main-column", children: updatedMainColumnItems.map(i => (_jsx(i.Item, {}, i.key))) }), _jsx("div", { className: "side-column", children: updatedSideColumnItems?.map(i => (_jsx(i.Item, {}, i.key))) })] }) })] }));
};
Resource.displayName = 'ResourcePage';
export default Resource;
//# sourceMappingURL=Resource.js.map