import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCollectionsForPreview } from '../../redux/shop/shop.selectors';
import CollectionItem from '../collection-item/collection-item.component';

const SearchResults = ({ collections, searchQuery }) => {
  const searchResults = React.useMemo(() => {
    if (!collections || !searchQuery) return [];
    
    const allItems = [];
    collections.forEach(collection => {
      if (collection.items) {
        collection.items.forEach(item => {
          if (item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
            allItems.push(item);
          }
        });
      }
    });
    return allItems;
  }, [collections, searchQuery]);

  return (
    <div className='py-8'>
      <div className='mb-8'>
        <h2 className='text-2xl md:text-3xl font-bold mb-4'>
          Search Results for "{searchQuery}"
        </h2>
        <p className='text-gray-600'>
          {searchResults.length} product{searchResults.length !== 1 ? 's' : ''} found
        </p>
      </div>
      
      {searchResults.length > 0 ? (
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6'>
          {searchResults.map((item) => (
            <CollectionItem key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className='text-center py-12'>
          <p className='text-gray-500 text-lg'>No products found matching your search.</p>
          <p className='text-gray-400 mt-2'>Try different keywords or browse our categories.</p>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = createStructuredSelector({
  collections: selectCollectionsForPreview
});

export default connect(mapStateToProps)(SearchResults);