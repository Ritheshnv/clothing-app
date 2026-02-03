const INITIAL_STATE = {
  collections: null,
  isLoading: false,
  errorMessage: undefined
}

const shopReducer = (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case 'FETCH_COLLECTIONS_START':
      return {
        ...state,
        isLoading: true,
        errorMessage: undefined
      };
    case 'FETCH_COLLECTIONS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        collections: action.payload,
        errorMessage: undefined
      };
    case 'FETCH_COLLECTIONS_FAILURE':
      return {
        ...state,
        isLoading: false,
        collections: null,
        errorMessage: action.payload
      };
    default:
      return state;
  }
};

export default shopReducer;