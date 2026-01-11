import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../../assets/dihana-logo.png';
import { auth } from '../../firebase/firebase.utils';
import CartIcon from '../cart-icon/cart-icon.component';
import CartDropdown from '../cart-dropdown/cart-dropdown.component';
import './header.styles.scss';

const Header = ({ currentUser, hidden }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    
    return (
        <header className='shadow-sm border-b border-gray-200 sticky top-0 z-50' style={{backgroundColor: '#FEF8F1'}}>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-20 md:h-24'>
                    <nav className='hidden md:flex items-center space-x-8'>
                        <div className='relative'>
                            <CartIcon />
                            {hidden ? null : <CartDropdown />}
                        </div>
                        {currentUser ?
                            <button className='text-gray-700 hover:text-gray-900 font-medium transition-colors' onClick={() => auth.signOut()}>
                                SIGN OUT
                            </button> :
                            <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/signin'>SIGN IN</Link>
                        }
                        <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/contact'>CONTACT</Link>
                        <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/shop'>SHOP</Link>
                    </nav>
                    <Link className='flex items-center' to="/">
                        <img src={logo} alt='Dihana Logo' className='h-16 w-auto md:h-20' />
                    </Link>
                    <div className='md:hidden flex items-center space-x-4'>
                        <button className='text-gray-700 hover:text-gray-900' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                        </button>
                        <div className='relative'>
                            <CartIcon />
                            {hidden ? null : <CartDropdown />}
                        </div>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className='md:hidden pb-4'>
                        <nav className='flex flex-col space-y-2'>
                            <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/shop'>SHOP</Link>
                            <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/contact'>CONTACT</Link>
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