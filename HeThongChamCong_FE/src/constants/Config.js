/**
 * Development
 */
// export const BASE_URL_API = "http://10.11.7.23:22022"; // 7.23 X:\_deloy\HC_CHULAI\WEB
// export const BASE_URL_APP = `http://10.11.7.23:22023`;
// export const BASE_URL_APP = `http://localhost:4000`;

/**
 * Production
 */
export const BASE_URL_API = "http://10.14.6.5:3117"; // 7.20 Z:\APP\APP\HC_CHULAI\WEB
export const BASE_URL_APP = `${window.location.origin}`;

export const APP_NAME = "QUẢN LÝ CHẤM CÔNG";

export const PAGE_SIZE = 20;
export const DEFAULT_IMAGE_URL = `${BASE_URL_APP}/assets/images/no-image-found.png`;
/**
 * Default form layout
 */
export const DEFAULT_FORM_STYLE = {
    labelCol: {
        span: 6,
    },
    wrapperCol: {
        span: 18,
    },
};
