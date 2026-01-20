import React, { useState } from 'react';

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/shop?search=${encodeURIComponent(searchTerm)}`;
        }
    };

    return (
        <div className='py-4' style={{backgroundColor: '#FEF8F1'}}>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
                <form onSubmit={handleSearch} className='max-w-2xl mx-auto'>
                    <div className='relative'>
                        <input
                            type='text'
                            placeholder='Search for products...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className='w-full px-4 py-3 pr-12 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent'
                            style={{backgroundColor: '#FEF8F1'}}
                        />
                        <button
                            type='submit'
                            className='absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchBar;