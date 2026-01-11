import React, { useState, useEffect } from 'react';

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        "Summer Collection 2024 - Up to 50% Off",
        "New Arrivals - Latest Fashion Trends",
        "Free Shipping on Orders Over $100",
        "Premium Quality - Affordable Prices"
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className='bg-gray-100 py-8'>
            <div className='container mx-auto px-4'>
                <div className='text-center'>
                    <h2 className='text-2xl md:text-4xl font-bold text-gray-900 mb-4'>
                        {slides[currentSlide]}
                    </h2>
                    <div className='flex justify-center space-x-2'>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full ${
                                    index === currentSlide ? 'bg-gray-900' : 'bg-gray-400'
                                }`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Carousel;