import { fetchProducts } from '../../services/shopService';

export const fetchCollectionsStart = () => ({
  type: 'FETCH_COLLECTIONS_START'
});

export const fetchCollectionsSuccess = (collectionsMap) => ({
  type: 'FETCH_COLLECTIONS_SUCCESS',
  payload: collectionsMap
});

export const fetchCollectionsFailure = (errorMessage) => ({
  type: 'FETCH_COLLECTIONS_FAILURE',
  payload: errorMessage
});

export const fetchCollectionsStartAsync = () => {
  return async dispatch => {
    dispatch(fetchCollectionsStart());
    try {
      const collections = await fetchProducts();
      if (collections === null) {
        throw new Error('No products available or API error');
      }
      dispatch(fetchCollectionsSuccess(collections));
    } catch (error) {
      console.error('Failed to fetch collections:', error);
      dispatch(fetchCollectionsFailure(error.message));
    }
  };
};