import React from 'react';
import CollectionItem from '../../components/collection-item/collection-item.component';
import { selectCollection } from '../../redux/shop/shop.selectors';
import './collection.styles.scss';
import { connect } from 'react-redux';


const CollectionPage = ({ collection }) => {
  if (!collection) {
    return (
      <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center min-h-[60vh]'>
        <div className='text-6xl animate-bounce'>👗</div>
        <div className='flex space-x-2 mt-4'>
          <span className='text-4xl animate-pulse' style={{animationDelay: '0s'}}>✨</span>
          <span className='text-4xl animate-pulse' style={{animationDelay: '0.2s'}}>💫</span>
          <span className='text-4xl animate-pulse' style={{animationDelay: '0.4s'}}>⭐</span>
        </div>
        <p className='text-xl text-gray-600 mt-6 animate-pulse'>Loading beautiful collection...</p>
      </div>
    );
  }
  
  const { title, items } = collection;
  return (
    <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
      <h2 className='text-3xl md:text-4xl font-bold mb-8 text-center'>{title}</h2>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
        {
          items.map(item => (
            <CollectionItem key={item.id} item={item} />
          ))
        }
      </div>
    </div>
  );
}

const mapStateToProps = (state, ownProps) => ({
  collection: selectCollection(ownProps.match.params.collectionId)(state)
});


export default connect(mapStateToProps)(CollectionPage);

