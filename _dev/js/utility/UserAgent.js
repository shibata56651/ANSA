const ua = window.navigator.userAgent.toLowerCase();

/**
 * IE判定用
 */
export const isIE = () => {
    if (
        ua.indexOf('msie') !== -1 ||
        ua.indexOf('trident') !== -1
    ) {
        return true;
    }

    return false;
};

/**
 * Edge（EdgeHTML）判定用
 */
export const isEdgeHTML = () => {
    if (
        ua.indexOf('edge') !== -1
    ) {
        return true;
    }

    return false;
};
