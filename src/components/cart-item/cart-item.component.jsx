import React from 'react';

import './cart-item.styles.scss';

const CartItem = ({ item: { imageUrl, price, name, quantity } }) => (
    <div className='flex items-center space-x-3 py-2 border-b border-gray-100 last:border-b-0'>
        <img src={imageUrl} alt='item' className='w-12 h-12 object-cover rounded' />
        <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium text-gray-900 truncate'>{name}</p>
            <p className='text-sm text-gray-500'>{quantity} x ₹{price}</p>
        </div>
    </div>
);


export default CartItem;