import {createSelector} from 'reselect';


const selectShop = state => state.shop;

export const selectCollections = createSelector(
  [selectShop],
  shop => shop.collections
);


export const selectCollectionsForPreview = createSelector(
  [selectCollections],
  collections => collections ? Object.keys(collections).map(key => collections[key]) : []
 );

export const selectCollection = collectionUrlParam =>
createSelector(
  [selectCollections],
  collections => collections ? collections[collectionUrlParam] : null
);

export const selectIsCollectionFetching = createSelector(
  [selectShop],
  shop => shop.isLoading
);

export const selectIsCollectionsLoaded = createSelector(
  [selectShop],
  shop => {
    const loaded = !!shop.collections && Object.keys(shop.collections).length > 0;
    console.log('selectIsCollectionsLoaded - shop.collections:', shop.collections);
    console.log('selectIsCollectionsLoaded - loaded:', loaded);
    return loaded;
  }
);