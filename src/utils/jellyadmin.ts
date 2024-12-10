const DEV = process.env.NODE_ENV === 'development';
export const getUrl = () => {
    return DEV ? 'https://test.jellyfin.nu' : 'https://utils.jellyfin.nu';
};
