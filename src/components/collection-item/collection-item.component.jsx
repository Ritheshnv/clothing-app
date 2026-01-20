import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { addItem } from '../../redux/cart/cart.actions';
import './collection-item.styles.scss';
import CustomButton from '../custom-button/custom-button.component';

const CollectionItem = ({ item, addItem }) => {
    const { id, name, price, imageUrl } = item;
    return (
        <div className='group relative rounded-lg shadow-sm hover:shadow-md transition-shadow' style={{backgroundColor: '#FEF8F1'}}>
            <div className='relative'>
                <div
                    className='aspect-w-1 aspect-h-1 w-full h-64 md:h-80 bg-gray-200 rounded-t-lg overflow-hidden group-hover:opacity-75 transition-opacity'
                    style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                <Link to={`/product/${id}`} className='absolute top-2 right-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full px-3 py-2 transition-all opacity-0 group-hover:opacity-100 flex items-center space-x-1'>
                    <svg className='w-4 h-4 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 12a3 3 0 11-6 0 3 3 0 016 0z' />
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' />
                    </svg>
                    <span className='text-xs font-medium text-gray-700'>View</span>
                </Link>
            </div>
            <div className='p-4' style={{backgroundColor: '#FEF8F1'}}>
                <div className='flex justify-between items-start mb-3'>
                    <Link to={`/product/${id}`}>
                        <h3 className='text-sm md:text-base font-medium text-gray-900 line-clamp-2 hover:text-gray-600'>{name}</h3>
                    </Link>
                    <p className='text-sm md:text-base font-bold text-gray-900'>₹{price}</p>
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