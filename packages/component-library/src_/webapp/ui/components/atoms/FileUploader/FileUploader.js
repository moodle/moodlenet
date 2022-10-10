import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ReactComponent as UploadFileIcon } from '../../../../static/icons/upload-file.svg';
import { ReactComponent as UploadImageIcon } from '../../../../static/icons/upload-image.svg';
import './FileUploader.scss';
export const FileUploader = ({ type, className,
// onClick,
 }) => {
    return (_jsx("div", { className: `file-uploader ${className}`, 
        // className={`uploader ${isToDrop ? 'hover' : ''} ${
        //   form.values.content instanceof Blob && form.errors.content
        //     ? 'error'
        //     : ''
        // }`}
        id: "drop_zone", children: type === 'file' ? (_jsxs("div", { className: "file upload", 
            // onClick={selectFile}
            // onKeyUp={(e) => e.key === 'Enter' && selectFile()}
            tabIndex: 0, children: [_jsx("input", { 
                    // ref={uploadFileRef}
                    type: "file", name: "content", 
                    // onChange={({ target }) => {
                    //   setContent(target.files?.[0])
                    // }}
                    hidden: true }, "content"
                // onChange={({ target }) => {
                //   setContent(target.files?.[0])
                // }}
                ), _jsx(UploadFileIcon, {}), _jsxs("span", { children: [_jsx("span", { children: "Drop or click to upload a file!" }), _jsx("br", {})] })] })) : (_jsxs("div", { className: "image upload", 
            // onClick={selectImage}
            tabIndex: 0, children: [_jsx("input", { 
                    // ref={uploadImageRef}
                    type: "file", accept: ".jpg,.jpeg,.png,.gif", name: "image", 
                    // onChange={({ target }) =>
                    //   form.setFieldValue('image', target.files?.[0])
                    // }
                    hidden: true }, "image"
                // onChange={({ target }) =>
                //   form.setFieldValue('image', target.files?.[0])
                // }
                ), _jsx(UploadImageIcon, {}), _jsx("span", { children: "Drop or click to upload an image!" })] })) }));
};
FileUploader.defaultProps = {
    type: 'file',
};
export default FileUploader;
//# sourceMappingURL=FileUploader.js.map