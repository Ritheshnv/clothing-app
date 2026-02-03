import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { selectCollectionsForPreview } from '../../redux/shop/shop.selectors';
import './trending-section.styles.css';

const TrendingSection = ({ collections }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isHovered, setIsHovered] = useState(false);
    const [trendingItems, setTrendingItems] = useState([]);
    
    useEffect(() => {
        if (collections && collections.length > 0) {
            // Get all items from collections and take first 5
            const allItems = [];
            collections.forEach(collection => {
                if (collection.items) {
                    collection.items.forEach(item => {
                        allItems.push({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.imageUrl,
                            category: collection.routeName
                        });
                    });
                }
            });
            setTrendingItems(allItems.slice(0, 5)); // Limit to 5 items
        } else {
            // Fallback items using CloudFront URLs
            setTrendingItems([
                { id: 'silk-1', name: 'Elegant Silk Saree', price: 5992, image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-4/main.jpg', category: 'silk' },
                { id: 'cotton-1', name: 'Cotton Saree', price: 2392, image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-2/main.jpg', category: 'cotton' },
                { id: 'silk-2', name: 'Designer Silk', price: 7500, image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-1/main.jpg', category: 'silk' },
                { id: 'cotton-2', name: 'Casual Cotton', price: 3200, image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/cotton/cotton-1/main.jpg', category: 'cotton' },
                { id: 'silk-3', name: 'Bridal Silk', price: 12000, image: 'https://d3jifdeyjpus7e.cloudfront.net/sarees/silk/silk-3/main.jpg', category: 'silk' }
            ]);
        }
    }, [collections]);

    useEffect(() => {
        const updateItemsPerView = () => {
            if (window.innerWidth < 768) {
                setItemsPerView(1);
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

    useEffect(() => {
        if (trendingItems.length > 0) {
            const interval = setInterval(() => {
                setCurrentIndex(prev => {
                    return (prev + 1) % Math.max(1, trendingItems.length - itemsPerView + 1);
                });
            }, isHovered ? 3000 : 2000);

            return () => clearInterval(interval);
        }
    }, [itemsPerView, trendingItems.length, isHovered]);

    const getItemWidth = () => {
        return `${100 / itemsPerView}%`;
    };

    const totalDots = Math.max(1, trendingItems.length - itemsPerView + 1);

    if (!trendingItems.length) {
        return (
            <div className='py-8'>
                <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>Trending Now</h2>
                <div className='text-center text-gray-500'>Loading trending items...</div>
            </div>
        );
    }

    return (
        <div className='py-8'>
            <h2 className='text-2xl md:text-3xl font-bold text-center mb-8'>Trending Now</h2>
            <div className='mx-auto px-4 sm:px-6 lg:px-8'>
                <div 
                    className='relative'
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <div className='overflow-hidden'>
                        <div 
                            className='flex transition-transform duration-500 ease-out'
                            style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                        >
                            {trendingItems.map((item) => (
                                <Link 
                                    key={item.id} 
                                    to={`/shop/${item.category}`}
                                    className='flex-shrink-0 px-3 cursor-pointer' 
                                    style={{ width: getItemWidth() }}
                                >
                                    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                                        <img 
                                            src={item.image}
                                            alt={item.name}
                                            className='h-48 w-full object-cover'
                                        />
                                        <div className='p-4'>
                                            <h3 className='font-medium text-sm mb-2 truncate'>{item.name}</h3>
                                            <p className='text-lg font-bold'>₹{item.price}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex justify-center mt-6 space-x-2'>
                    {Array.from({ length: totalDots }).map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${
                                currentIndex === index ? 'bg-blue-600' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const mapStateToProps = createStructuredSelector({
    collections: selectCollectionsForPreview
});

export default connect(mapStateToProps)(TrendingSection);