import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReactComponent as Logo } from '../../assets/crown.svg';
import { auth } from '../../firebase/firebase.utils';
import CartIcon from '../cart-icon/cart-icon.component';
import CartDropdown from '../cart-dropdown/cart-dropdown.component';
import './header.styles.scss';

const Header = ({ currentUser, hidden }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return (
        <header className='bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-16 md:h-20'>
                    <Link className='flex items-center' to="/">
                        <Logo className='h-8 w-8 md:h-10 md:w-10' />
                    </Link>
                    <nav className='hidden md:flex items-center space-x-8'>
                        <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/shop'>SHOP</Link>
                        <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/shop'>CONTACT</Link>
                        {currentUser ?
                            <button className='text-gray-700 hover:text-gray-900 font-medium transition-colors' onClick={() => auth.signOut()}>
                                SIGN OUT
                            </button> :
                            <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/signin'>SIGN IN</Link>
                        }
                        <div className='relative'>
                            <CartIcon />
                            {hidden ? null : <CartDropdown />}
                        </div>
                    </nav>
                    <div className='md:hidden flex items-center space-x-4'>
                        <div className='relative'>
                            <CartIcon />
                            {hidden ? null : <CartDropdown />}
                        </div>
                        <button className='text-gray-700 hover:text-gray-900' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className='md:hidden pb-4'>
                        <nav className='flex flex-col space-y-2'>
                            <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/shop'>SHOP</Link>
                            <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/shop'>CONTACT</Link>
                            {currentUser ?
                                <button className='text-gray-700 hover:text-gray-900 font-medium py-2 text-left' onClick={() => auth.signOut()}>
                                    SIGN OUT
                                </button> :
                                <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/signin'>SIGN IN</Link>
                            }
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
};

const mapStateToProps = ({ user: { currentUser }, cart: { hidden } }) => ({
    currentUser,
    hidden
})

export default connect(mapStateToProps)(Header);