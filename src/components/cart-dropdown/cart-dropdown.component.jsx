import React from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { withRouter } from 'react-router-dom';
import CartItem from '../cart-item/cart-item.component';
import CustomButton from '../custom-button/custom-button.component';
import { selectCartItems } from '../../redux/cart/cart.selectors';
import { toggleCartHidden } from '../../redux/cart/cart.actions';
import './cart-dropdown.styles.scss';

const CartDropdown = ({ cartItems, history, dispatch }) => (
    <div className='fixed top-16 right-4 left-4 sm:absolute sm:top-full sm:right-0 sm:left-auto mt-2 w-auto sm:w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
        <div className='max-h-64 overflow-y-auto p-4'>
            {
                cartItems.length ? (
                    cartItems.map(cartItem =>
                        <CartItem key={cartItem.id} item={cartItem} />
                    ))
                    :
                    <span className='text-gray-500 text-center block py-8'>Your cart is empty</span>
            }
        </div>
        <div className='p-4 border-t border-gray-200'>
            <CustomButton onClick={() => {
                history.push('/checkout');
                dispatch(toggleCartHidden())
            }}>
                GO TO CHECKOUT
            </CustomButton>
        </div>
    </div>
);

const mapStateToProps = createStructuredSelector({
    cartItems: selectCartItems
})

export default withRouter(connect(mapStateToProps, null)(CartDropdown));