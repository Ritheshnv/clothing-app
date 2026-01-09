import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import CheckoutItem from '../../components/checkout-item/checkout-item.component';
import { selectCartItems, selectCartTotal } from '../../redux/cart/cart.selectors';
import StripCheckoutButton from '../../components/stripe-button/stripe-button.component';
import './checkout.styles.scss';

const CheckoutPage = ({ cartItems, total }) => (
    <div className='max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-8'>Checkout</h1>
        
        {/* Desktop Header */}
        <div className='hidden md:grid md:grid-cols-5 gap-4 py-4 border-b border-gray-200 mb-6'>
            <div className='font-medium text-gray-900'>Product</div>
            <div className='font-medium text-gray-900'>Description</div>
            <div className='font-medium text-gray-900'>Quantity</div>
            <div className='font-medium text-gray-900'>Price</div>
            <div className='font-medium text-gray-900'>Remove</div>
        </div>
        
        <div className='space-y-4 mb-8'>
            {
                cartItems.length ? (
                    cartItems.map(cartItem =>
                        <CheckoutItem key={cartItem.id} cartItem={cartItem} />
                    )
                ) : (
                    <div className='text-center py-12'>
                        <p className='text-gray-500 text-lg'>Your cart is empty</p>
                    </div>
                )
            }
        </div>
        
        {cartItems.length > 0 && (
            <div className='border-t border-gray-200 pt-6'>
                <div className='flex justify-end mb-6'>
                    <div className='text-2xl font-bold text-gray-900'>
                        TOTAL: ${total}
                    </div>
                </div>
                <div className='flex justify-end'>
                    <div className='w-full max-w-xs'>
                        <StripCheckoutButton price={total} />
                    </div>
                </div>
            </div>
        )}
    </div>
);

const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems,
    total: selectCartTotal
})

export default connect(mapStateToProps, null)(CheckoutPage);
