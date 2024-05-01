# Autocomplete Assignment

## Live Preview


## Features
- Debounce: This function will cancel requests for earlier api calls when fast typing.
- Highlight: highlights texts, if substring matches with the searchtext
- abortRequests - explicitliy cancel previous requests, if pending (reduce no. of unneccesary api calls)
- Easily usable, extendable
## Run the project

- Clone the Repository
- Run `npm i`
- Development mode: Run `npm run dev`
- Production build: Run `npm run build`

## Props
| Name | Default Value | isOptional | Description | Type
|----------|----------|----------|----------|----------|
| debounceInterval    |  300        |          | cancel requests in between two key press         | number(in ms)
|  apiEndpoint    |  -        |    false      |  apiurl for getting results for autocomplete component        |string
| placeHolder    |   Enter Text       | true         | text for input placeholder         |string
| searchKey    | name         |    true      | key that needs to be searched in the json as results         | string
| apiResponseDataModifier    | -         |    false      | massager fn, which takes response of api and give the iterable list         | array<objects>