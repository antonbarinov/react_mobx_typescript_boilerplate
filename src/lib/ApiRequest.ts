import axios, { AxiosRequestConfig, Method, AxiosError, AxiosResponse } from 'axios';
import userState from 'globalState/user';

/**
 * API BASE URL
 */
let apiUrl = '/api';

// Environment api path
if (process.env.NODE_ENV === 'production') {
    apiUrl = 'https://thy2j.sse.codesandbox.io';
}

window.API_BASE_URL = apiUrl;

export const API_BASE_URL = apiUrl;

/**
 * API BASE URL -- END
 */

type UploadProgressFn = (uploadPercentage: number) => any;

export default class ApiRequest<T extends any> {
    private __unifyErrorsHandler = true;
    private __method: Method = 'GET';
    private __url = '/';
    private __options: AxiosRequestConfig = {
        headers: {},
    };
    private __data = null;
    private __onUploadProgress: UploadProgressFn = null;

    constructor(url = 'GET /', unifyErrorsHandler = true) {
        this.__unifyErrorsHandler = unifyErrorsHandler;
        const spaceIndex = url.indexOf(' ');
        this.__method = url
            .substr(0, spaceIndex)
            .trim()
            .toUpperCase() as Method;
        this.__url = url.substr(spaceIndex + 1).trim();

        if (!this.isAbsolute(API_BASE_URL) && !this.isAbsolute(url)) {
            this.__url = window.location.origin + API_BASE_URL + this.__url;
        } else {
            this.__url = API_BASE_URL + this.__url;
        }
    }

    private isAbsolute(url: string) {
        return url.indexOf('http://') === 0 || url.indexOf('https://') === 0 || url.indexOf('//') === 0;
    }

    qs(params: object = {}) {
        const url = new URL(this.__url, window.location.href);
        for (const key in params) {
            if (!params.hasOwnProperty(key)) continue;
            url.searchParams.set(key, params[key]);
        }

        this.__url = url.href;

        return this;
    }

    onUploadProgress(func: UploadProgressFn) {
        this.__onUploadProgress = func;

        return this;
    }

    options(options: AxiosRequestConfig = {}) {
        this.__options = {
            ...this.options,
            ...options,
        };

        return this;
    }

    private async __send() {
        let options: AxiosRequestConfig = {
            ...this.__options,
            method: this.__method,
        };
        if (this.__data !== null) options.data = this.__data;

        // Send authorization header if we can
        const userAccessToken = getUserAccessToken();
        if (userAccessToken) options.headers.Authorization = userAccessToken;

        options.url = this.__url;

        // Upload progress
        options.onUploadProgress = (progressEvent) => {
            let uploadPercentage = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total) + '');
            if (typeof this.__onUploadProgress === 'function') {
                this.__onUploadProgress(uploadPercentage);
            }
        };

        let response;
        let error;

        try {
            response = await axios(options);
        } catch (e) {
            error = e;
            response = e.response;
        } finally {
        }

        // Network connection error and there is no response object
        if (response === undefined) throw error;

        /**
         * Not authorized
         */
        if (response.status === 401) {
            userState.logout();
        }

        /**
         * Success
         */
        if (response.status >= 200 && response.status < 300) {
            let resp = response.data;

            return resp;
        } else {
            /**
             * Errors
             */
            error.message = (response.data && response.data.message) || error.message;

            if (!this.__unifyErrorsHandler) throw error;

            // Universal error handling here
            console.error(error);

            throw error;
        }
    }

    async sendJSON(data: object = {}): Promise<T> {
        this.__data = JSON.stringify(data);

        this.__options.headers['Content-Type'] = 'application/json';

        return this.__send();
    }

    async send(data = null): Promise<T> {
        this.__data = data;

        return this.__send();
    }
}

export function getUserAccessToken() {
    return window.localStorage.getItem('accessToken');
}

interface IApiValidationErrorFields {
    field?: string;
    message: string;
}

interface IApiErrorData {
    status: 'FAIL' | 'OK';
    message: string;
    errorType: 'validation' | 'message';
    errors: IApiValidationErrorFields[];
}

export interface IApiError extends AxiosError<any> {
    response: AxiosResponse<IApiErrorData>;
}
