import React from 'react';
import { connect } from 'react-redux';
import { addItem } from '../../redux/cart/cart.actions';
import './collection-item.styles.scss';
import CustomButton from '../custom-button/custom-button.component';

const CollectionItem = ({ item, addItem }) => {
    const { name, price, imageUrl } = item;
    return (
        <div className='group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow'>
            <div
                className='aspect-w-1 aspect-h-1 w-full h-64 md:h-80 bg-gray-200 rounded-t-lg overflow-hidden group-hover:opacity-75 transition-opacity'
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            />
            <div className='p-4'>
                <div className='flex justify-between items-start mb-3'>
                    <h3 className='text-sm md:text-base font-medium text-gray-900 line-clamp-2'>{name}</h3>
                    <p className='text-sm md:text-base font-bold text-gray-900'>${price}</p>
                </div>
                <CustomButton onClick={() => addItem(item)} inverted>
                    Add to cart
                </CustomButton>
            </div>
        </div>
    )
};

const mapDispatchToProps = dispatch => ({
    addItem: item => dispatch(addItem(item)),
})

export default connect(null, mapDispatchToProps)(CollectionItem);