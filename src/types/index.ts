export interface FetchProps {
    useAbortController: boolean
}

export interface FetcherResponse {
    status: number,
    message: string,
    data?: any,
}
