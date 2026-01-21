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
    const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    
    // Get user display name, fallback to first part of email
    const getUserDisplayName = () => {
        if (currentUser?.displayName) {
            return currentUser.displayName;
        }
        if (currentUser?.email) {
            return currentUser.email.split('@')[0].toUpperCase();
        }
        return 'ACCOUNT';
    };
    
    return (
        <header className='shadow-sm border-b border-gray-200 sticky top-0 z-50' style={{backgroundColor: '#FEF8F1'}}>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-20 md:h-24 relative'>
                    <nav className='hidden md:flex items-center space-x-8'>
                        {currentUser ?
                            <div className='relative'>
                                <button 
                                    className='text-gray-700 hover:text-gray-900 font-medium transition-colors flex items-center space-x-1'
                                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                >
                                    <span>{getUserDisplayName()}</span>
                                    <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                                    </svg>
                                </button>
                                {userDropdownOpen && (
                                    <div className='absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                                        <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/profile' onClick={() => setUserDropdownOpen(false)}>Profile</Link>
                                        <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/orders' onClick={() => setUserDropdownOpen(false)}>My Orders</Link>
                                        <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/settings' onClick={() => setUserDropdownOpen(false)}>Settings</Link>
                                        <button className='block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100' onClick={() => { auth.signOut(); setUserDropdownOpen(false); }}>Sign Out</button>
                                    </div>
                                )}
                            </div> :
                            <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/signin'>SIGN IN</Link>
                        }
                        <Link className='text-gray-700 hover:text-gray-900 font-medium transition-colors' to='/contact'>CONTACT</Link>
                        <div className='relative'>
                            <button 
                                className='text-gray-700 hover:text-gray-900 font-medium transition-colors'
                                onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                            >
                                SHOP
                            </button>
                            {shopDropdownOpen && (
                                <div className='absolute top-full left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50'>
                                    <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/' onClick={() => setShopDropdownOpen(false)}>All Categories</Link>
                                    <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/shop/wedding-sarees' onClick={() => setShopDropdownOpen(false)}>Wedding Sarees</Link>
                                    <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/shop/party-wears' onClick={() => setShopDropdownOpen(false)}>Party Wears</Link>
                                    <Link className='block px-4 py-2 text-gray-700 hover:bg-gray-100' to='/shop/ceremonies' onClick={() => setShopDropdownOpen(false)}>Ceremonies</Link>
                                </div>
                            )}
                        </div>
                    </nav>
                    <Link className='absolute left-1/2 transform -translate-x-1/2 flex items-center' to="/">
                        <img src={logo} alt='Dihana Logo' className='h-16 w-auto md:h-20' />
                    </Link>
                    <div className='hidden md:flex items-center space-x-4'>
                        <div className='relative'>
                            <CartIcon />
                            {hidden ? null : <CartDropdown />}
                        </div>
                    </div>
                    <div className='md:hidden flex items-center'>
                        <button className='text-gray-700 hover:text-gray-900 mr-4' onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className='md:hidden absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-3 z-40'>
                    <div className='relative'>
                        <CartIcon />
                        {hidden ? null : <CartDropdown />}
                    </div>
                </div>
                {mobileMenuOpen && (
                    <>
                        <div className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden' onClick={() => setMobileMenuOpen(false)} />
                        <div className='fixed top-0 left-0 h-full w-64 z-50 md:hidden transform transition-transform duration-300 ease-in-out' style={{backgroundColor: '#FEF8F1'}}>
                            <div className='p-6'>
                                <button className='mb-6 text-gray-700 hover:text-gray-900' onClick={() => setMobileMenuOpen(false)}>
                                    <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                                    </svg>
                                </button>
                                <nav className='flex flex-col space-y-4'>
                                    <div>
                                        <button 
                                            className='text-gray-700 hover:text-gray-900 font-medium py-2 w-full text-left'
                                            onClick={() => setShopDropdownOpen(!shopDropdownOpen)}
                                        >
                                            SHOP
                                        </button>
                                        {shopDropdownOpen && (
                                            <div className='ml-4 mt-2 space-y-2'>
                                                <Link className='block text-gray-600 hover:text-gray-900 py-1' to='/' onClick={() => { setShopDropdownOpen(false); setMobileMenuOpen(false); }}>All Categories</Link>
                                                <Link className='block text-gray-600 hover:text-gray-900 py-1' to='/shop/wedding-sarees' onClick={() => { setShopDropdownOpen(false); setMobileMenuOpen(false); }}>Wedding Sarees</Link>
                                                <Link className='block text-gray-600 hover:text-gray-900 py-1' to='/shop/party-wears' onClick={() => { setShopDropdownOpen(false); setMobileMenuOpen(false); }}>Party Wears</Link>
                                                <Link className='block text-gray-600 hover:text-gray-900 py-1' to='/shop/ceremonies' onClick={() => { setShopDropdownOpen(false); setMobileMenuOpen(false); }}>Ceremonies</Link>
                                            </div>
                                        )}
                                    </div>
                                    <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/contact' onClick={() => setMobileMenuOpen(false)}>CONTACT</Link>
                                    {currentUser ?
                                        <div>
                                            <Link className='block text-gray-700 hover:text-gray-900 font-medium py-2' to='/profile' onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                                            <Link className='block text-gray-700 hover:text-gray-900 font-medium py-2' to='/orders' onClick={() => setMobileMenuOpen(false)}>My Orders</Link>
                                            <Link className='block text-gray-700 hover:text-gray-900 font-medium py-2' to='/settings' onClick={() => setMobileMenuOpen(false)}>Settings</Link>
                                            <button className='text-gray-700 hover:text-gray-900 font-medium py-2 text-left w-full' onClick={() => { auth.signOut(); setMobileMenuOpen(false); }}>
                                                SIGN OUT
                                            </button>
                                        </div> :
                                        <Link className='text-gray-700 hover:text-gray-900 font-medium py-2' to='/signin' onClick={() => setMobileMenuOpen(false)}>SIGN IN</Link>
                                    }
                                </nav>
                            </div>
                        </div>
                    </>
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