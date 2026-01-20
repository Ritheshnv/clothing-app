import React from 'react';
import { connect } from 'react-redux';
import { clearItemFromCart, addItem, removeItem } from '../../redux/cart/cart.actions';
import './checkout-item.styles.scss';

const CheckoutItem = ({ cartItem, clearItem, addItem, removeItem }) => {
    const { name, imageUrl, price, quantity } = cartItem;
    return (
        <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-4'>
            {/* Mobile Layout */}
            <div className='md:hidden'>
                <div className='flex items-center space-x-4 mb-4'>
                    <img src={imageUrl} alt='item' className='w-16 h-16 object-cover rounded' />
                    <div className='flex-1'>
                        <h3 className='font-medium text-gray-900'>{name}</h3>
                        <p className='text-gray-600'>₹{price}</p>
                    </div>
                    <button 
                        className='text-red-500 hover:text-red-700 p-2'
                        onClick={() => clearItem(cartItem)}
                    >
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                        </svg>
                    </button>
                </div>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                        <button 
                            className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50'
                            onClick={() => removeItem(cartItem)}
                        >
                            -
                        </button>
                        <span className='font-medium'>{quantity}</span>
                        <button 
                            className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50'
                            onClick={() => addItem(cartItem)}
                        >
                            +
                        </button>
                    </div>
                    <div className='font-bold text-lg'>₹{price * quantity}</div>
                </div>
            </div>
            
            {/* Desktop Layout */}
            <div className='hidden md:grid md:grid-cols-5 gap-4 items-center'>
                <div className='flex items-center space-x-3'>
                    <img src={imageUrl} alt='item' className='w-16 h-16 object-cover rounded' />
                </div>
                <div className='font-medium text-gray-900'>{name}</div>
                <div className='flex items-center space-x-3'>
                    <button 
                        className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50'
                        onClick={() => removeItem(cartItem)}
                    >
                        -
                    </button>
                    <span className='font-medium w-8 text-center'>{quantity}</span>
                    <button 
                        className='w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50'
                        onClick={() => addItem(cartItem)}
                    >
                        +
                    </button>
                </div>
                <div className='font-bold'>₹{price * quantity}</div>
                <div className='flex justify-center'>
                    <button 
                        className='text-red-500 hover:text-red-700 p-2'
                        onClick={() => clearItem(cartItem)}
                    >
                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                            <path fillRule='evenodd' d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z' clipRule='evenodd' />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
};

const mapDispatchtoProps = dispatch => ({
    clearItem: item => dispatch(clearItemFromCart(item)),
    addItem: item => dispatch(addItem(item)),
    removeItem: item => dispatch(removeItem(item))
})

export default connect(null, mapDispatchtoProps)(CheckoutItem);