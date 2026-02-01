import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './trending-section.styles.css';

const TrendingSection = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(4);
    const [isHovered, setIsHovered] = useState(false);
    
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
        const interval = setInterval(() => {
            setCurrentIndex(prev => {
                return (prev + 1) % (trendingItems.length - itemsPerView + 1);
            });
        }, isHovered ? 3000 : 2000);

        return () => clearInterval(interval);
    }, [itemsPerView, trendingItems.length, isHovered]);

    const getItemWidth = () => {
        return `${100 / itemsPerView}%`;
    };

    const totalDots = trendingItems.length - itemsPerView + 1;

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
                                    to={`/product/${item.id}`}
                                    className='flex-shrink-0 px-3 cursor-pointer' 
                                    style={{ width: getItemWidth() }}
                                >
                                    <div className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'>
                                        <div 
                                            className='h-48 bg-cover bg-center'
                                            style={{ backgroundImage: `url(${item.image})` }}
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

export default TrendingSection;