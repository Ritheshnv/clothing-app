import React, { useState, useEffect } from 'react';

const Carousel = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slides = [
        {
            title: "Summer Collection 2024 - Up to 50% Off",
            image: "https://i.ibb.co/KV18Ysr/floral-skirt.png"
        },
        {
            title: "New Arrivals - Latest Fashion Trends",
            image: "https://i.ibb.co/0s3pdnc/adidas-nmd.png"
        },
        {
            title: "Free Shipping on Orders Over $100",
            image: "https://i.ibb.co/XzcwL5s/black-shearling.png"
        },
        {
            title: "Premium Quality - Affordable Prices",
            image: "https://i.ibb.co/ZYW3VTp/brown-brim.png"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [slides.length]);

    return (
        <div className='py-8 flex justify-center'>
            <div className='w-3/4 bg-white rounded-lg shadow-sm overflow-hidden'>
                <div className='relative h-64 md:h-80'>
                    <img 
                        src={slides[currentSlide].image} 
                        alt={slides[currentSlide].title}
                        className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center'>
                        <h2 className='text-white text-2xl md:text-4xl font-bold text-center px-4'>
                            {slides[currentSlide].title}
                        </h2>
                    </div>
                    <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition-colors ${
                                    index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
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