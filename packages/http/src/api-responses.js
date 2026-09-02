import { HTTP_CODES } from './constants/http-codes.js';
import { API_STATUS } from './constants/api-status.js';

/**
 * Every controller in every service should respond through this —
 * guarantees an identical response shape across the whole backend.
 *
 * @param {import('express').Response} res
 * @param {{ key?: keyof typeof HTTP_CODES, data?: any, message?: string }} opts
 */
export const send_response = (
    res,
    {
        key = "OK",
        data = null,
        message,
    } = {},
) => {
    const code =
        HTTP_CODES[key] ??
        HTTP_CODES.OK;

    const status =
        API_STATUS.SUCCESS;

    return res.status(code).json({
        status,
        message: message ?? status,
        data,
    });
};

export const send_error = (
    res,
    {
        status_code = HTTP_CODES.INTERNAL_SERVER_ERROR,
        status,
        message,
    } = {},
) => {
    const api_status =
        status ??
        (
            status_code >= 400 &&
            status_code < 500
                ? API_STATUS.FAIL
                : API_STATUS.ERROR
        );

    return res.status(status_code).json({
        status: api_status,
        message: message ?? api_status,
    });
};