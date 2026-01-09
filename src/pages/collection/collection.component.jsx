import React from 'react';
import CollectionItem from '../../components/collection-item/collection-item.component';
import { selectCollection } from '../../redux/shop/shop.selectors';
import './collection.styles.scss';
import { connect } from 'react-redux';


const CollectionPage = ({ collection }) => {
    const { title, items } = collection;
    return (
        <div className='max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
            <h2 className='text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center'>{title}</h2>
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

