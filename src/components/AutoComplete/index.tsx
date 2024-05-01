import React, { useState, useCallback } from 'react';
import HighlightedText from '../../components/HighlightedText';
import { debounceFn } from '../../helpers';
import { fetcher } from '../../ApiService';
import { FetcherResponse } from '../../types';
import { DEFAULT_DEBOUNCE_INTERVAL, PLACEHOLDER_TEXT, DEFAULT_SEARCH_KEY } from '../../constants';
import './style.css';

interface AutoCompleteProps {
    apiEndpoint: string,
    debounceInterval?: number,
    placeHolder?: string
    searchKey?: string,
    isAbortPendingRequests?: boolean,
    apiResponseDataModifier: Function,
}

const AutoComplete = ({
    apiEndpoint,
    debounceInterval = DEFAULT_DEBOUNCE_INTERVAL,
    placeHolder = PLACEHOLDER_TEXT,
    searchKey = DEFAULT_SEARCH_KEY,
    isAbortPendingRequests = false,
    apiResponseDataModifier,
}: AutoCompleteProps) => {
    const [results, setResults] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    /* useCallback used to remove creation of multi fetcher during rerendering */
    const fetcherService = useCallback(fetcher({ useAbortController: isAbortPendingRequests }), []);

    // if no endpoint is provided, then return
    if (!apiEndpoint) return;

    // function to handle input change and further states changes
    const handleInputChange = useCallback(async (inputEvent: React.ChangeEvent<HTMLInputElement>) => {
        const inputText = inputEvent?.target?.value || '';

        // if text entered is empty, then rest the state variables
        if (!(inputText && inputText.length > 0)) {
            setResults([]);
            setSearchText('');
            setError('');
            return;
        };

        // resetting every states before the API call
        setResults([]);
        setLoading(true);
        setError('');

        // prepare url for getting records and set state variables
        const autocompleteGetUrl = `${apiEndpoint}&q=${inputText}`;
        const autoResults: FetcherResponse = await fetcherService({ apiUrl: autocompleteGetUrl });
        if (autoResults.status === 1) {
            const transformedResult = apiResponseDataModifier ? apiResponseDataModifier(autoResults) : [];
            setResults(transformedResult);
            setSearchText(inputText);
        } else {
            setError(autoResults.message);
        }
        setLoading(false);
    }, []);

    // variable to check if error, accordingly then set the message in screen
    const isError =
        !!((error && error.length > 0)
            && (results && results.length <= 0));

    return (
        <div className='Wrapper'>
            <div className='Container'>
                <span>AutoComplete Component</span>
                <input
                    placeholder={placeHolder}
                    onChange={debounceFn({ fn: handleInputChange, delay: debounceInterval })}
                />
                {loading && <span>Loading ......</span>}
            </div>
            <div>
                {/* currRes type any because, it can have any inputs and hirercy, controlled by parent */}
                {results && results.length > 0 && results.map((currRes: any) => {
                    const name = currRes[searchKey];
                    return (
                        <div key={name}>
                            <HighlightedText text={name} searchText={searchText} />
                        </div>
                    )
                })}
            </div>
            {isError && error}
        </div>
    );
};

export default AutoComplete;
