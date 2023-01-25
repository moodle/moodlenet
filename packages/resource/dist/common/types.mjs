export const getResourceTypeInfo = (type) => {
    switch (type) {
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
        case 'mkv':
        case 'webm':
        case 'avchd':
        case 'flv':
        case 'f4v':
        case 'swf':
            return { typeName: `Video`, typeColor: '#2A75C0' };
        case 'mp3':
        case 'wav':
        case 'wma':
        case 'aac':
        case 'm4a':
            return { typeName: `Audio`, typeColor: '#8033c7' };
        case 'jpeg':
        case 'jpg':
        case 'png':
        case 'gif':
            return { typeName: `Image`, typeColor: '#27a930' };
        case 'pdf':
            return { typeName: 'pdf', typeColor: '#df3131' };
        case 'xls':
        case 'xlsx':
        case 'ods':
            return { typeName: `Spreadshee`, typeColor: '#0f9d58' };
        case 'doc':
        case 'docx':
        case 'odt':
            return { typeName: 'Word', typeColor: '#4285f4' };
        case 'ppt':
        case 'pptx':
        case 'odp':
            return { typeName: `Presentation`, typeColor: '#dfa600' };
        case 'mbz':
            return { typeName: 'Moodle course', typeColor: '#f88012' };
        case 'Web Page':
            return { typeName: `Web page`, typeColor: '#C233C7' };
        default:
            return { typeName: type, typeColor: '#15845A' };
    }
};
//# sourceMappingURL=types.mjs.map