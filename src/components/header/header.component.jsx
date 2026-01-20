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
    
    return (
        <header className='shadow-sm border-b border-gray-200 sticky top-0 z-50' style={{backgroundColor: '#FEF8F1'}}>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='flex justify-between items-center h-20 md:h-24 relative'>
                    <nav className='hidden md:flex items-center space-x-8'>
                        {currentUser ?
                            <button className='text-gray-700 hover:text-gray-900 font-medium transition-colors' onClick={() => auth.signOut()}>
                                SIGN OUT
                            </button> :
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
                        <a 
                            href='https://wa.me/917349327342?text=Hello%20Dihana%20Couture'
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-green-600 hover:text-green-700 transition-colors'
                        >
                            <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                                <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488'/>
                            </svg>
                        </a>
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
                    <a 
                        href='https://wa.me/917349327342?text=Hello%20Dihana%20Couture'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-green-600 hover:text-green-700 transition-colors bg-white rounded-full p-2 shadow-lg'
                    >
                        <svg className='w-6 h-6' fill='currentColor' viewBox='0 0 24 24'>
                            <path d='M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488'/>
                        </svg>
                    </a>
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
                                        <button className='text-gray-700 hover:text-gray-900 font-medium py-2 text-left' onClick={() => { auth.signOut(); setMobileMenuOpen(false); }}>
                                            SIGN OUT
                                        </button> :
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