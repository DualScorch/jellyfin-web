
const DEV = process.env.NODE_ENV === 'development';
export const getUtilsUrl = () => {
    return DEV ? 'https://test.jellyfin.nu' : 'https://utils.jellyfin.nu';
};
