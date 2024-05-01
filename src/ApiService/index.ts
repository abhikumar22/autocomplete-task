import {
    FetchProps,
    FetcherResponse
} from '../types';

/**
 * Creates a fetcher function that fetches data from the provided API endpoint.
 * @param {Object} props - The properties object.
 * @param {boolean} props.useAbortController - Optional. Indicates whether to use an AbortController for managing fetch requests. Defaults to false.
 * @returns {Function} - A function that fetches data from the API endpoint based on provided parameters.
 */

export const fetcher = ({
    useAbortController = false
}: FetchProps): Function => {
    let controller: AbortController | null = null;

    return async function (params: any) {
        const { apiUrl } = params;
        // Create a new AbortController if useAbortController is true
        if (useAbortController) {
            if (!controller) {
                controller = new AbortController();
            } else {
                // Abort the ongoing request if it exists
                controller.abort();
                controller = new AbortController();
            }
        }

        if (!apiUrl) {
            return { status: 0, message: `URL is a required parameter !!!!` }
        }

        let response: FetcherResponse;
        try {
            // Fetch data using the provided URL and AbortController's signal if useAbortController is true
            let res: any;
            if (useAbortController) {
                res = await fetch(apiUrl, { signal: controller!.signal });
            } else {
                res = await fetch(apiUrl);
            }
            res = await res.json();
            response = {
                status: 1,
                message: 'Data Fetched successfully',
                data: res
            }
        } catch (e: any) {
            // Handle fetch errors
            if ((e.name === 'AbortError' || e.code === 20)) {
                return
            }
            response = {
                status: 0,
                message: `API call failed with error:: ${e.message}`
            }
        }

        return response;
    }
};

