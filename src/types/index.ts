export interface FetchProps {
    useAbortController: boolean
}

export interface FetcherResponse {
    status: number,
    message: string,
    data?: AUTOCOMPLETE_API_RESPONSE,
}

interface Docs {
    name: string;
    _version_: number
}

export interface AUTOCOMPLETE_API_RESPONSE {
    data: {
        docs: Docs[]
    };
}

export interface DebounceInternalParams {
    apiUrl: string;
}
