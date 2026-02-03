import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCollectionsForPreview, selectIsCollectionFetching } from '../../redux/shop/shop.selectors';
import CollectionPreview from '../collection-preview/collection-preview.component';

const CollectionsOverview = ({ collections, isLoading }) => {
  console.log('CollectionsOverview - collections:', collections);
  console.log('CollectionsOverview - isLoading:', isLoading);
  
  if (isLoading) {
    return (
      <div className='py-8 text-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto'></div>
        <p className='mt-4'>Loading products...</p>
      </div>
    );
  }

  if (!collections || collections.length === 0) {
    return (
      <div className='py-8 text-center'>
        <p>No products available</p>
        <p className='text-sm text-gray-500 mt-2'>Check console for debugging info</p>
      </div>
    );
  }

  return (
    <div className='py-8'>
      {collections.map(({ id, ...otherCollections }) => {
        console.log('Rendering collection:', { id, ...otherCollections });
        return <CollectionPreview key={id} {...otherCollections} />;
      })}
    </div>
  );
};

const mapStatetoProps = createStructuredSelector({
  collections: selectCollectionsForPreview,
  isLoading: selectIsCollectionFetching
});

export default connect(mapStatetoProps)(CollectionsOverview);