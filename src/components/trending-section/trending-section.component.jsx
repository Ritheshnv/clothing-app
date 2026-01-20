import React, { useState, useEffect } from 'react';
import './trending-section.styles.css';

const TrendingSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    
    const trendingItems = [
        { id: 1, name: 'Elegant Silk Saree', price: 2500, image: 'https://i.ibb.co/KV18Ysr/floral-skirt.png' },
        { id: 2, name: 'Designer Lehenga', price: 4500, image: 'https://i.ibb.co/0s3pdnc/adidas-nmd.png' },
        { id: 3, name: 'Bridal Collection', price: 8500, image: 'https://i.ibb.co/XzcwL5s/black-shearling.png' },
        { id: 4, name: 'Party Wear Dress', price: 3200, image: 'https://i.ibb.co/ZYW3VTp/brown-brim.png' },
        { id: 5, name: 'Traditional Kurta', price: 1800, image: 'https://i.ibb.co/ypkgK0X/blue-beanie.png' },
        { id: 6, name: 'Festive Anarkali', price: 3800, image: 'https://i.ibb.co/QdJwgmp/brown-cowboy.png' },
        { id: 7, name: 'Wedding Sharara', price: 5200, image: 'https://i.ibb.co/RjBLWxB/grey-brim.png' },
        { id: 8, name: 'Cocktail Gown', price: 6800, image: 'https://i.ibb.co/YTjW3vF/green-beanie.png' },
        { id: 9, name: 'Ethnic Palazzo Set', price: 2800, image: 'https://i.ibb.co/rKBDvJX/palm-tree-cap.png' },
        { id: 10, name: 'Designer Dupatta', price: 1200, image: 'https://i.ibb.co/bLB646Z/red-beanie.png' }
    ];

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(2);
            } else if (window.innerWidth < 1024) {
                setItemsPerView(2);
            } else {
                setItemsPerView(4);
            }
        };
        
        updateItemsPerView();
        window.addEventListener('resize', updateItemsPerView);
        return () => window.removeEventListener('resize', updateItemsPerView);
    }, []);

    const maxIndex = trendingItems.length - itemsPerView;

    const goLeft = () => {
        setCurrentIndex(prev => prev > 0 ? prev - 1 : maxIndex);
    };

    const goRight = () => {
        setCurrentIndex(prev => prev < maxIndex ? prev + 1 : 0);
    };

    const getItemWidth = () => {
        return `${100 / itemsPerView}%`;
    };

    return (
        <div className='py-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900'>Trending Now</h2>
            <div className='mx-auto px-4 sm:px-6 lg:px-8'>
                <div className='relative'>
                    <button 
                        onClick={goLeft}
                        className='absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow-md transition-all'
                    >
                        <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
                        </svg>
                    </button>
                    
                    <div className='overflow-hidden mx-12'>
                        <div 
                            className='flex transition-transform duration-150 ease-out'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                        >
                            {trendingItems.map((item) => (
                                <div key={item.id} className='flex-shrink-0 px-3' style={{ width: getItemWidth() }}>
                                    <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                                        <div 
                                            className='h-48 bg-cover bg-center'
                                            style={{ backgroundImage: `url(${item.image})` }}
                                        />
                                        <div className='p-4'>
                                            <h3 className='font-medium text-gray-900 text-sm mb-2 truncate'>{item.name}</h3>
                                            <p className='text-lg font-bold text-gray-900'>₹{item.price}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <button 
                        onClick={goRight}
                        className='absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-100 hover:bg-gray-200 rounded-full p-3 shadow-md transition-all'
                    >
                        <svg className='w-5 h-5 text-gray-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TrendingSection;