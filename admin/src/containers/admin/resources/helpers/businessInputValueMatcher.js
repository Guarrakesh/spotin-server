const businessInputValueMatcher = (input, suggestion, getOptionText) =>
    getOptionText(suggestion)
        .toLowerCase()
        .trim()
    === (input.toLowerCase().trim())
;
export default businessInputValueMatcher