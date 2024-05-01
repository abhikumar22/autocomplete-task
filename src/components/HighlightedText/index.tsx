interface HighlightedTextProps {
  text: string,
  searchText?: string
}

const HighlightedText = ({
  text,
  searchText,
}: HighlightedTextProps) => {

  /* if rendering text not present then return, no need to render the component */
  if (!text) return;

  /* if searchText is not present, then only render the text and return */
  if (!searchText) {
    return <span>{text}</span>;
  }

  /*  Split the the strings, with respect to the searchtext, 
      so that groups will be created out of the text and the matching text can be highligted
  */
  const strArr = text.split(new RegExp(`(${searchText})`, 'gi'));
  const isMatched = (listStr: string): boolean => {
    return !!(listStr.toLowerCase() === searchText.toLowerCase());
  }

  return (
    <span>
      {!!(strArr && strArr.length > 0)
        && strArr.map((ele, index) =>
          isMatched(ele) ? (
            <mark key={index}>{ele}</mark>
          ) : (
            ele
          )
        )}
    </span>
  );
};

export default HighlightedText;
